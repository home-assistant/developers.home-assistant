---
title: Light Entity
sidebar_label: Light
---


A light entity controls the brightness, hue and saturation color value, white value, color temperature and effects of a light source. Derive platform entities from [`homeassistant.components.light.LightEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/light/__init__.py).

## Properties

| Name | Type | Default | Description
| ---- | ---- | ---- | ----
| brightness | int | None | Integer between 0 and 255 representing the light's brightness, where 0 means the light is off, 1 is the minimum brightness and 255 is the maximum brightness supported by the light. This controls the brightness of all channels (R,G,B,WW,CW). 50% brightness means all channels are at most 50% on.
| color_temp | int | None | The color temperature in mireds. At the coldest possible color_temp, only the cold white channel is on and the warm white cahnnel is off. At the warmest possible color_temp, only the warm white channel is on and the cold white cahnnel is off. 
| effect | String | None | The current effect.
| effect_list | list | None | Return the list of supported effects.
| hs_color | list | None | The ligh'ts color represented as hue and saturation [float, float].
| is_on    | bool | bool  | If the switch is currently on or off. If is_on is false, all channels (R,G,B,WW,CW) are OFF.
| max_mireds | int | int | The warmest color_temp that this light supports.
| min_mireds | int | int | The coldest color_temp that this light supports.
| rgb_color | list | None | The color represented as RGB [int, int, int]. Each channel is between 0..255. The color is normalized, meaning the RGB representation is not scaled for brightness.
| supported_features | int | int | Flag supported features.
| white_value | int | None | Integer between 0 and 255 representing the light's white value. The white value represents the brightness of the white channel(s) (cold white and warm white) for RGBW and RGBWW lights. If white_value == 0, the light is in color mode and the white channel(s) are turned off. If white_value > 0, the light is in white mode and the color channels are turned off.
| xy_color | list | None | The color represented as an XY-value.

## Approximate channel brightness formulas for dimmable lights
Note: The formulas are naive - actual mixing between R/G/B and cw/ww channels is not usually linear.

### Simple dimmer
brightness = int(state == 'ON') * (state.brightness/255)

### White light with adjustable color temperature
CW = int(state == 'ON') * (state.brightness/255) * (state.color_temp-state.min_mireds)/(state.max_mireds-state.min_mireds)
WW = int(state == 'ON') * (state.brightness/255) * (state.max_mireds-state.color_temp)/(state.max_mireds-state.min_mireds)

### RGB light - Full color light without separate white channel(s)
R = int(state == 'ON') * (state.brightness/255) * (state.rgb_color[0]/255)
G = int(state == 'ON') * (state.brightness/255) * (state.rgb_color[1]/255)
B = int(state == 'ON') * (state.brightness/255) * (state.rgb_color[2]/255)

### RGBW light - Full color light with white channel
R = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.rgb_color[0]/255)
G = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.rgb_color[1]/255)
B = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.rgb_color[2]/255)
W = int(state == 'ON') * int(state.white_value > 0) * (state.brightness/255)

### RGBWW light - Full color light with white channels with adjustable color temperature
R = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.rgb_color[0]/255)
G = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.rgb_color[1]/255)
B = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.rgb_color[2]/255)
CW = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.color_temp-state.min_mireds)/(state.max_mireds-state.min_mireds)
WW = int(state == 'ON') * int(state.white_value == 0) * (state.brightness/255) * (state.max_mireds-state.color_temp)/(state.max_mireds-state.min_mireds)

## Support Feature

| Constant | Description 
|----------|-----------------------
| `SUPPORT_BRIGHTNESS` | The light's brightness can be controlled
| `SUPPORT_COLOR` | The light's color can be controlled
| `SUPPORT_COLOR_TEMP` | The color temperature of the light can be controlled when the light is in white mode 
| `SUPPORT_EFFECT` | The light supports effects such as color cycling etc.
| `SUPPORT_FLASH` | The light can be set to flashing with controllable duration
| `SUPPORT_TRANSITION` | The duration transitions between colors and effects can be controlled
| `SUPPORT_WHITE_VALUE` | The light can be set in white mode

## Methods

### Turn on Light Device

```python
class MyLightEntity(LightEntity):
    def turn_on(self, **kwargs):
        """Turn the device on."""

    async def async_turn_on(self, **kwargs):
        """Turn device on."""
```

### Turn Off Light Device

```python
class MyLightEntity(LightEntity):
    def turn_off(self, **kwargs):
        """Turn the device off."""

    async def async_turn_off(self, **kwargs):
        """Turn device off."""
```
