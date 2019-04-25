---
title: Climate Entity
sidebar_label: Climate
id: version-0.92.0-entity_climate
original_id: entity_climate
---

> A climate entity is a device that controls temperature, humidity, or fans, such as A/C systems and humidifiers. Derive entity platforms from [`homeassistant.components.climate.ClimateDevice`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/climate/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_fan_mode | string | None | Returns the current fan mode.
| current_hold_mode | string | None | The current hold mode, e.g., home, away, temp.
| current_humidity | float | None | The current humidity.
| current_operation | string | None | The current operation (e.g. heat, cool, idle). Used to determine `state`.
| current_swing_mode | string | None | Returns the fan setting.
| current_temperature | float | None | The current temperature.
| fan_list | list | None | Returns the list of available fan modes.
| is_aux_heat_on | bool | None | Returns True if an auxiliary heater is on.
| is_away_mode_on | bool | None | Return true if away mode is on.
| is_on  | bool | None | Returns True if device is on. Used to determine `state`.
| max_humidity | int | `DEFAULT_MAX_HUMIDITY` (value == 99) | Returns the maximum humidity.
| max_temp | int | `DEFAULT_MAX_TEMP` (value == 35) | Returns the maximum temperature.
| min_humidity | int | `DEFAULT_MIN_HUMIDITY` (value == 30) | Returns the minimum humidity.
| min_temp | int | `DEFAULT_MIN_TEMP` (value == 7) | Returns the minimum temperature.
| operation_list | list | None | List of available operation modes.
| precision | float | PRECISION_WHOLE | The precision of the temperature in the system: tenths for TEMP_CELSIUS, whole number otherwise.
| state | string | None | Returns the current state.
| state_attributes | dictionary | N/A | The optional state attributes: current temperature, minimum temperature, maximum temperature, and target temperature.
| supported_features | list | `NotImplementedError()` | Returns list of supported features.
| swing_list | list | None | Returns the list of available swing modes.
| target_humidity | float | None | The target humidity.
| target_temperature | float | None | The temperature currently set to be reached.
| target_temperature_high | float | None | The upper bound target temperature
| target_temperature_low | float | None | The lower bound target temperature
| target_temperature_step | float | None | The supported step of target temperature
| temperature_unit | string | `NotImplementedError` | The unit of temperature measurement for the system (e.g. Celsius).

### States

| Name | Description
| ---- | -----------
| STATE_HEAT | The device is set to heat.
| STATE_COOL | The device is set to cool.
| STATE_IDLE | The device is idle.
| STATE_AUTO | The device is set to auto.
| STATE_MANUAL | The device is set to manual.
| STATE_DRY | The device is set to dry.
| STATE_FAN_ONLY | The device is set to fan-only.
| STATE_ECO | The device is set to eco-mode.

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name | Description
| ---- | -----------
| SUPPORT_TARGET_TEMPERATURE | The device supports a target temperature.
| SUPPORT_TARGET_TEMPERATURE_HIGH | The device supports an upper bound target temperature.
| SUPPORT_TARGET_TEMPERATURE_LOW | The device supports a lower bound target temperature.
| SUPPORT_TARGET_HUMIDITY | The device supports a target humidity.
| SUPPORT_TARGET_HUMIDITY_HIGH | The device supports an upper bound target humidity.
| SUPPORT_TARGET_HUMIDITY_LOW | The device supports a lower bound target humidity.
| SUPPORT_FAN_MODE | The device supports fan modes.
| SUPPORT_OPERATION_MODE | The device supports operation modes.
| SUPPORT_HOLD_MODE | The device supports hold modes.
| SUPPORT_SWING_MODE | The device supports swing modes.
| SUPPORT_AWAY_MODE | The device supports away mode.
| SUPPORT_AUX_HEAT | The device supports auxiliary heaters.
| SUPPORT_ON_OFF | The device supports on/off states.


## Methods

### Set fan mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_fan_mode(self, fan_mode):
        """Set new target fan mode."""

    async def async_set_fan_mode(self, fan_mode):
        """Set new target fan mode."""
```

### Set hold mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_hold_mode(self, hold_mode):
        """Set new target hold mode."""

    async def async_set_hold_mode(self, hold_mode):
        """Set new target hold mode."""
```

### Set humidity

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_humidity(self, humidity):
        """Set new target humidity."""

    async def async_set_humidity(self, humidity):
        """Set new target humidity."""
```

### Set operation mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_operation_mode(self, operation_mode):
        """Set new target operation mode."""

    async def async_set_operation_mode(self, operation_mode):
        """Set new target operation mode."""
```

### Set swing mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_swing_mode(self, swing_mode):
        """Set new target swing operation."""

    async def async_set_swing_mode(self, swing_mode):
        """Set new target swing operation."""
```

### Set temperature

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_temperature(self, **kwargs):
        """Set new target temperature."""

    async def async_set_temperature(self, **kwargs):
        """Set new target temperature."""
```

### Turn auxiliary heater on

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def turn_aux_heat_on(self):
        """Turn auxiliary heater on."""

    async def async_turn_aux_heat_on(self):
        """Turn auxiliary heater on."""
```

### Turn auxiliary heater off

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def turn_aux_heat_off(self):
        """Turn auxiliary heater off."""

    async def async_turn_aux_heat_off(self):
        """Turn auxiliary heater off."""
```

### Turn away mode on

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def turn_away_mode_on(self):
        """Turn away mode on."""

    async def async_turn_away_mode_on(self):
        """Turn away mode on."""
```

### Turn away mode off

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def turn_away_mode_off(self):
        """Turn away mode off."""

    async def async_turn_away_mode_off(self):
        """Turn away mode off."""
```

### Turn the device on

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.
	
    def turn_on(self):
        """Turn device on."""

    async def async_turn_on(self):
        """Turn device on."""
```

### Turn the device off

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def turn_off(self):
        """Turn device off."""

    async def async_turn_off(self):
        """Turn device off."""
```
