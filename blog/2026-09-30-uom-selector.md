---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: New unit of measurement selector
---

A new `UnitOfMeasurementSelector` lets users pick a unit of measurement in a config, options, or subentry flow. Until now, flows had to build a `SelectSelector` with a hand-made list of units, often rebuilt from the previous step's input. The new selector gets its units from the sensor unit tables, so the options always match what a sensor entity accepts.

## Limit the units

The selector config has two optional keys, `device_classes` and `state_classes`. Both take a single sensor device class or state class, or a list of them.

```python
from homeassistant.components.sensor import SensorDeviceClass, SensorStateClass
from homeassistant.helpers.selector import (
    UnitOfMeasurementSelector,
    UnitOfMeasurementSelectorConfig,
)

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_UNIT_OF_MEASUREMENT): UnitOfMeasurementSelector(
            UnitOfMeasurementSelectorConfig(
                device_classes=[SensorDeviceClass.ENERGY],
                state_classes=[SensorStateClass.TOTAL_INCREASING],
            )
        ),
    }
)
```

The allowed units follow the rules for sensor entities:

- **Device classes:** the selector allows the units of all the listed device classes, taken from `DEVICE_CLASS_UNITS`. A non-numeric device class, like `date`, `enum`, or `timestamp`, allows only no unit. A device class without a unit table, like `monetary`, doesn't limit the units.
- **State classes:** the selector allows the units of all the listed state classes, taken from `STATE_CLASS_UNITS`, but only those that are also allowed by the device classes. A state class without a unit table, like `measurement` or `total`, doesn't limit the units.
- **No limit:** without a device class or state class limit, the selector accepts any string, so the user can enter a custom unit.

The selector returns the unit as a string, or `None` when the user picks no unit.

## Filter the units on other fields

Often the user picks the device class and state class in the same form as the unit, using the [device class and state class selectors](/blog/2026/09/04/device-and-state-class-selectors). Use the new `Selector.with_context()` method to tell the frontend which fields hold these values. The frontend then narrows the list of units as soon as the user changes one of those fields.

The unit of measurement selector supports these context keys:

| Context key           | Field selector type |
| --------------------- | ------------------- |
| `filter_device_class` | `device_class`      |
| `filter_state_class`  | `state_class`       |

The value of each key is the name of the field in the same schema.

```python
from homeassistant.const import (
    CONF_DEVICE_CLASS,
    CONF_STATE_CLASS,
    CONF_UNIT_OF_MEASUREMENT,
)
from homeassistant.helpers.selector import (
    DeviceClassSelector,
    DeviceClassSelectorConfig,
    StateClassSelector,
    UnitOfMeasurementSelector,
)

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_DEVICE_CLASS): DeviceClassSelector(
            DeviceClassSelectorConfig(domain="sensor")
        ),
        probatio.Optional(CONF_STATE_CLASS): StateClassSelector(),
        probatio.Optional(
            CONF_UNIT_OF_MEASUREMENT
        ): UnitOfMeasurementSelector().with_context(
            {
                "filter_device_class": CONF_DEVICE_CLASS,
                "filter_state_class": CONF_STATE_CLASS,
            }
        ),
    }
)
```

`with_context()` returns the selector itself, so you can chain it. It raises a `ValueError` if you pass a context key that the selector doesn't support.

The context only affects the frontend. The selector validates the submitted unit against its own config, not against the values of the other fields. Your flow still needs to check that the unit is valid for the device class and state class that the user picked, and return an error if it isn't.

## Migrating existing unit of measurement selectors

Flows that let the user pick a unit with a `SelectSelector` built from `DEVICE_CLASS_UNITS` or `STATE_CLASS_UNITS` should be migrated to use `UnitOfMeasurementSelector`. You no longer need to build the unit list from the previous submission. Instead, add a context so the frontend filters the units for you.

The selector is also available in blueprints and service descriptions as the `unit_of_measurement` selector. The [Selectors](https://www.home-assistant.io/docs/blueprint/selectors/) documentation will describe it once [home-assistant.io PR #48587](https://github.com/home-assistant/home-assistant.io/pull/48587) is merged.

For more information, see [core PR #183337](https://github.com/home-assistant/core/pull/183337) and the [data entry flow documentation](/docs/data_entry_flow_index#filtering-selector-options-on-other-fields).
