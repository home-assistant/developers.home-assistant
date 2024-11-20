---
title: "The integration creates devices"
related_rules:
  - has-entity-name
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Devices, in Home Assistant, are used to group entities to represent either a single physical device or a service.
This is useful, since users usually think they add a device or a service to their system, not a single entity.
Home Assistant stores the device information in the device registry.
In order for the user to have the best experience, the information about the device should be as complete as possible.

## Example implementation

In this example, there is a sensor entity that defines which device it should be added to in the device registry, together with some metadata about the device.
This will provide a rich device info page, where the user can recognize the device by its name, serial number, and other fields.

`sensor.py`:
```python {8-18} showLineNumbers
class MySensor(SensorEntity):
    """Representation of a sensor."""

    _attr_has_entity_name = True

    def __init__(self, device: MyDevice) -> None:
        """Initialize the sensor."""
        self._attr_device_info = DeviceInfo(
            connections={(CONNECTION_NETWORK_MAC, device.mac)},
            name=device.name,
            serial_number=device.serial,
            hw_version=device.rev,
            sw_version=device.version,
            manufacturer="My Company",
            model="My Sensor",
            model_id="ABC-123",
            via_device={(DOMAIN, device.hub_id)},
        )
```

:::info
If the device represents a service, be sure to add `entry_type=DeviceEntryType.SERVICE` to the `DeviceInfo` object to mark the device as such.
:::

## Additional resources

More information about devices can be found in the [device](../../../device_registry_index) documentation.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>