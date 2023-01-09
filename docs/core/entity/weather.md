---
title: Weather Entity
sidebar_label: Weather
---

Derive entity platforms from [`homeassistant.components.weather.WeatherEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/weather/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| condition | string | **Required** | The current weather condition.
| native_temperature | float | **Required** | The current temperature in °C or °F.
| native_apparent_temperature | float | `None` | The current apparent (feels-like) temperature in °C or °F.
| native_temperature_unit | string | **Required** | The temperature unit; °C or °F.
| native_dew_point | float | `None` | The dew point temperature in °C or °F.
| native_pressure | float | `None` | The current air pressure in hPa, mbar, inHg or mmHg.
| native_pressure_unit | string | `None` | The air pressure unit; hPa, mbar, inHg or mmHg. Required if native_pressure is set.
| humidity | float | `None` | The current humidity in %.
| ozone | float | `None` | The current ozone level.
| cloud_coverage | int | `None` | The current cloud coverage in %.
| native_visibility | float | `None` | The current visibility in km or mi.
| native_visibility_unit | string | `None` | The visibility unit; km or mi. Required if native_visibility is set.
| native_wind_gust_speed | float | `None` | The current wind gust speed in m/s, km/h, mi/h, ft/s or kn.
| native_wind_speed | float | `None` | The current wind speed in m/s, km/h, mi/h, ft/s or kn.
| native_wind_speed_unit | string | `None` | The wind speed unit;m/s, km/h, mi/h, ft/s or kn. Required if native_wind_speed is set.
| native_precipitation_unit | string | `None` | The precipitation unit; mm or in.
| wind_bearing | float or string | `None` | The current wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction.
| forecast_daily | array | `None` | Daily forecast data.
| forecast_hourly | array | `None` | Hourly forecast data.
| forecast_twice_daily | array | `None` | Twice daily forecast data.

### Unit Conversion

Properties have to follow the units mentioned on the respective unit of measurement in the table.

To the user, properties will be presented according to the unit system. This is achieved by automatically converting units when creating state objects.

For each weather entity, the user also has the option to override the presentation units, i.e., the units used in the state objects.

### Forecast

Forecast data can be daily, hourly or twice_daily in its respective array. An integration can set and use any/all of them.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| datetime | string | **Required** | UTC Date time in RFC 3339 format.
| native_temperature | float | **Required** | The higher temperature in °C or °F
| native_apparent_temperature | float | `None` | The apparent (feels-like) temperature in °C or °F
| condition | string | `None` | The weather condition at this point.
| native_templow | float | `None` | The lower daily Temperature in °C or °F
| native_dew_point | float | `None` | The dew point temperature in °C or °F
| native_precipitation | float | `None` | The precipitation amount in mm or in.
| precipitation_probability | int | `None` | The probability of precipitation in %.
| humidity | float | `None` | The humidity in %.
| cloud_coverage | int | `None` | The cloud coverage in %.
| native_pressure | float | `None` | The air pressure in hPa, mbar, inHg or mmHg.
| wind_bearing | float or string | `None` | The wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction.
| native_wind_gust_speed | int | `None` | The wind gust speed in m/s, km/h, mi/h, ft/s or kn.
| native_wind_speed | int | `None` | The wind speed in m/s, km/h, mi/h, ft/s or kn.
| is_daytime | bool | `None` | For `forecast_twice_daily` required to use for day/night.

Forecast data needs to follow the same unit of measurement as defined for properties where applicable.

### Recommended values for state and condition

These weather conditions are included in our translation files and also show the corresponding icon.

| Condition | Description
| --------- | -----------
| clear-night | Clear night
| cloudy | Many clouds
| exceptional | Exceptional
| fog | Fog
| hail | Hail
| lightning | Lightning/ thunderstorms
| lightning-rainy | Lightning/ thunderstorms and rain
| partlycloudy | A few clouds
| pouring | Pouring rain
| rainy | Rain
| snowy | Snow
| snowy-rainy | Snow and Rain
| sunny | Sunshine
| windy | Wind
| windy-variant | Wind and clouds

This means that the `weather` platforms don't need to support languages.
