---
title: Switch Entity
sidebar_label: Switch
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name               | Type    | Default      | Description                                                             |
| ------------------ | ------- | ------------ | ----------------------------------------------------------------------- |
| is_on              | boolean | **Required** | If the switch is currently on or off.                                   |
| current_power_w  | float   | `None`       | The current power usage in W.                                           |
| today_energy_kwh | float   | `None`       | Total energy usage in kWh.                                              |
| is_standby         | boolean | `None`       | Indicate if the device connected to the switch is currently in standby. |

## Methods

### Turn On

Turn the switch on.

```python
class MySwitch(SwitchDevice):
    # Implement one of these methods.

    def turn_on(self, **kwargs) -> None:
        """Turn the entity on."""

    async def async_turn_on(self, **kwargs):
        """Turn the entity on."""

```

### Turn Off

Turn the switch off.

```python
class MySwitch(SwitchDevice):
    # Implement one of these methods.

    def turn_off(self, **kwargs):
        """Turn the entity off."""

    async def async_turn_off(self, **kwargs):
        """Turn the entity off."""
```

### Toggle

Optional. If not implemented will default to checking what method to call using the `is_on` property.

```python
class MySwitch(SwitchDevice):
    # Implement one of these methods.

    def toggle(self, **kwargs):
        """Toggle the entity."""

    async def async_toggle(self, **kwargs):
        """Toggle the entity."""
```

### Available device classes

Optional. What type of device this. It will possibly map to google device types. 

| Value  | Description                               |
| ------ | ----------------------------------------- |
| outlet | Device is an outlet for power.            |
| switch | Device is switch for some type of entity. |