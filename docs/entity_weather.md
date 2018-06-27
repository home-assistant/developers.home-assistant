---
title: Weather Entity
sidebar_label: Weather
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state | string | **Required** | The current weather condition.
| temperature | float | **Required** | The current temperature in °C or °F.
| pressure | float | `None` | The current air pressure in hPa or inHg.
| humidity | float | `None` | The current humidity in %.
| visibility | float | `None` | The current visibility in km or mi.
| wind_speed | float | `None` | The current wind speed in km/h or mi/h.
| wind_bearing | string | `None` | The current wind bearing, 1-3 letters.
| forecast | array | `None` | Daily or Hourly forecast data.
| attribution | string | `None` | The branding text required by the API provider.

Properties have to follow the units defined in the `unit_system`.

### Forecast

Forecast data should either be daily or hourly.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| datetime | string | **Required** | UTC Date time in RFC 3339 format.
| temperature | float | **Required** | The higher temperature in °C or °F
| condition | string | `None` | The weather condition at this point.
| templow | float | `None` | The lower daily Temperature in °C or °F

### Recommended values for state and condition

These weather conditions are included in our translation files and also show the corresponding icon.

| Condition | Description
| --------- | -----------
| clear-night | Clear night
| cloudy | Many clouds
| fog | Fog
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
