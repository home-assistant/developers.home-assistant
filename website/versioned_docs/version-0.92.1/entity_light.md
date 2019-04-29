---
title: Light Entity
sidebar_label: Light
id: version-0.92.1-entity_light
original_id: entity_light
---


A light entity is a device that controls the brightness, RGB value,color temperature and effects of a light source.

## Properties

| Name | Type | Default | Description
| ---- | ---- | ---- | ----
| brightness | int | None | Return the brightness of this light between 0..255
| color_temp | int | None | Return the CT color value in mireds.
| effect | String | None | Return the current effect.
| effect_list | list | None | Return the list of supported effects.
| hs_color | list | None | Return the hue and saturation color value [float, float].
| is_on    | bool | bool  | Returns if the light entity is on or not.  
| max_minreds | int | int | Return the warmest color_temp that this light supports.
| min_mireds | int | int | Return the coldest color_temp that this light supports.
| supported_features | int | int | Flag supported features.
| white_value | int | None | Return the white value of this light between 0..255.


## Support Feature  
| Constant | Description 
|----------|-----------------------
| `SUPPORT_BRIGHTNESS` | Controls the brightness of a light source
| `SUPPORT_COLOR` | Controls the color a light source shows
| `SUPPORT_COLOR_TEMP` | Controls the representation a light source shows based on temperature
| `SUPPORT_EFFECT` | Controls the effect a light source shows
| `SUPPORT_FLASH` | Controls the duration of a flash a light source shows
| `SUPPORT_TRANSITION` | Controls the duration of transitions between color and effects
| `SUPPORT_WHITE_VALUE` | Controls the white light a light source shows.

## Methods

# Turn on Light Device

```python
class MyLightDevice(LightDevice):
  def turn_on(self, **kwargs):
    """Turn the device on."""
    
  async def async_turn_on(self, **kwargs):
    """Turn device on."""

```

# Turn Off Light Device

```python
class MyLightDevice(LightDevice):

  def turn_off(self, **kwargs):
    """Turn the device off."""
  
  async def async_turn_off(self, **kwargs):
    """Turn device off."""

```
