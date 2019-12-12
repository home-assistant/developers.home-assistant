---
title: Humidifier Entity
sidebar_label: Humidifier
---

A humidifier entity is a device whose main purpose is to control humidity, i.e. a humidifier or dehumidifier. It is different from the climate entity in a way that its main focus is not on temperature. Derive entity platforms from [`homeassistant.components.humidifier.HumidifierDevice`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/humidifier/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name                    | Type   | Default                               | Description                                                                               |
| ----------------------- | ------ | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| target_humidity         | int    | None                                  | The target humidity the device is trying to reach. Requires `SUPPORT_TARGET_HUMIDITY`.    |
| current_humidity        | int    | None                                  | The current humidity.                                                                     |
| current_temperature     | float  | None                                  | The current temperature. Requires `SUPPORT_TEMPERATURE`.                                  |
| temperature_unit        | string | `NotImplementedError`                 | The unit of temperature measurement for the system (`TEMP_CELSIUS` or `TEMP_FAHRENHEIT`). |
| max_humidity            | int    | `DEFAULT_MAX_HUMIDITY` (value == 100) | Returns the maximum humidity. Requires `SUPPORT_TARGET_HUMIDITY`.                         |
| min_humidity            | int    | `DEFAULT_MIN_HUMIDITY` (value == 0)   | Returns the minimum humidity. Requires `SUPPORT_TARGET_HUMIDITY`.                         |
| water_level             | int    | None                                  | The level of water in the device in percent (0-100). Requires `SUPPORT_WATER_LEVEL`.      |
| humidifier_action       | string | None                                  | The current humidifier action (humidifying, drying)                                       |
| operation_mode          | string | (abstract method)                     | The current operation (e.g. humidify, dry, idle). Used to determine `state`.              |
| operation_modes         | list   | (abstract method)                     | List of available operation modes. See below.                                             |
| preset_mode             | string | `NotImplementedError()`               | The current active preset. Requires `SUPPORT_PRESET_MODE`.                                |
| preset_modes            | list   | `NotImplementedError()`               | The available presets. Requires `SUPPORT_PRESET_MODE`.                                    |
| fan_mode                | string | `NotImplementedError()`               | Returns the current fan mode. Requires `SUPPORT_FAN_MODE`.                                |
| fan_modes               | list   | `NotImplementedError()`               | Returns the list of available fan modes. Requires `SUPPORT_FAN_MODE`.                     |
| is_aux_heat             | bool   | `NotImplementedError()`               | Returns True if an auxiliary heater is on. Requires `SUPPORT_AUX_HEAT`.                   |
| supported_features      | int    | `NotImplementedError()`               | Bitmap of supported features. See below.                                                  |

### Operation modes

You are only allowed to use the built-in operation modes. If you want another mode, add a preset instead.

| Name                          | Description                                                            |
| ----------------------------- | ---------------------------------------------------------------------- |
| `OPERATION_MODE_OFF`          | The device is turned off.                                              |
| `OPERATION_MODE_HUMIDIFY`     | The device is set to humidify to a target humidity.                    |
| `OPERATION_MODE_DRY`          | The device is set to dry to a target humidity.                         |
| `OPERATION_MODE_HUMIDIFY_DRY` | The device supports both humidifying and drying                        |
| `OPERATION_MODE_AUTO`         | The device is set to a schedule, learned behavior, AI.                 |
| `OPERATION_MODE_FAN_ONLY`     | The device only has the fan on. No humidifying or drying taking place. |

### Humidifier Action

The humidifier action describes the _current_ action. This is different from the mode, because if a device is set to humidify, and the target humidity is already achieved, the device will not be actively humidifying anymore.

| Name                          | Description            |
| ----------------------------- | ---------------------- |
| `CURRENT_HUMIDIFIER_OFF`      | Device is turned off.  |
| `CURRENT_HUMIDIFIER_HUMIDIFY` | Device is humidifying. |
| `CURRENT_HUMIDIFIER_DRY`      | Device is dring.       |
| `CURRENT_HUMIDIFIER_FAN`      | Only fan is active.    |
| `CURRENT_HUMIDIFIER_IDLE`     | Device is idle.        |

### Presets

A device can have different presets that it might want to show to the user. Common presets are "Away" or "Eco". There are a couple of built-in presets that will offer translations, but you're also allowed to add custom presets.

| Name             | Description                             |
| ---------------- | --------------------------------------- |
| `PRESET_NONE`    | No preset is active                     |
| `PRESET_ECO`     | Device is running an energy-saving mode |
| `PRESET_AWAY`    | Device is in away mode                  |
| `PRESET_BOOST`   | Device turn all valve full up           |
| `PRESET_COMFORT` | Device is in comfort mode               |
| `PRESET_HOME`    | Device is in home mode                  |
| `PRESET_SLEEP`   | Device is prepared for sleep            |

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

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name                      | Description                                |
| ------------------------- | ------------------------------------------ |
| `SUPPORT_WATER_LEVEL`     | The device supports reporting water level. |
| `SUPPORT_PRESET_MODE`     | The device supports presets.               |
| `SUPPORT_FAN_MODE`        | The device supports fan modes.             |
| `SUPPORT_TEMPERATURE`     | The device supports reporting temperature. |
| `SUPPORT_AUX_HEAT`        | The device supports auxiliary heaters.     |

## Methods

### Set operation mode

```python
class MyHumidifierDevice(HumidifierDevice):
    # Implement one of these methods.

    def set_operation_mode(self, operation_mode):
        """Set new target operation mode."""

    async def async_set_operation_mode(self, operation_mode):
        """Set new target operation mode."""
```

### Set preset mode

```python
class MyHumidifierDevice(HumidifierDevice):
    # Implement one of these methods.

    def set_preset_mode(self, preset_mode):
        """Set new target preset mode."""

    async def async_set_preset_mode(self, preset_mode):
        """Set new target preset mode."""
```

### Set fan mode

```python
class MyHumidifierDevice(HumidifierDevice):
    # Implement one of these methods.

    def set_fan_mode(self, fan_mode):
        """Set new target fan mode."""

    async def async_set_fan_mode(self, fan_mode):
        """Set new target fan mode."""
```

### Set humidity

```python
class MyHumidifierDevice(HumidifierDevice):
    # Implement one of these methods.

    def set_humidity(self, humidity):
        """Set new target humidity."""

    async def async_set_humidity(self, humidity):
        """Set new target humidity."""
```

### Control auxiliary heater

```python
class MyHumidifierDevice(HumidifierDevice):
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
