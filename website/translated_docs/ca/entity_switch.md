---
title: Switch Entity
sidebar_label: Switch
---

## Propietats

> Les propietats han de retornar només informació en memòria i no fer transaccions I/O (com peticions web). Implementa el mètode `update()` or `async_update()` per obtenir les dades.

| Name               | Tipus   | Per defecte    | Descripció                                                              |
| ------------------ | ------- | -------------- | ----------------------------------------------------------------------- |
| is_on              | boolean | **Obligatori** | If the switch is currently on or off.                                   |
| current_power_w  | flotant | `Cap`          | The current power usage in W.                                           |
| today_energy_kwh | flotant | `Cap`          | Total energy usage in kWh.                                              |
| is_standby         | boolean | `Cap`          | Indicate if the device connected to the switch is currently in standby. |

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

| Value  | Descripció                                |
| ------ | ----------------------------------------- |
| outlet | Device is an outlet for power.            |
| switch | Device is switch for some type of entity. |