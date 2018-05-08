The `state` of the weather component describes the current weather in words. Following states are covered by our translations and mapped to the corresponding icon:
`clear-night, cloudy, fog, hail, lightning, lightning-rainy, partlycloudy, pouring, rainy, snowy, snowy-rainy, sunny, windy, windy-variant`

Following additional attributes can be set for the current state, at least temperature has to be set. Attributes have to respect the user-defined unit system:
```yaml
attributes:
  temperature: 25    # °C   / °F
  humidity: 75       # %
  air_pressure: 1010 # hPa
  visibility: 4      # km   / mi
  wind_speed: 15     # km/h / mi/h
  wind_bearing: ENE  # 1-3 letter
```

If the data provider requests a branding text:
```yaml
attributes:
  - attribution: "Weather details provided by Yahoo! Inc."
```

If the data provider supports daily or hourly forecast:
```yaml
attributes:
  forecast:
    - datetime     # UNIX timestamp
    - condition    # same as used in current state
    - temperature  # °C / °F, current temperature for hourly forcast, higher temperature for daily forecast
    - templow      # °C / °F, for daily forecast only
```
