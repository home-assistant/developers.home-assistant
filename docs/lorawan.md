---
title: "LoRaWAN integrations"
sidebar_label: LoRaWAN
---

The `lorawan` integration connects server integrations to device integrations through the [`lorawan-connection`](https://home-assistant-libs.github.io/lorawan-connection/) Python package.

- **Server integrations** configure a backend and register its connection with Home Assistant.
- **Device integrations** use `DeviceManager` to access matching devices on all available LoRaWAN connections and expose their entities.

Both declare `"dependencies": ["lorawan"]` in their manifests. Backend communication and device decoding belong in Python libraries; Home Assistant integrations handle configuration, discovery, and entities.

## Connection providers

### Implement the backend

A backend implements the `Connection` protocol from `lorawan-connection`:

- `async_subscribe(*, brands, callback)` delivers the complete matching inventory before returning an unsubscribe callback, then delivers live device events. `brands` is a `frozenset` of `(stack, brand_id)` pairs; `None` selects all devices, and an empty set selects none.
- `on_disconnect(callback)` reports connection loss and returns an unsubscribe callback.
- `async_send_downlink(downlink)` queues a command and returns its queue ID.

Use the provider's config entry ID as the backend's `network_id`. Include the backend's native `stack`, `brand_id`, and `model_id` in device descriptors so discovery and model selection can match them.

See the library's [backend implementation guide](https://home-assistant-libs.github.io/lorawan-connection/connection/adding-a-backend/) for event ordering, filtering, and downlink requirements.

Declare the backend's dependencies in the server integration's `requirements`. For an adapter distributed as a `lorawan-connection` extra, pin the same version as the shared integration. For example, these manifest fields select the ChirpStack adapter:

```json
{
  "dependencies": ["lorawan"],
  "requirements": ["lorawan-connection[chirpstack]==0.12.0"]
}
```

Import the adapter in the server integration. Device integrations use the shared connection interface and do not need the backend's optional dependencies.

### Register a connection

After connecting the backend in `async_setup_entry`, register it with `lorawan.async_register_connection`. The `connection` object implements `Connection` from the `lorawan-connection` package:

```python
from lorawan_connection import Connection

from homeassistant.components import lorawan
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant


async def async_register_server(
    hass: HomeAssistant, entry: ConfigEntry, connection: Connection
) -> None:
    """Register an already connected backend during entry setup."""
    unsubscribe = await lorawan.async_register_connection(
        hass, entry, connection=connection
    )
    entry.async_on_unload(unsubscribe)
```

Registration waits for the discovery subscription's initial inventory. Only one connection can be registered per provider entry. The returned callback withdraws the connection and removes discovery subscriptions; it does not close the backend.

The provider owns authentication, reconnection, and transport shutdown:

- Close the backend if setup fails or is canceled. Translate authentication failures to `ConfigEntryAuthFailed` and temporary connection failures to `ConfigEntryNotReady`.
- On connection loss, `lorawan` withdraws the registration. The provider must recover or reload its entry, then register the replacement connection with the same `network_id`.
- On unload and Home Assistant shutdown, remove recovery listeners, withdraw the registration, and close the backend. Remove recovery listeners before intentional closure to avoid scheduling a reload.

### Observe registered connections

Most device integrations should use `DeviceManager`. Other consumers can use these public functions from `homeassistant.components.lorawan`:

- `async_get_connections(hass)` returns a snapshot mapping provider entry IDs to active `Connection` objects.
- `async_subscribe_connections(hass, listener)` immediately replays active connections, then calls `listener(entry_id, connection)` for registrations and `listener(entry_id, None)` for withdrawals. It returns an unsubscribe callback.

Callbacks are synchronous and run on the event loop. Register the unsubscribe callback with `entry.async_on_unload`. Consumers own any device-event subscriptions they create on a connection and must release them on withdrawal or unload.

## Device integrations

### Declare discovery matchers

The manifest's [`lorawan` field](creating_integration_manifest.md#lorawan) lists `(stack, brand_id)` pairs. A matching device starts `async_step_integration_discovery` with an empty discovery dictionary. The integration must have a config flow and depend on `lorawan`.

Use one config entry for the vendor, with the integration domain as its unique ID. Handle both user setup and integration discovery through a confirmation step, and abort duplicates with `_abort_if_unique_id_configured()`. The manager finds devices across all connections, so this entry needs no server selection.

The device library supplies `Device` subclasses and a `DeviceCollection` subclass whose `DEVICES` lists its supported models. Models declare identities as `stack: (brand_id, model_id)` pairs. Manifest matchers discover the integration by brand; the collection selects supported models. See [writing a device library](https://home-assistant-libs.github.io/lorawan-connection/patterns/library/).

### Set up the device manager

`DeviceManager` creates a collection per connection and a coordinator per matching device. Its collection factory receives a `Connection`; its coordinator factory receives `hass` and the device model. It also subscribes to connections registered after setup.

The following examples use `ExampleDevice` and `ExampleDevices` as placeholders for classes from your published device library. Declare that library in the integration's `requirements`.

```python
from example_lorawan import ExampleDevice, ExampleDevices

from homeassistant.components.lorawan import DeviceManager
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .coordinator import ExampleCoordinator

type ExampleConfigEntry = ConfigEntry[
    DeviceManager[ExampleDevice, ExampleCoordinator]
]
PLATFORMS = [Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ExampleConfigEntry) -> bool:
    manager = entry.runtime_data = DeviceManager(
        hass,
        entry,
        create_collection=ExampleDevices,
        create_coordinator=ExampleCoordinator,
    )
    entry.async_on_unload(manager.close)
    await manager.async_setup()
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ExampleConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
```

### Share device updates

Initialize the coordinator's `data` and subscribe to model updates in its constructor. All entities for the device share this coordinator. No polling interval or first refresh is needed:

```python
import logging
from typing import override

from example_lorawan import ExampleDevice

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

_LOGGER = logging.getLogger(__name__)


class ExampleCoordinator(DataUpdateCoordinator[ExampleDevice]):
    def __init__(self, hass: HomeAssistant, device: ExampleDevice) -> None:
        # DeviceManager owns coordinator shutdown when the model retires.
        super().__init__(
            hass, _LOGGER, config_entry=None, name=device.descriptor.name
        )
        self.async_set_updated_data(device)
        self._unsubscribe = device.add_update_listener(self._async_device_updated)

    @callback
    def _async_device_updated(self) -> None:
        self.async_set_updated_data(self.data)

    @override
    async def async_shutdown(self) -> None:
        self._unsubscribe()
        await super().async_shutdown()
```

Each entity platform subscribes to `manager.subscribe_coordinator_added(callback)`. This immediately delivers existing coordinators and reports future additions. Register its returned unsubscribe callback on entry unload. For example, in `sensor.py`, where `ExampleSensor` is your sensor entity:

```python
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import ExampleConfigEntry
from .coordinator import ExampleCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    @callback
    def added(coordinator: ExampleCoordinator) -> None:
        async_add_entities([ExampleSensor(coordinator)])

    entry.async_on_unload(entry.runtime_data.subscribe_coordinator_added(added))
```

### Entities and device identity

Derive entity classes from `LoRaWANEntity[ExampleDevice]` and the relevant platform entity class. `LoRaWANEntity` extends `CoordinatorEntity`, exposes the model as `self.device`, marks closed models unavailable, and prevents pending entity additions from recreating removed devices. Its `async_update()` is a no-op because updates arrive through subscriptions.

Use `device_identifier` from `homeassistant.components.lorawan` in your entity's `DeviceInfo`:

```python
from typing import override

from example_lorawan import ExampleDevice

from homeassistant.components.lorawan import LoRaWANEntity, device_identifier
from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN


class ExampleEntity(LoRaWANEntity[ExampleDevice]):
    @property
    @override
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(identifiers={device_identifier(DOMAIN, self.device)})
```

This identifier includes the integration domain, provider entry ID, and DevEUI. Include the provider entry ID and DevEUI in entity unique IDs too, followed by the channel or measurement key. This keeps devices on separate servers distinct even when they have the same DevEUI.

Keep payload decoding and command encoding in the device library. Entity properties read model state; entity actions call model methods and translate command failures to Home Assistant exceptions.

### Lifecycle

`DeviceManager` retains models and registry records during temporary connection loss and marks the affected coordinators unavailable. When a replacement connection registers, it reconciles the complete inventory and reuses models for devices that remain. A sleeping device does not become unavailable just because no uplink has arrived recently.

When a device is removed or its provider entry is deleted, the manager removes its device registry record and shuts down its coordinator. Home Assistant removes the associated entities. Normal vendor unload closes collections and coordinators while preserving registry records and leaving server transports open.

## Testing

Use `lorawan_connection.mock.MockConnection` with the real device collections to test initial inventory, live updates, discovery, entity creation, removal, and unload. Also cover:

- A connection registered after the device integration has loaded.
- Two connections containing the same DevEUI, with independent availability and commands.
- Disconnect and reconnect, including devices removed while offline.
- Setup failure, cancellation, and shutdown releasing subscriptions and transports.
- Device registry cleanup, including disabled entities and provider entries deleted while the device integration was unloaded.

Keep decoder tests in the device library. Backend tests should separately exercise real server authentication, inventory, event delivery, and downlinks.
