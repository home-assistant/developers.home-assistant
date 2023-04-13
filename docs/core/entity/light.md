---
title: Light Entity
sidebar_label: Light
---


A light entity controls the brightness, hue and saturation color value, white value, color temperature and effects of a light source. Derive platform entities from [`homeassistant.components.light.LightEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/light/__init__.py).

## Properties

| Name | Type | Default | Description
| ---- | ---- | ---- | ----
| brightness | int | None | Return the brightness of this light between 1..255
| color_mode | string | None | Return the color mode of the light. The returned color mode must be present in the `supported_color_modes` property.
| color_temp | int | None | Return the CT color value in mireds. This property will be copied to the light's state attribute when the light's color mode is set to `ColorMode.COLOR_TEMP` and ignored otherwise.
| effect | String | None | Return the current effect.
| effect_list | list | None | Return the list of supported effects.
| hs_color | tuple | None | Return the hue and saturation color value (float, float). This property will be copied to the light's state attribute when the light's color mode is set to `ColorMode.HS` and ignored otherwise.
| is_on    | bool | `None`  | Returns if the light entity is on or not.  
| max_mireds | int | int | Return the warmest color_temp that this light supports.
| min_mireds | int | int | Return the coldest color_temp that this light supports.
| rgb_color | tuple | None | Return the rgb color value (int, int, int). This property will be copied to the light's state attribute when the light's color mode is set to `ColorMode.RGB` and ignored otherwise.
| rgbw_color | tuple | None | Return the rgbw color value (int, int, int, int). This property will be copied to the light's state attribute when the light's color mode is set to `ColorMode.RGBW` and ignored otherwise.
| rgbww_color | tuple | None | Return the rgbww color value (int, int, int, int, int). This property will be copied to the light's state attribute when the light's color mode is set to `ColorMode.RGBWW` and ignored otherwise.
| supported_color_modes | set | None | Flag supported color modes.
| supported_features | int | int | Flag supported features.
| white_value | int | None | Return the white value of this light between 0..255. This is deprecated and will be removed in Home Assistant 2021.10.
| xy_color | tuple | None | Return the xy color value (float, float). This property will be copied to the light's state attribute when the light's color mode is set to `ColorMode.XY` and ignored otherwise.

## Color Modes

New integrations must implement both `color_mode` and `supported_color_modes`. If an integration is upgraded to support color mode, both `color_mode` and `supported_color_modes` should be implemented.

Supported color modes are defined by using values in the `ColorMode` enum.

If a light does not implement the `supported_color_modes`, the `LightEntity` will attempt deduce it based on deprecated flags in the `supported_features` property:

 - Start with an empty set
 - If `SUPPORT_COLOR_TEMP` is set, add `ColorMode.COLOR_TEMP`
 - If `SUPPORT_COLOR` is set, add `ColorMode.HS`
 - If `SUPPORT_WHITE_VALUE` is set, add `ColorMode.RGBW`
 - If `SUPPORT_BRIGHTNESS` is set and no color modes have yet been added, add `ColorMode.BRIGHTNESS`
 - If no color modes have yet been added, add `ColorMode.ONOFF`

If a light does not implement the `color_mode`, the `LightEntity` will attempt to deduce it based on which of the properties are set and which are `None`:

- If `supported_color_mode` includes `ColorMode.RGBW` and `white_value` and `hs_color` are both not None: `ColorMode.RGBW`
- Else if `supported_color_mode` includes `ColorMode.HS` and `hs_color` is not None: `ColorMode.HS`
- Else if `supported_color_mode` includes `ColorMode.COLOR_TEMP` and `color_temp` is not None: `ColorMode.COLOR_TEMP`
- Else if `supported_color_mode` includes `ColorMode.BRIGHTNESS` and `brightness` is not None: `ColorMode.BRIGHTNESS`
- Else if `supported_color_mode` includes `ColorMode.ONOFF`: `ColorMode.ONOFF`
- Else: ColorMode.UNKNOWN

| Value | Description
|----------|-----------------------
| `ColorMode.UNKNOWN` | The light's color mode is not known.
| `ColorMode.ONOFF` | The light can be turned on or off. This mode must be the only supported mode if supported by the light.
| `ColorMode.BRIGHTNESS` | The light can be dimmed. This mode must be the only supported mode if supported by the light.
| `ColorMode.COLOR_TEMP` | The light can be dimmed and its color temperature is present in the state.
| `ColorMode.HS` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `hs_color` parameter and read through the `hs_color` property. `hs_color` is an (h, s) tuple (no brightness).
| `ColorMode.RGB` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `rgb_color` parameter and read through the `rgb_color` property. `rgb_color` is an (r, g, b) tuple (not normalized for brightness).
| `ColorMode.RGBW` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `rgbw_color` parameter and read through the `rgbw_color` property. `rgbw_color` is an (r, g, b, w) tuple (not normalized for brightness).
| `ColorMode.RGBWW` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `rgbww_color` parameter and read through the `rgbww_color` property. `rgbww_color` is an (r, g, b, cw, ww) tuple (not normalized for brightness).
| `ColorMode.WHITE` | The light can be dimmed and its color can be adjusted. In addition, the light can be set to white mode. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light can be set to white mode by using the `white` parameter with the desired brightness as value. Note that there's no `white` property. If both `brighthness` and `white` are present in a service call, the `white` parameter will be updated with the value of `brightness`. If this mode is supported, the light must also support at least one of `ColorMode.HS`, `ColorMode.RGB`, `ColorMode.RGBW`, `ColorMode.RGBWW` or `ColorMode.XY`.
| `ColorMode.XY` | The light can be dimmed and its color can be adjusted. The light's brightness can be set using the `brightness` parameter and read through the `brightness` property. The light's color can be set using the `xy_color` parameter and read through the `xy_color` property. `xy_color` is an (x, y) tuple.

Note that in color modes `ColorMode.RGB`, `ColorMode.RGBW` and `ColorMode.RGBWW` there is brightness information both in the light's `brightness` property and in the color. As an example, if the light's brightness is 128 and the light's color is (192, 64, 32), the overall brightness of the light is: 128/255 * max(192, 64, 32)/255 = 38%.

If the light is in mode `ColorMode.HS`, `ColorMode.RGB` or `ColorMode.XY`, the light's state attribute will contain the light's color expressed in `hs`, `rgb` and `xy` color format. Note that when the light is in mode `ColorMode.RGB`, the `hs` and `xy` state attributes only hold the chromaticity of the `rgb` color as the `hs` and `xy` pairs do not hold brightness information.

If the light is in mode `ColorMode.RGBW` or `ColorMode.RGBWW`, the light's state attribute will contain the light's color expressed in `hs`, `rgb` and `xy` color format. The color conversion is an approximation done by adding the white channels to the color.

## Supported Features

Supported features are defined by using values in the `LightEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value        | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `EFFECT`     | Controls the effect a light source shows                       |
| `FLASH`      | Controls the duration of a flash a light source shows          |
| `TRANSITION` | Controls the duration of transitions between color and effects |

## Methods

### Turn on Light Device

```python
class MyLightEntity(LightEntity):
    def turn_on(self, **kwargs):
        """Turn the device on."""

    async def async_turn_on(self, **kwargs):
        """Turn device on."""
```

Note that there's no `color_mode` passed to the `async_turn_on` method, instead only a single color attribute is allowed.
It is guaranteed that the integration will only receive a single color attribute in a `turn_on`call, which is guaranteed to be supported by the light according to the light's `supported_color_modes` property. To ensure this, colors in the service call will be translated before the entity's `async_turn_on` method is called if the light doesn't support the corresponding color mode:

| Color type   | Translation
|--------------|-----------------------
| color_temp | Will be removed from the service call if not supported and translated to `hs_color`, `rgb_color`, `rgbw_color`, `rgbww_color` or `xy_color` if supported by the light.
| hs_color | Will be removed from the service call if not supported and translated to `rgb_color`, `rgbw_color`, `rgbww_color` or `xy_color` if supported by the light.
| rgb_color | Will be removed from the service call if not supported and translated to `rgbw_color`, `rgbww_color`, `hs_color` or `xy_color` if supported by the light.
| rgbw_color | Will be removed from the service call if not supported.
| rgbww_color | Will be removed from the service call if not supported.
| xy_color | Will be removed from the service call if not supported and translated to `hs_color`, `rgb_color`, `rgbw_color` or `rgbww_color` if supported by the light.


### Turn Off Light Device

```python
class MyLightEntity(LightEntity):
    def turn_off(self, **kwargs):
        """Turn the device off."""

    async def async_turn_off(self, **kwargs):
        """Turn device off."""
```
