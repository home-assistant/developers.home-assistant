---
title: "Bluetooth APIs"
---

### Subscribing to Bluetooth discoveries

Some integrations may need to know when a device is discovered right away. The Bluetooth integration provides a registration API to receive callbacks when a new device is discovered that matches specific key values. The same format for `bluetooth` in [`manifest.json`](../../creating_integration_manifest#bluetooth) is used for matching. In addition to the matchers used in the `manifest.json`, `address` can also be used as a matcher.

The function `bluetooth.async_register_callback` is provided to enable this ability. The function returns a callback that will cancel the registration when called.

The below example shows registering to get callbacks when a Switchbot device is nearby.

```python
from homeassistant.components import bluetooth

...

@callback
def _async_discovered_device(service_info: bluetooth.BluetoothServiceInfoBleak, change: bluetooth.BluetoothChange) -> None:
    """Subscribe to bluetooth changes."""
    _LOGGER.warning("New service_info: %s", service_info)

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_discovered_device, {"service_uuid": "cba20d00-224d-11e6-9fb8-0002a5d5c51b", "connectable": False}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

The below example shows registering to get callbacks for HomeKit devices.

```python
from homeassistant.components import bluetooth

...

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_discovered_homekit_device, {"manufacturer_id": 76, "manufacturer_data_first_byte": 6}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

The below example shows registering to get callbacks for Nespresso Prodigios.

```python
from homeassistant.components import bluetooth

...

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_nespresso_found, {"local_name": "Prodigio_*")}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

The below example shows registering to get callbacks for a device with the address `44:33:11:22:33:22`.

```python
from homeassistant.components import bluetooth

...

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_specific_device_found, {"address": "44:33:11:22:33:22")}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

### Fetch the shared BleakScanner instance

Integrations that need an instance of a `BleakScanner` should call the `bluetooth.async_get_scanner` API. This API returns a wrapper around a single `BleakScanner` that allows integrations to share without overloading the system.

```python
from homeassistant.components import bluetooth

scanner = bluetooth.async_get_scanner(hass)
```


### Determine if a scanner is running

The Bluetooth integration may be set up but has no connectable adapters or remotes. The `bluetooth.async_scanner_count` API can be used to determine if there is a scanner running that will be able to receive advertisements or generate `BLEDevice`s that can be used to connect to the device. An integration may want to raise a more helpful error during setup if there are no scanners that will generate connectable `BLEDevice` objects.

```python
from homeassistant.components import bluetooth

count = bluetooth.async_scanner_count(hass, connectable=True)
```

### Subscribing to unavailable callbacks

To get a callback when the Bluetooth stack can no longer see a device, call the `bluetooth.async_track_unavailable` API. For performance reasons, it may take up to five minutes to get a callback once the device is no longer seen.

If the `connectable` argument is set to `True`, if any `connectable` controller can reach the device, the device will be considered available. If only non-connectable controllers can reach the device, the device will be considered unavailable. If the argument is set to `False`, the device will be considered available if any controller can see it.

```python
from homeassistant.components import bluetooth

def _unavailable_callback(info: bluetooth.BluetoothServiceInfoBleak) -> None:
    _LOGGER.debug("%s is no longer seen", info.address)

cancel = bluetooth.async_track_unavailable(hass, _unavailable_callback, "44:44:33:11:23:42", connectable=True)
```

### Fetching the bleak `BLEDevice` from the `address`

Integrations should avoid the overhead of starting an additional scanner to resolve the address by calling the `bluetooth.async_ble_device_from_address` API, which returns a `BLEDevice` for the nearest configured `bluetooth` adapter that can reach the device. If no adapters can reach the device, the `bluetooth.async_ble_device_from_address` API, will return `None`.

Suppose the integration wants to receive data from `connectable` and non-connectable controllers. In that case, it can exchange the `BLEDevice` for a `connectable` one when it wants to make an outgoing connection as long as at least one `connectable` controller is in range.

```python
from homeassistant.components import bluetooth

ble_device = bluetooth.async_ble_device_from_address(hass, "44:44:33:11:23:42", connectable=True)
```

### Fetching the latest `BluetoothServiceInfoBleak` for a device

The latest advertisement and device data are available with the `bluetooth.async_last_service_info` API, which returns a `BluetoothServiceInfoBleak` from the scanner with the best RSSI of the requested connectable type.

```python
from homeassistant.components import bluetooth

service_info = bluetooth.async_last_service_info(hass, "44:44:33:11:23:42", connectable=True)
```

### Checking if a device is present

To determine if a device is still present, call the `bluetooth.async_address_present` API. This call is helpful if your integration needs the device to be present to consider it available.

```python
from homeassistant.components import bluetooth

bluetooth.async_address_present(hass, "44:44:33:11:23:42", connectable=True)
```

### Fetching all discovered devices

To access the list of previous discoveries, call the `bluetooth.async_discovered_service_info` API. Only devices that are still present will be in the cache.

```python
from homeassistant.components import bluetooth

service_infos = bluetooth.async_discovered_service_info(hass, connectable=True)
```

### Fetching all discovered devices and advertisement data by each Bluetooth adapter

To access the list of previous discoveries and advertisement data received by each adapter independently, call the `bluetooth.async_scanner_devices_by_address` API. The call returns a list of `BluetoothScannerDevice` objects. The same device and advertisement data may appear multiple times, once per Bluetooth adapter that reached it.

```python
from homeassistant.components import bluetooth

device = bluetooth.async_scanner_devices_by_address(hass, "44:44:33:11:23:42", connectable=True)
# device.ble_device is a bleak `BLEDevice`
# device.advertisement is a bleak `AdvertisementData`
# device.scanner is the scanner that found the device
```

### Triggering rediscovery of devices

When a configuration entry or device is removed from Home Assistant, trigger rediscovery of its address to make sure they are available to be set up without restarting Home Assistant. You can make use of the Bluetooth connection property of the device registry if your integration manages multiple devices per configuration entry.

```python

from homeassistant.components import bluetooth

bluetooth.async_rediscover_address(hass, "44:44:33:11:23:42")
```

### Waiting for a specific advertisement

To wait for a specific advertisement, call the `bluetooth.async_process_advertisements` API.

```python
from homeassistant.components import bluetooth

def _process_more_advertisements(
    service_info: BluetoothServiceInfoBleak,
) -> bool:
    """Wait for an advertisement with 323 in the manufacturer_data."""
    return 323 in service_info.manufacturer_data

service_info = await bluetooth.async_process_advertisements(
    hass
    _process_more_advertisements,
    {"address": discovery_info.address, "connectable": False},
    BluetoothScanningMode.ACTIVE,
    ADDITIONAL_DISCOVERY_TIMEOUT
)
```

### Registering an external scanner

Integrations that provide a Bluetooth adapter should add `bluetooth` in [`dependencies`](../../creating_integration_manifest#dependencies) in their [`manifest.json`](../../creating_integration_manifest) and be added to [`after_dependencies`](../../creating_integration_manifest#after-dependencies) to the `bluetooth_adapters` integration.

To register an external scanner, call the `bluetooth.async_register_scanner` API. The scanner must inherit from `BaseHaScanner`.

```python
from homeassistant.components import bluetooth

cancel = bluetooth.async_register_scanner(hass, scanner, connectable=False)
```

The scanner will need to feed advertisement data to the central Bluetooth manager in the form of `BluetoothServiceInfoBleak` objects. The callback needed to send the data to the central manager can be obtained with the `bluetooth.async_get_advertisement_callback` API.

```python
callback = bluetooth.async_get_advertisement_callback(hass)

callback(BluetoothServiceInfoBleak(...))
```
