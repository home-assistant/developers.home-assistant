<Acceptable>
- Serial number of a device
- MAC address: formatted using `homeassistant.helpers.device_registry.format_mac`; Only obtain the MAC address from the device API or a discovery handler. Tools that rely on reading the arp cache or local network access such as `getmac` will not function in all supported network environments and are not acceptable.
- Latitude and Longitude or other unique Geo Location
- Unique identifier that is physically printed on the device or burned into an EEPROM
</Acceptable>

<Unacceptable>
- IP Address
- Device Name
</Unacceptable>
