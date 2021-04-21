---
title: Light Entity
sidebar_label: Light
---


A light entity controls the brightness, hue and saturation color value, white value, color temperature and effects of a light source. Derive platform entities from [`homeassistant.components.light.LightEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/light/__init__.py).

## Properties

| Name | Type | Default | Description
| ---- | ---- | ---- | ----
| brightness | int | None | Return the brightness of this light between 0..255
| color_mode | string | None | Return the color mode of the light. Must be present in the `supported_color_modes` property.
| color_temp | int | None | Return the CT color value in mireds.
| effect | String | None | Return the current effect.
| effect_list | list | None | Return the list of supported effects.
| hs_color | list | None | Return the hue and saturation color value [float, float].
| is_on    | bool | bool  | Returns if the light entity is on or not.  
| max_mireds | int | int | Return the warmest color_temp that this light supports.
| min_mireds | int | int | Return the coldest color_temp that this light supports.
| rgb_color | list | None | Return the rgb color value [int, int, int].
| rgbw_color | list | None | Return the rgbw color value [int, int, int, int].
| rgbww_color | list | None | Return the rgbww color value [int, int, int, int, int].
| supported_color_modes | list | None | Flag supported color modes.
| supported_features | int | int | Flag supported features.
| white_value | int | None | Return the white value of this light between 0..255. This is deprecated and will be removed in Home Assistant 2021.10.
| xy_color | list | None | Return the xy color value [float, float].

## Color Modes

| Constant | Description
|----------|-----------------------
| `COLOR_MODE_UNKNOWN` | 
| `COLOR_MODE_ONOFF` | The light can be turned on or off. This mode must be the only supported mode if supported by the light.
| `COLOR_MODE_BRIGHTNESS` | The light can be dimmed. This mode must be the only supported mode if supported by the light.
| `COLOR_MODE_COLOR_TEMP` | The light can be dimmed and its color temperature is present in the state.
| `COLOR_MODE_HS` | The light can be dimmed and its color is present in the state as an (h, s) tuple (no brightness).
| `COLOR_MODE_RGB` | The light can be dimmed and its color is present in the state as an (r, g, b) tuple (not normalized for brightness).
| `COLOR_MODE_RGBW` | The light can be dimmed and its color is present in the state as an (r, g, b, w) tuple (not normalized for brightness).
| `COLOR_MODE_RGBWW` | The light can be dimmed and its color is present in the state as an (r, g, b, cw, ww) tuple (not normalized for brightness).
| `COLOR_MODE_XY` | The light can be dimmed and its color is present in the state as an (x, y) tuple (no brightness).

Note that in color modes `COLOR_MODE_RGB`, `COLOR_MODE_RGBW` and `COLOR_MODE_RGBWW` there is brightness information both in the light`s `brightness` property and in the color.

If the light is in mode `COLOR_MODE_HS`, `COLOR_MODE_RGB` or `COLOR_MODE_XY`, the light's state attribute will contain the light's color expressed in `hs`, `rgb` and `xy` color format. Note that information is lost when the light is in mode `COLOR_MODE_RGB` as `hs` and `xy` don't hold brightness information.

## Support Feature

| Constant | Description
|----------|-----------------------
| `SUPPORT_BRIGHTNESS` | Controls the brightness of a light source. This is deprecated and will be removed in Home Assistant 2021.10.
| `SUPPORT_COLOR` | Controls the color a light source shows. This is deprecated and will be removed in Home Assistant 2021.10.
| `SUPPORT_COLOR_TEMP` | Controls the representation a light source shows based on temperature. This is deprecated and will be removed in Home Assistant 2021.10.
| `SUPPORT_EFFECT` | Controls the effect a light source shows
| `SUPPORT_FLASH` | Controls the duration of a flash a light source shows
| `SUPPORT_TRANSITION` | Controls the duration of transitions between color and effects
| `SUPPORT_WHITE_VALUE` | Controls the white light a light source shows. This is deprecated and will be removed in Home Assistant 2021.10.

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
