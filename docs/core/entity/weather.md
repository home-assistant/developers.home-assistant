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
| native_temperature_unit | string | **Required** | The temperature unit; °C or °F.
| native_pressure | float | `None` | The current air pressure in hPa, mbar, inHg or mmHg.
| native_pressure_unit | string | `None` | The air pressure unit; hPa, mbar, inHg or mmHg
| humidity | float | `None` | The current humidity in %.
| ozone | float | `None` | The current ozone level.
| native_visibility | float | `None` | The current visibility in km or mi.
| native_visibility_unit | string | `None` | The visibility unit; km or mi.
| native_wind_speed | float | `None` | The current wind speed in m/s, km/h or mi/h.
| native_wind_speed_unit | string | `None` | The wind speed unit; m/s, km/h or mi/h.
| native_precipitation_unit | string | `None` | The precipitation unit; mm or in.
| wind_bearing | float or string | `None` | The current wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction.
| forecast | array | `None` | Daily or Hourly forecast data.

Properties have to follow the units defined in the `unit_system`.

### Forecast

Forecast data should either be daily or hourly.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| datetime | string | **Required** | UTC Date time in RFC 3339 format.
| temperature | float | **Required** | The higher temperature in °C or °F
| condition | string | `None` | The weather condition at this point.
| templow | float | `None` | The lower daily Temperature in °C or °F
| precipitation | float | `None` | The precipitation amount in mm or in.
| precipitation_probability | int | `None` | The probability of precipitation in %.
| pressure | float | `None` | The air pressure in hPa, mbar, inHg or mmHg.
| wind_bearing | float or string | `None` | The wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction.
| wind_speed | int | `None` | The wind speed in m/s, km/h or mi/h.

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
