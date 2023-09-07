---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "Weather entity forecast types"
---

`WeatherEntity` now allows a single weather entity to support different forecast types meaning it's no longer necessary to create multiple entities for the same location, as an example, an entity providing daily forecast and another entity providing hourly forecast.

Integrations providing `weather` entities should be updated to implement one or several of the new async methods `async_forecast_daily`, `async_forecast_hourly` and `async_forecast_twice_daily`.

For the upcoming Home Assistant Core 2024.3 release, integrations should remove the deprecated `forecast` property and also remove any duplicated weather entities which were added to provide multiple forecasts.

See [`weather` developer documentation](/docs/core/entity/weather#weather-forecasts) for details on how to implement the new forecast methods.

The "Weather Forecast Card" has been updated to provide the user with an option to select the preferred forecast to show, if the integration are using the new methods.
