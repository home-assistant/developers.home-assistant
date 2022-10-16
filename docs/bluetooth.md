---
title: "Bluetooth"
sidebar_label: "Bluetooth"
---

### Best practices for integration authors

- When connecting to Bluetooth devices with `BleakClient`, always use the `BLEDevice` object instead of the `address` to avoid the client starting a scanner to find the `BLEDevice`. Call the `bluetooth.async_ble_device_from_address` API if you only have the `address`.

- Call the `bluetooth.async_get_scanner` API to get a `BleakScanner` instance and pass it to your library. The returned scanner avoids the overhead of running multiple scanners, which is significant. Additionally, the wrapped scanner will continue functioning if the user changes the Bluetooth adapter settings.

- Avoid reusing a `BleakClient` between connections since this will make connecting less reliable.

- Fetch a new `BLEDevice` from the `bluetooth.async_ble_device_from_address` API each time a connection is made. Alternatively, register a callback with `bluetooth.async_register_callback` and replace a cached `BLEDevice` each time a callback is received. The details of a `BLEDevice` object may change due to a change in the active adapter or environment.

- Use a connection timeout of at least ten (10) seconds as `BlueZ` must resolve services when connecting to a new or updated device for the first time. Transient connection errors are frequent when connecting, and connections are not always successful on the first attempt. The `bleak-retry-connector` PyPI package can take the guesswork out of quickly and reliably establishing a connection to a device.

### Connectable and non-connectable Bluetooth controllers

Home Assistant has support for remote Bluetooth controllers. Some controllers only support listening for advertisement data and do not support connecting to devices. Since many devices only need to receive advertisements, we have the concept of connectable devices and non-connectable devices. Suppose the device does not require an active connection. In that case, the `connectable` argument should be set to `False` to opt-in on receiving data from controllers that do not support making outgoing connections. When `connectable` is set to `False`, data from `connectable` and non-connectable controllers will be provided.

The default value for `connectable` is `True`. If the integration has some devices that require connections and some devices that do not, the `manifest.json` should set the flag appropriately for the device. If it is impossible to construct a matcher to differentiate between similar devices, check the `connectable` property in the config flow discovery `BluetoothServiceInfoBleak` and reject flows for devices needing outgoing connections.

### Subscribing to Bluetooth discoveries

Some integrations may need to know when a device is discovered right away. The Bluetooth integration provides a registration API to receive callbacks when a new device is discovered that matches specific key values. The same format for `bluetooth` in [`manifest.json`](creating_integration_manifest.md#bluetooth) is used for matching. In addition to the matchers used in the `manifest.json`, `address` can also be used as a matcher.

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

Integrations should avoid the overhead of starting an additional scanner to resolve the address may call the `bluetooth.async_ble_device_from_address` API, which returns a `BLEDevice` if the `bluetooth` integration scanner has recently seen the device. The integration MUST fall back to connecting via the `address` if the `BLEDevice` is unavailable.

Suppose the integration wants to receive data from `connectable` and non-connectable controllers. In that case, it can exchange the `BLEDevice` for a `connectable` one when it wants to make an outgoing connection as long as at least one `connectable` controller is in range.

```python
from homeassistant.components import bluetooth

ble_device = bluetooth.async_ble_device_from_address(hass, "44:44:33:11:23:42", connectable=True)
```

### Fetching the bleak `BluetoothServiceInfoBleak` for a device

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