---
title: Button entity
sidebar_label: Button
---

A button entity is an entity that can fire an event / trigger an action towards a device or service but remains stateless from the Home Assistant perspective.
It can be compared to a real live momentary switch, push-button, or some other form of a stateless switch. It is, however, not suitable for implementing actual physical buttons; the sole purpose of a button entity is to provide a virtual button inside Home Assistant.

A switch button entity is derived from the  [`homeassistant.components.button.ButtonEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/button/__init__.py),
and can be helpful for controlling device features like (but not limited to):

- Upgrading firmware
- Reboot/Restart a device
- Brew a cup of coffee
- Reset something (like a counter, filter usage)

If you want to represent something that can be turned on and off (and thus have an actual state), you should use a `switch` entity instead. If you want to integrate a real, physical, stateless button device in Home Assistant, you can do so by firing custom events. The entity button entity isn't suitable for these cases.

## Properties

As this integration is stateless, it doesn't provide any specific properties for itself.
Other properties that are common to all entities such as `device_class`, `icon`, `name` etc are still applicable.

## Methods

### Press

The press method can be used to trigger an action towards a device or service.
It is called by Home Assistant when the user presses the button or the
service to press the button has been called.

```python
class MyButton(ButtonEntity):
    # Implement one of these methods.

    def press(self) -> None:
        """Handle the button press."""

    async def async_press(self) -> None:
        """Handle the button press."""
```

### Available device classes

Optionally specifies what type of entity it is. It will possibly map to Google device types.

| Constant | Description
| ----- | -----------
| `ButtonDeviceClass.IDENTIFY` | The button entity identifies a device.
| `ButtonDeviceClass.RESTART` | The button entity restarts the device.
| `ButtonDeviceClass.UPDATE` | The button entity updates the software of the device. The use of this device class should be avoided, please consider using the [`update`](/docs/core/entity/update) entity instead.
