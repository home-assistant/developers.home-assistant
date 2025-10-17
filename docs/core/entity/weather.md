---
title: Weather entity
sidebar_label: Weather
---

Derive entity platforms from [`homeassistant.components.weather.WeatherEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/weather/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| cloud_coverage | int | `None` | The current cloud coverage in %.
| condition | string | **Required** | The current weather condition.
| humidity | float | `None` | The current humidity in %.
| native_apparent_temperature | float | `None` | The current apparent (feels-like) temperature in °C or °F.
| native_dew_point | float | `None` | The dew point temperature in °C or °F.
| native_precipitation_unit | string | `None` | The precipitation unit; mm or in.
| native_pressure | float | `None` | The current air pressure in hPa, mbar, inHg or mmHg.
| native_pressure_unit | string | `None` | The air pressure unit; hPa, mbar, inHg or mmHg. Required if native_pressure is set.
| native_temperature | float | **Required** | The current temperature in °C or °F.
| native_temperature_unit | string | **Required** | The temperature unit; °C or °F.
| native_visibility | float | `None` | The current visibility in km or mi.
| native_visibility_unit | string | `None` | The visibility unit; km or mi. Required if native_visibility is set.
| native_wind_gust_speed | float | `None` | The current wind gust speed in Beaufort, m/s, km/h, mi/h, ft/s or kn.
| native_wind_speed | float | `None` | The current wind speed in Beaufort, m/s, km/h, mi/h, ft/s or kn.
| native_wind_speed_unit | string | `None` | The wind speed unit; Beaufort, m/s, km/h, mi/h, ft/s or kn. Required if native_wind_speed is set.
| ozone | float | `None` | The current ozone level.
| uv_index | float | `None` | The current [UV index](https://en.wikipedia.org/wiki/Ultraviolet_index).
| wind_bearing | float or string | `None` | The current wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction.

### Unit conversion

Properties have to follow the units mentioned on the respective unit of measurement in the table.

To the user, properties will be presented according to the unit system. This is achieved by automatically converting units when creating state objects.

For each weather entity, the user also has the option to override the presentation units, i.e., the units used in the state objects.

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

## Supported features

Supported features are defined by using values in the `WeatherEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value                      | Description                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `FORECAST_DAILY`           | The device supports a daily forecast.                                                       |
| `FORECAST_HOURLY`          | The device supports an hourly forecast.                                                     |
| `FORECAST_TWICE_DAILY`     | The device supports a twice-daily forecast.                                                 |

## Weather forecasts

A weather platform can optionally provide weather forecasts. Support for weather forecasts is indicated by setting the correct [supported feature](#supported-features). Weather forecasts are not part of the entity's state, they're instead made available by a separate API. Consumers, e.g. frontend, can subscribe to weather forecast updates.

### Forecast data

Forecast data can be daily, hourly or twice_daily. An integration can provide any or all of them.

The integration should implement one or several of the async methods `async_forecast_daily`, `async_forecast_hourly` and `async_forecast_twice_daily` documented below to fetch the forecast data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| datetime | string | **Required** | UTC Date time in RFC 3339 format.
| is_daytime | bool | `None` | This is mandatory in forecast data returned by `async_forecast_twice_daily` to indicate day or night.
| cloud_coverage | int | `None` | The cloud coverage in %.
| condition | string | `None` | The weather condition at this point.
| humidity | float | `None` | The humidity in %.
| native_apparent_temperature | float | `None` | The apparent (feels-like) temperature in °C or °F
| native_dew_point | float | `None` | The dew point temperature in °C or °F
| native_precipitation | float | `None` | The precipitation amount in mm or in.
| native_pressure | float | `None` | The air pressure in hPa, mbar, inHg or mmHg.
| native_temperature | float | **Required** | The higher temperature in °C or °F
| native_templow | float | `None` | The lower daily Temperature in °C or °F
| native_wind_gust_speed | int | `None` | The wind gust speed in Beaufort, m/s, km/h, mi/h, ft/s or kn.
| native_wind_speed | int | `None` | The wind speed in Beaufort, m/s, km/h, mi/h, ft/s or kn.
| precipitation_probability | int | `None` | The probability of precipitation in %.
| uv_index | float | `None` | The UV index.
| wind_bearing | float or string | `None` | The wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction.

Forecast data needs to follow the same unit of measurement as defined for properties where applicable.

### Methods to get weather forecast(s)

These method are called to fetch forecasts from the api.

```python
class MyWeatherEntity(WeatherEntity):
    """Represent a Weather entity."""

    async def async_forecast_daily(self) -> list[Forecast] | None:
        """Return the daily forecast in native units.
        
        Only implement this method if `WeatherEntityFeature.FORECAST_DAILY` is set
        """

    async def async_forecast_twice_daily(self) -> list[Forecast] | None:
        """Return the twice daily forecast in native units.
        
        Only implement this method if `WeatherEntityFeature.FORECAST_TWICE_DAILY` is set
        """

    async def async_forecast_hourly(self) -> list[Forecast] | None:
        """Return the hourly forecast in native units.
        
        Only implement this method if `WeatherEntityFeature.FORECAST_HOURLY` is set
        """
```

### Updating weather forecast(s)

It is strongly recommended that fetched weather forecasts are cached by the weather entity to avoid unnecessary API accesses.

When an updated weather forecast is available, the weather forecast cache should be invalidated and the method `WeatherEntity.async_update_listeners` should be awaited to trigger a push of the updated weather forecast to any active subscriber. If there are active listeners, `WeatherEntity.async_update_listeners` will call the corresponding `async_forecast_xxx` methods. If there are no active listeners, `WeatherEntity.async_update_listeners` will not call any ot the `async_forecast_xxx` methods.