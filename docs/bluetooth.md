---
title: "Bluetooth"
sidebar_label: "Building a Bluetooth Integration"
---

### Best practices for integration authors

- Integrations that need to use a Bluetooth adapter should add `bluetooth_adapters` in [`dependencies`](creating_integration_manifest#dependencies) in their [`manifest.json`](creating_integration_manifest). The [`manifest.json`](creating_integration_manifest) entry ensures that all supported remote adapters are connected before the integration tries to use them.

- When connecting to Bluetooth devices with `BleakClient`, always use the `BLEDevice` object instead of the `address` to avoid the client starting a scanner to find the `BLEDevice`. Call the `bluetooth.async_ble_device_from_address` API if you only have the `address`.

- Call the `bluetooth.async_get_scanner` API to get a `BleakScanner` instance and pass it to your library. The returned scanner avoids the overhead of running multiple scanners, which is significant. Additionally, the wrapped scanner will continue functioning if the user changes the Bluetooth adapter settings.

- Avoid reusing a `BleakClient` between connections since this will make connecting less reliable.

- Fetch a new `BLEDevice` from the `bluetooth.async_ble_device_from_address` API each time a connection is made. Alternatively, register a callback with `bluetooth.async_register_callback` and replace a cached `BLEDevice` each time a callback is received. The details of a `BLEDevice` object may change due to a change in the active adapter or environment.

- Use a connection timeout of at least ten (10) seconds as `BlueZ` must resolve services when connecting to a new or updated device for the first time. Transient connection errors are frequent when connecting, and connections are not always successful on the first attempt. The `bleak-retry-connector` PyPI package can take the guesswork out of quickly and reliably establishing a connection to a device.

### Connectable and non-connectable Bluetooth controllers

Home Assistant has support for remote Bluetooth controllers. Some controllers only support listening for advertisement data and do not support connecting to devices. Since many devices only need to receive advertisements, we have the concept of connectable devices and non-connectable devices. Suppose the device does not require an active connection. In that case, the `connectable` argument should be set to `False` to opt-in on receiving data from controllers that do not support making outgoing connections. When `connectable` is set to `False`, data from `connectable` and non-connectable controllers will be provided.

The default value for `connectable` is `True`. If the integration has some devices that require connections and some devices that do not, the `manifest.json` should set the flag appropriately for the device. If it is impossible to construct a matcher to differentiate between similar devices, check the `connectable` property in the config flow discovery `BluetoothServiceInfoBleak` and reject flows for devices needing outgoing connections.
