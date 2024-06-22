---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: New scaling utils and import changes
---

## New utils for scaling brightness

Multiple integrations have implemented there own scaling algorithm to scale brightness. New utils are introduced now to simplify the implementation of brightness scaling in `homeassistant.util.color`:

```python
def brightness_to_value(low_high_range: tuple[float, float], brightness: int) -> float:
    """Given a brightness_scale convert a brightness to a single value.

    Do not include 0 if the light is off for value 0.

    Given a brightness low_high_range of (1,100) this function
    will return:

    255: 100.0
    127: ~49.8039
    10: ~3.9216
    """
    ...
```

If you'd rather like to scale brightness to an integer range you can also use `scale_ranged_value_to_int_range`, described [here](#background).

```python
def value_to_brightness(low_high_range: tuple[float, float], value: float) -> int:
    """Given a brightness_scale convert a single value to a brightness.

    Do not include 0 if the light is off for value 0.

    Given a brightness low_high_range of (1,100) this function
    will return:

    100: 255
    50: 127
    4: 10

    The value will be clamped between 1..255 to ensure valid value.
    """
    ...
```

This also ensures a valid brightness value is returned.

### Background

To scale fan speed percentage we already have some utils `homeassistant.utils.percentage`:

```python
def ranged_value_to_percentage(
    low_high_range: tuple[float, float], value: float
) -> int:
    ...
```

and

```python
def percentage_to_ranged_value(
    low_high_range: tuple[float, float], percentage: int
) -> float:
    ...
```

These percentage utils will now use new generic scaling utils in `homeassistant.utils.scaling`:

`scale_ranged_value_to_int_range` and `scale_to_ranged_value`

```python
def scale_ranged_value_to_int_range(
    source_low_high_range: tuple[float, float],
    target_low_high_range: tuple[float, float],
    value: float,
) -> int:
    """Given a range of low and high values convert a single value to another range.

    Given a source low value of 1 and a high value of 255 and
    a target range from 1 to 100 this function
    will return:

    (1,255), 255: 100
    (1,255), 127: 50
    (1,255), 10: 4
    """
    ...
```

and

```python
def scale_to_ranged_value(
    source_low_high_range: tuple[float, float],
    target_low_high_range: tuple[float, float],
    value: int,
) -> float:
    """Given a range of low and high values convert a single value to another range.

    Do not include 0 in a range if 0 means off,
    e.g. for brightness or fan speed.

    Given a source low value of 1 and a high value of 255 and
    a target range from 1 to 100 this function
    will return:

    (1,255), 255: 100
    (1,255), 127: ~49.8039
    (1,255), 10: ~3.9216
    """
    ...
```

## Utils `int_states_in_range` and `states_in_range` are moved

These utils are now under `homeassistant.util.scaling`. If these are used in your custom integration, make sure you update the import to the new module.
