---
title: Button Entity
sidebar_label: Button
---

A button entity is an entity that can fire an event / trigger an action towards a device or service but remains stateless from the Home Assistant perspective.
It can be compared to a real live momentary switch, push-button, or some other form of a stateless switch.

A switch button entity is derived from the  [`homeassistant.components.button.ButtonEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/button/__init__.py),
and can be helpful for controlling device features like (but not limited to):

- Upgrading firmware
- Reboot/Restart a device
- Brew a cup of coffee
- Reset something (like a counter, filter usage)

If you want to represent something that can be turned on and off (and thus have an actual state), you should use a `switch` entity instead.

## Properties

As this integration is stateless, it doesn't provide any specific properties for itself.
Other properties that are common to all entities such as `icon`, `name` etc are still applicable.

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
```
