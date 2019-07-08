---
title: Climate Entity
sidebar_label: Climate
---

A climate entity is a device that controls temperature, humidity, or fans, such as A/C systems and humidifiers. Derive entity platforms from [`homeassistant.components.climate.ClimateDevice`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/climate/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name                    | Type   | Default                              | Description                                                                                                  |
| ----------------------- | ------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| temperature_unit        | string | `NotImplementedError`                | The unit of temperature measurement for the system (`TEMP_CELSIUS` or `TEMP_FAHRENHEIT`).                    |
| precision               | float  | Based on `temperature_unit`          | The precision of the temperature in the system. Defaults to tenths for TEMP_CELSIUS, whole number otherwise. |
| current_temperature     | float  | None                                 | The current temperature.                                                                                     |
| current_humidity        | float  | None                                 | The current humidity.                                                                                        |
| target_temperature      | float  | None                                 | The temperature currently set to be reached.                                                                 |
| target_temperature_high | float  | None                                 | The upper bound target temperature                                                                           |
| target_temperature_low  | float  | None                                 | The lower bound target temperature                                                                           |
| target_temperature_step | float  | None                                 | The supported step size a target temperature can be increased/decreased                                      |
| target_humidity         | float  | None                                 | The target humidity the device is trying to reach. Requires `SUPPORT_TARGET_HUMIDITY`.                       |
| max_temp                | int    | `DEFAULT_MAX_TEMP` (value == 35)     | Returns the maximum temperature.                                                                             |
| min_temp                | int    | `DEFAULT_MIN_TEMP` (value == 7)      | Returns the minimum temperature.                                                                             |
| max_humidity            | int    | `DEFAULT_MAX_HUMIDITY` (value == 99) | Returns the maximum humidity. Requires `SUPPORT_TARGET_HUMIDITY`.                                            |
| min_humidity            | int    | `DEFAULT_MIN_HUMIDITY` (value == 30) | Returns the minimum humidity. Requires `SUPPORT_TARGET_HUMIDITY`.                                            |
| hvac_mode               | string | `NotImplementedError()`              | The current operation (e.g. heat, cool, idle). Used to determine `state`.                                    |
| hvac_action             | string | None                                 | The current HVAC action (heating, cooling)                                                                   |
| hvac_modes              | list   | `NotImplementedError()`              | List of available operation modes. See below.                                                                |
| preset_mode             | string | `NotImplementedError()`              | The current active preset. Requires `SUPPORT_PRESET_MODE`.                                                   |
| preset_modes            | list   | `NotImplementedError()`              | The available presets. Requires `SUPPORT_PRESET_MODE`.                                                       |
| fan_mode                | string | `NotImplementedError()`              | Returns the current fan mode. Requires `SUPPORT_FAN_MODE`.                                                   |
| fan_modes               | list   | `NotImplementedError()`              | Returns the list of available fan modes. Requires `SUPPORT_FAN_MODE`.                                        |
| swing_mode              | string | `NotImplementedError()`              | Returns the fan setting.                                                                                     |
| swing_modes             | list   | `NotImplementedError()`              | Returns the list of available swing modes.                                                                   |
| is_aux_heat             | bool   | None                                 | Returns True if an auxiliary heater is on. Requires `SUPPORT_AUX_HEAT`.                                      |
| supported_features      | int    | `NotImplementedError()`              | Bitmap of supported features. See below.                                                                     |

### HVAC modes

You are only allowed to use the built-in HVAC modes. If you want another mode, add a preset instead.

| Name                  | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `HVAC_MODE_OFF`       | The device is turned off.                                           |
| `HVAC_MODE_HEAT`      | The device is set to heat to a target temperature.                  |
| `HVAC_MODE_COOL`      | The device is set to cool to a target temperature.                  |
| `HVAC_MODE_HEAT_COOL` | The device supports heating/cooling to a range                      |
| `HVAC_MODE_AUTO`      | The device is set to a schedule, learned behavior, AI.              |
| `HVAC_MODE_DRY`       | The device is set to dry/humidity mode.                             |
| `HVAC_MODE_FAN_ONLY`  | The device only has the fan on. No heating or cooling taking place. |

### HVAC Action

The HVAC action describes the _current_ action. This is different from the mode, because if a device is set to heat, and the target temperature is already achieved, the device will not be actively heating anymore.

| Name                | Description           |
| ------------------- | --------------------- |
| `CURRENT_HVAC_OFF`  | Device is turned off. |
| `CURRENT_HVAC_HEAT` | Device is heating.    |
| `CURRENT_HVAC_COOL` | Device is cooling.    |
| `CURRENT_HVAC_DRY`  | Device is dring.      |
| `CURRENT_HVAC_IDLE` | Device is idle.       |

### Presets

A device can have different presets that it might want to show to the user. Common presets are "Away" or "Eco". There are a couple of built-in presets that will offer translations, but you're also allowed to add custom presets.

| Name       | Description                                            |
| ---------- | ------------------------------------------------------ |
| `ECO`      | Device is running an energy-saving mode                |
| `AWAY`     | Device is in away mode                                 |
| `BOOST`    | Device turn all valve full up                          |
| `COMFORT`  | Device is in comfort mode                              |
| `HOME`     | Device is in home mode                                 |
| `SLEEP`    | Device is prepared for sleep                           |
| `ACTIVITY` | Device is reacting to activity (e.g. movement sensors) |

### Fan modes

A device's fan can have different states. There are a couple of built-in fan modes, but you're also allowed to use custom fan modes.

| Name          |
| ------------- |
| `FAN_ON`      |
| `FAN_OFF`     |
| `FAN_AUTO`    |
| `FAN_LOW`     |
| `FAN_MEDIUM`  |
| `FAN_HIGH`    |
| `FAN_MIDDLE`  |
| `FAN_FOCUS`   |
| `FAN_DIFFUSE` |

### Swing modes

The device fan can have different swing modes that it wants the user to know about/control.

| Name               | Description                                      |
| ------------------ | ------------------------------------------------ |
| `SWING_OFF`        | The fan is not swinging.                         |
| `SWING_VERTICAL`   | The fan is swinging vertical.                    |
| `SWING_HORIZONTAL` | The fan is swinging horizontal.                  |
| `SWING_BOTH`       | The fan is swingin both horizontal and vertical. |

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name                               | Description                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `SUPPORT_TARGET_TEMPERATURE`       | The device supports a target temperature.                                                   |
| `SUPPORT_TARGET_TEMPERATURE_RANGE` | The device supports a ranged target temperature. Used for HVAC modes `heat_cool` and `auto` |
| `SUPPORT_TARGET_HUMIDITY`          | The device supports a target humidity.                                                      |
| `SUPPORT_FAN_MODE`                 | The device supports fan modes.                                                              |
| `SUPPORT_PRESET_MODE`              | The device supports presets.                                                                |
| `SUPPORT_SWING_MODE`               | The device supports swing modes.                                                            |
| `SUPPORT_AUX_HEAT`                 | The device supports auxiliary heaters.                                                      |

## Methods

### Set hvac mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_hvac_mode(self, hvac_mode):
        """Set new target hvac mode."""

    async def async_set_hvac_mode(self, hvac_mode):
        """Set new target hvac mode."""
```

### Set preset mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_preset_mode(self, preset_mode):
        """Set new target preset mode."""

    async def async_set_preset_mode(self, preset_mode):
        """Set new target preset mode."""
```

### Set fan mode

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def set_fan_mode(self, fan_mode):
        """Set new target fan mode."""

    async def async_set_fan_mode(self, fan_mode):
        """Set new target fan mode."""
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

### Control auxiliary heater

```python
class MyClimateDevice(ClimateDevice):
    # Implement one of these methods.

    def turn_aux_heat_on(self):
        """Turn auxiliary heater on."""

    async def async_turn_aux_heat_on(self):
        """Turn auxiliary heater on."""

    # Implement one of these methods.

    def turn_aux_heat_off(self):
        """Turn auxiliary heater off."""

    async def async_turn_aux_heat_off(self):
        """Turn auxiliary heater off."""
```
