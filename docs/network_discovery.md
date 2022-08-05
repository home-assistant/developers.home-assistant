---
title: "Networking and Discovery"
sidebar_label: "Networking and Discovery"
---

Some integrations may need to discover devices on the network via [mDNS/Zeroconf](https://en.wikipedia.org/wiki/Zero-configuration_networking), [SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol), or another method once they have been enabled.  The primary use case is to find devices that do not have a known fixed IP Address or for integrations that can dynamically add and remove any number of compatible discoverable devices.

Home Assistant has built-in helpers to support mDNS/Zeroconf and SSDP. If your integration uses another discovery method that needs to determine which network interfaces to use to broadcast traffic, the [Network](https://www.home-assistant.io/integrations/network/) integration provides a helper API to access the user's interface preferences.

## Bluetooth

### Best practices for library authors

- When connecting to Bluetooth devices with `BleakClient`, always use the `BLEDevice` object instead of the `address` to avoid the client starting a scanner to find the `BLEDevice`. Call the `bluetooth.async_ble_device_from_address` API if you only have the `address`.

- Call the `bluetooth.async_get_scanner` API to get a `BleakScanner` instance and pass it to your library. The returned scanner avoids the overhead of running multiple scanners, which is significant. Additionally, the wrapped scanner will continue functioning if the user changes the Bluetooth adapter settings.

- Avoid reusing a `BleakClient` between connections since this will make connecting less reliable.

- Fetch a new `BLEDevice` from the `bluetooth.async_ble_device_from_address` API each time a connection is made. Alternatively, register a callback with `bluetooth.async_register_callback` and replace a cached `BLEDevice` each time a callback is received. The details of a `BLEDevice` object may change due to a change in the active adapter or environment.

- Use a connection timeout of at least ten (10) seconds as `BlueZ` must resolve services when connecting to a new or updated device for the first time. Transient connection errors are frequent when connecting, and connections are not always successful on the first attempt. The `bleak-retry-connector` PyPI package can take the guesswork out of quickly and reliably establishing a connection to a device.

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
        hass, _async_discovered_device, {"service_uuids": {"cba20d00-224d-11e6-9fb8-0002a5d5c51b"}}, bluetooth.BluetoothScanningMode.ACTIVE
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

### Subscribing to unavailable callbacks

To get a callback when the Bluetooth stack can no longer see a device, call the `bluetooth.async_track_unavailable` API. For performance reasons, it may take up to five minutes to get a callback once the device is no longer seen.

```python
from homeassistant.components import bluetooth

def _unavailable_callback(address: str) -> None:
    _LOGGER.debug("%s is no longer seen", address)
   
cancel = bluetooth.async_track_unavailable(hass, _unavailable_callback, "44:44:33:11:23:42")
```

### Fetching the bleak `BLEDevice` from the `address`

Integrations wishing to avoid the overhead of starting an additional scanner to resolve the address may call the `bluetooth.async_ble_device_from_address` API, which returns a `BLEDevice` if the `bluetooth` integration scanner has recently seen the device. Integration MUST fall back to connecting via the `address` if the `BLEDevice` is unavailable.

```python
from homeassistant.components import bluetooth

ble_device = bluetooth.async_ble_device_from_address(hass, "44:44:33:11:23:42")
```

### Checking if a device is present

To determine if a device is still present, call the `bluetooth.async_address_present` API. This call is helpful if your integration needs the device to be present to consider it available. As this call can be expensive with many devices, we recommend only calling it every five minutes.

```python
from homeassistant.components import bluetooth

bluetooth.async_address_present(hass, "44:44:33:11:23:42")
```

### Fetching all discovered devices

To access the list of previous discoveries, call the `bluetooth.async_discovered_service_info` API. Only devices that are still present will be in the cache.

```python
from homeassistant.components import bluetooth

service_infos = bluetooth.async_discovered_service_info(hass)
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
    {"address": discovery_info.address},
    BluetoothScanningMode.ACTIVE,
    ADDITIONAL_DISCOVERY_TIMEOUT
)
```


## mDNS/Zeroconf

Home Assistant uses the [python-zeroconf](https://github.com/jstasiak/python-zeroconf) package for mDNS support. As running multiple mDNS implementations on a single host is not recommended, Home Assistant provides internal helper APIs to access the running `Zeroconf` and `AsyncZeroconf` instances.

Before using these helpers, be sure to add `zeroconf` to `dependencies` in your integration's [`manifest.json`](creating_integration_manifest.md)

### Obtaining the `AsyncZeroconf` object

```python
from homeassistant.components import zeroconf

...
aiozc = await zeroconf.async_get_async_instance(hass)

```

### Obtaining the `Zeroconf` object

```python
from homeassistant.components import zeroconf

...
zc = await zeroconf.async_get_instance(hass)

```

### Using the `AsyncZeroconf` and `Zeroconf` objects

`python-zeroconf` provides examples on how to use both objects [examples](https://github.com/jstasiak/python-zeroconf/tree/master/examples).

## SSDP

Home Assistant provides built-in discovery via SSDP.

Before using these helpers, be sure to add `ssdp` to `dependencies` in your integration's [`manifest.json`](creating_integration_manifest.md)

### Obtaining the list of discovered devices

The list of discovered SSDP devices can be obtained using the following built-in
helper APIs. The SSDP integration provides the following helper APIs to lookup existing
SSDP discoveries from the cache: `ssdp.async_get_discovery_info_by_udn_st`, `ssdp.async_get_discovery_info_by_st`, `ssdp.async_get_discovery_info_by_udn`

### Looking up a specific device

The `ssdp.async_get_discovery_info_by_udn_st` API returns a single `discovery_info`
or `None` when provided an `SSDP`, `UDN` and `ST`.

```
from homeassistant.components import ssdp

...

discovery_info = await ssdp.async_get_discovery_info_by_udn_st(hass, udn, st)
```

### Looking up devices by `ST`

If you want to look for a specific type of discovered devices, calling
`ssdp.async_get_discovery_info_by_st` will return a list of all discovered devices that
match the `SSDP` `ST`. The below example returns a list of discovery info for every
Sonos player discovered on the network.

```
from homeassistant.components import ssdp

...

discovery_infos = await ssdp.async_get_discovery_info_by_st(hass, "urn:schemas-upnp-org:device:ZonePlayer:1")
for discovery_info in discovery_infos:
  ...

```


### Looking up devices by `UDN`

If you want to see a list of the services provided by a specific `UDN`, calling
`ssdp.async_get_discovery_info_by_udn` will return a list of all discovered devices that
match the `UPNP` `UDN`.

```
from homeassistant.components import ssdp

...

discovery_infos = await ssdp.async_get_discovery_info_by_udn(hass, udn)
for discovery_info in discovery_infos:
  ...

```

### Subscribing to SSDP discoveries

Some integrations may need to know when a device is discovered right away. The SSDP integration provides a registration API to receive callbacks when a new device is discovered that matches specific key values. The same format for `ssdp` in [`manifest.json`](creating_integration_manifest.md) is used for matching.

The function `ssdp.async_register_callback` is provided to enable this ability. The function returns a callback that will cancel the registration when called.

The below example shows registering to get callbacks when a Sonos player is seen
on the network.

```
from homeassistant.components import ssdp

...

entry.async_on_unload(
    ssdp.async_register_callback(
        hass, _async_discovered_player, {"st": "urn:schemas-upnp-org:device:ZonePlayer:1"}
    )
)
```

The below example shows registering to get callbacks when the `x-rincon-bootseq` header is present.

```
from homeassistant.components import ssdp
from homeassistant.const import MATCH_ALL

...

entry.async_on_unload(
    ssdp.async_register_callback(
        hass, _async_discovered_player, {"x-rincon-bootseq": MATCH_ALL}
    )
)
```


## Network

For integrations that use a discovery method that is not built-in and need to access the user's network adapter configuration, the following helper API should be used.


```python
from homeassistant.components import network

...
adapters = await network.async_get_adapters(hass)
```

### Example `async_get_adapters` data structure

```python
[
    {   
        "auto": True,
        "default": False,
        "enabled": True,
        "ipv4": [],
        "ipv6": [
            {   
                "address": "2001:db8::",
                "network_prefix": 8,
                "flowinfo": 1,
                "scope_id": 1,
            }
        ],
        "name": "eth0",
    },
    {
        "auto": True,
        "default": False,
        "enabled": True,
        "ipv4": [{"address": "192.168.1.5", "network_prefix": 23}],
        "ipv6": [],
        "name": "eth1",
    },
    {
        "auto": False,
        "default": False,
        "enabled": False,
        "ipv4": [{"address": "169.254.3.2", "network_prefix": 16}],
        "ipv6": [],
        "name": "vtun0",
    },
]
```

### Obtaining the IP Network from an adapter

```python
from ipaddress import ip_network
from homeassistant.components import network

...

adapters = await network.async_get_adapters(hass)

for adapter in adapters:
    for ip_info in adapater["ipv4"]:
        local_ip = ip_info["address"]
        network_prefix = ip_info["network_prefix"]
        ip_net = ip_network(f"{local_ip}/{network_prefix}", False)
```
