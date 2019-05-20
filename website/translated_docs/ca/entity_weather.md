---
title: Weather Entity
sidebar_label: Weather
---

## Propietats

> Les propietats han de retornar només informació en memòria i no fer transaccions I/O (com peticions web). Implementa el mètode `update()` or `async_update()` per obtenir les dades.

| Name         | Tipus   | Per defecte    | Descripció                                      |
| ------------ | ------- | -------------- | ----------------------------------------------- |
| state        | string  | **Obligatori** | The current weather condition.                  |
| temperature  | flotant | **Obligatori** | The current temperature in °C or °F.            |
| pressure     | flotant | `Cap`          | The current air pressure in hPa or inHg.        |
| humidity     | flotant | `Cap`          | The current humidity in %.                      |
| visibility   | flotant | `Cap`          | The current visibility in km or mi.             |
| wind_speed   | flotant | `Cap`          | The current wind speed in km/h or mi/h.         |
| wind_bearing | string  | `Cap`          | The current wind bearing, 1-3 letters.          |
| forecast     | array   | `Cap`          | Daily or Hourly forecast data.                  |
| attribution  | string  | `Cap`          | The branding text required by the API provider. |

Les propietats han de estar en les unitats definides a `unit_system`.

### Forecast

Forecast data should either be daily or hourly.

| Name        | Tipus   | Per defecte    | Descripció                              |
| ----------- | ------- | -------------- | --------------------------------------- |
| datetime    | string  | **Obligatori** | UTC Date time in RFC 3339 format.       |
| temperature | flotant | **Obligatori** | The higher temperature in °C or °F      |
| condition   | string  | `Cap`          | The weather condition at this point.    |
| templow     | flotant | `Cap`          | The lower daily Temperature in °C or °F |

### Recommended values for state and condition

These weather conditions are included in our translation files and also show the corresponding icon.

| Condition       | Descripció                        |
| --------------- | --------------------------------- |
| clear-night     | Clear night                       |
| cloudy          | Many clouds                       |
| fog             | Fog                               |
| lightning       | Lightning/ thunderstorms          |
| lightning-rainy | Lightning/ thunderstorms and rain |
| partlycloudy    | A few clouds                      |
| pouring         | Pouring rain                      |
| rainy           | Rain                              |
| snowy           | Snow                              |
| snowy-rainy     | Snow and Rain                     |
| sunny           | Sunshine                          |
| windy           | Wind                              |
| windy-variant   | Wind and clouds                   |

This means that the `weather` platforms don't need to support languages.