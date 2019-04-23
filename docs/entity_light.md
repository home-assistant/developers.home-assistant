---
title: Light Entity
sidebar_label: Light
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
| max_minreds | int | int | Return the warmest color_temp that this light supports.
| min_mireds | int | int | Return the coldest color_temp that this light supports.
| supported_features | int | int | Flag supported features.
| white_value | int | None | Return the white value of this light between 0..255.


### Device Classes
| Constant | Description 
|----------|-----------------------
| 'ATTR_RGB_COLOR' | Supports RGB color 
| 'ATTR_XY_COLOR' | Supports user selecting a color from a color gradient graph
| 'ATTR_HS_COLOR' | Supports picking a color based on shade and light
| 'ATTR_COLOR_TEMP' | Supports color correlation with temperature
| 'ATTR_KELVIN' | Supports Kelvin readings
| 'ATTR_MIN_MIREDS' | Supports minimum micro reciprocal degree reading
| 'ATTR_MAX_MIREDS' | Supports maximum micro reciprocal degree reading
| 'ATTR_COLOR_NAME' | Supports naming of colors
| 'ATTR_WHITE_VALUE' | Supports white light 
| 'ATTR_BRIGHTNESS' | Supports adjusting the brightness
| 'ATTR_BRIGHTNESS_PCT' | Supports adjusting the brightness
| 'ATTR_PROFILE' | Representing a user profile
| 'ATTR_FLASH' | Supports flash effects 
| 'FLASH_SHORT' | Supports short flashes
| 'FLASH_LONG' | Supports long flashes
| 'ATTR_EFFECT_LIST' | Supports a list of effects
| 'ATTR_EFFECT' | Shows which effect is being showed
| 'EFFECT_COLORLOOP' | Supports a color loop
| 'EFFECT_RANDOM' | Supports a random effects
| 'EFFECT_WHITE' | Supports white light effects



## Support Feature  
| Constant | Description 
|----------|-----------------------
| 'SUPPORT_BRIGHTNESS' | Controls the brightness of a light source
| 'SUPPORT_COLOR' | Controls the color a light source shows
| 'SUPPORT_COLOR_TEMP' | Controls the representation a light source shows based on temperature
| 'SUPPORT_EFFECT' | Controls the effect a light source shows
| 'SUPPORT_FLASH' | Controls the duration of a flash a light source shows
| 'SUPPORT_TRANSITION' | Controls the duration of transitions between color and effects
| 'SUPPORT_WHITE_VALUE' | Controls the white light a light source shows.

