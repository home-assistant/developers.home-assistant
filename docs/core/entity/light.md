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
| color_temp | int | None | Return the CT color value in mireds. This property will be copied to the light's state attribute when the light's color mode is set to `COLOR_MODE_COLOR_TEMP` and ignored otherwise.
| effect | String | None | Return the current effect.
| effect_list | list | None | Return the list of supported effects.
| hs_color | tuple | None | Return the hue and saturation color value (float, float). This property will be copied to the light's state attribute when the light's color mode is set to `COLOR_MODE_HS` and ignored otherwise.
| is_on    | bool | bool  | Returns if the light entity is on or not.  
| max_mireds | int | int | Return the warmest color_temp that this light supports.
| min_mireds | int | int | Return the coldest color_temp that this light supports.
| rgb_color | tuple | None | Return the rgb color value (int, int, int). This property will be copied to the light's state attribute when the light's color mode is set to `COLOR_MODE_COLOR_RGB` and ignored otherwise.
| rgbw_color | tuple | None | Return the rgbw color value (int, int, int, int). This property will be copied to the light's state attribute when the light's color mode is set to `COLOR_MODE_COLOR_RGBW` and ignored otherwise.
| rgbww_color | tuple | None | Return the rgbww color value (int, int, int, int, int). This property will be copied to the light's state attribute when the light's color mode is set to `COLOR_MODE_COLOR_RGBWW` and ignored otherwise.
| supported_color_modes | set | None | Flag supported color modes.
| supported_features | int | int | Flag supported features.
| white_value | int | None | Return the white value of this light between 0..255. This is deprecated and will be removed in Home Assistant 2021.10.
| xy_color | tuple | None | Return the xy color value (float, float). This property will be copied to the light's state attribute when the light's color mode is set to `COLOR_MODE_COLOR_XY` and ignored otherwise.

## Color Modes

| Constant | Description
|----------|-----------------------
| `COLOR_MODE_UNKNOWN` | The light's color mode is not known.
| `COLOR_MODE_ONOFF` | The light can be turned on or off. This mode must be the only supported mode if supported by the light.
| `COLOR_MODE_BRIGHTNESS` | The light can be dimmed. This mode must be the only supported mode if supported by the light.
| `COLOR_MODE_COLOR_TEMP` | The light can be dimmed and its color temperature is present in the state.
| `COLOR_MODE_HS` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `hs_color` parameter and read through the `hs_color` property. `hs_color` is an (h, s) tuple (no brightness).
| `COLOR_MODE_RGB` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `rgb_color` parameter and read through the `rgb_color` property. `rgb_color` is an (r, g, b) tuple (not normalized for brightness).
| `COLOR_MODE_RGBW` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `rgbw_color` parameter and read through the `rgbw_color` property. `rgbw_color` is an (r, g, b, w) tuple (not normalized for brightness).
| `COLOR_MODE_RGBWW` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `rgbww_color` parameter and read through the `rgbww_color` property. `rgbww_color` is an (r, g, b, cw, ww) tuple (not normalized for brightness).
| `COLOR_MODE_XY` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `xy_color` parameter and read through the `xy_color` property. `xy_color` is an (x, y) tuple.

Note that in color modes `COLOR_MODE_RGB`, `COLOR_MODE_RGBW` and `COLOR_MODE_RGBWW` there is brightness information both in the light's `brightness` property and in the color. As an example, if the light's brightness is 128 and the light's color is (192, 64, 32), the overall brightness of the light is: 128/255 * max(192, 64, 32)/255 = 38%.

If the light is in mode `COLOR_MODE_HS`, `COLOR_MODE_RGB` or `COLOR_MODE_XY`, the light's state attribute will contain the light's color expressed in `hs`, `rgb` and `xy` color format. Note that when the light is in mode `COLOR_MODE_RGB`, the `hs` and `xy` state attributes only hold the chromaticity of the `rgb` color as the `hs` and `xy` pairs do not hold brightness information.

If the light is in mode `COLOR_MODE_RGBW` or `COLOR_MODE_RGBWW`, the light's state attribute will contain the light's color expressed in `hs`, `rgb` and `xy` color format. The color conversion is an approximation done by adding the white channels to the color.

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

Note that there's no `color_mode` passed to the `async_turn_on` method, instead only a single color is allowed.

Colors in the service call will be translated before the entity's `async_turn_on` method is called if the light doesn't support the corresponding color mode:

| Color type   | Translation
|--------------|-----------------------
| color_temp | Not translated, will be passed as is even if not supported by the light.
| hs_color | Will be removed from the service call if not supported and translated to `rgb_color`, `rgbw_color`, `rgbww_color` or `xy_color` if supported by the light.
| rgb_color | Will be removed from the service call if not supported and translated to `rgbw_color`, `rgbww_color`, `hs_color` or `xy_color` if supported by the light.
| rgbw_color | Not translated, will be passed as is even if not supported by the light.
| rgbww_color | Not translated, will be passed as is even if not supported by the light.
| xy_color | Will be removed from the service call if not supported and translated to `hs_color`, `rgb_color`, `rgbw_color` or `rgbww_color` if supported by the light.


### Turn Off Light Device

```python
class MyLightEntity(LightEntity):
    def turn_off(self, **kwargs):
        """Turn the device off."""

    async def async_turn_off(self, **kwargs):
        """Turn device off."""
```
