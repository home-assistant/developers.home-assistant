---
title: Climate Entity
sidebar_label: Climate
---

> A climate entity is a device that controls temperature, humidity, or fans, such as A/C systems and humidifiers. Derive entity platforms from [`homeassistant.components.climate.ClimateDevice`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/climate/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

### Platform Properties

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_fan_mode | string | None | Returns the current fan mode.
| current_hold_mode | string | None | The current hold mode, e.g., home, away, temp.
| current_humidity | float/int | None | The current humidity.
| current_operation | string | None | The current operation (e.g. heat, cool, idle). Used to determine `state`.
| current_swing_mode | ??? | None | Returns the fan setting.
| current_temperature | float | None | The current temperature.
| fan_list | list | None | Returns the list of available fan modes.
| is_aux_heat_on | bool | None | Returns True if an auxiliary heater is on.
| is_away_mode_on | bool | None | Return true if away mode is on.
| is_on  | bool | None | Returns True if device is on. Used to determine `state`.
| max_humidity | int | `DEFAULT_MAX_HUMIDITY` (99) | Returns the maximum humidity.
| max_temp | int | `DEFAULT_MAX_TEMP` (35) | Returns the maximum temperature.
| min_humidity | int | `DEFAULT_MIN_HUMIDITY` (30) | Returns the minimum humidity.
| min_temp | int | `DEFAULT_MIN_TEMP` (7) | Returns the minimum temperature.
| operation_list | list | None | List of available operation modes.
| precision | float | PRECISION_WHOLE | The precision of the temperature in the system: tenths for TEMP_CELSIUS, whole number otherwise.
| state | string | None | Returns the current state.
| state_attributes | dictionary | N/A | The optional state attributes: current temperature, minimum temperature, maximum temperature, and target temperature.
| supported_features | list | ??? | Returns list of supported features.
| swing_list | list | None | Returns the list of available swing modes.
| target_humidity |  | None | The target humidity.
| target_temperature | float | None | The temperature currently set to be reached.
| target_temperature_high | float | None | The upper bound target temperature
| target_temperature_low | float | None | The lower bound target temperature
| target_temperature_step | ??? | None | The supported step of target temperature
| temperature_unit | string | `NotImplementedError` | The unit of temperature measurement for the system (e.g. Celsius).



## Methods

### Set swing mode

```python
class MyClimateDevice(ClimateDevice):
	# Implement one of these methods.

	def set_swing_mode(self, swing_mode):
		"""Set new target swing operation."""

	async def async_set_swing_mode(self, swing_mode):
		"""Set new target swing operation."""

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

### Set temperature

```python
class MyClimateDevice(ClimateDevice):
	# Implement one of these methods.
	
	def set_temperature(self, **kwargs):
		"""Set new target temperature."""

	async def async_set_temperature(self, **kwargs):
		"""Set new target temperature."""

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

### Set hold mode

```python
class MyClimateDevice(ClimateDevice):
	# Implement one of these methods.

	def set_hold_mode(self, hold_mode):
		"""Set new target hold mode."""

	async def async_set_hold_mode(self, hold_mode):
		"""Set new target hold mode."""

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
