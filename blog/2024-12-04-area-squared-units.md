---
author: mikey0000
authorURL: https://github.com/mikey0000
title: "New area device class"
---

### Summary of changes
A new `AREA` device class is now available for number and sensor entities, together with automatic unit conversion based on the unit system.
A corresponding `UnitOfArea` unit enumerator, and `AreaConverter` converter class have been added to support the new device class.

### Backward compatibility
As of Home Assistant Core 2024.12, the following unit constant is deprecated and replaced by a corresponding enum:

- `UnitOfArea` enumerator replaces `AREA_SQUARE_METERS` constant

Area units can also be converted between us customary and metric units using `AreaConverter`

# Example

```python
AreaConverter.convert(10, UnitOfArea.SQUARE_KILOMETERS, UnitOfArea.SQUARE_MILES)
```

Number entity has the addition of `NumberDeviceClass.AREA`.

More details can be found in the Number [documentation](/docs/core/entity/number#available-device-classes)

Sensor entity has the addition of `SensorDeviceClass.AREA`.

More details can be found in the Sensor [documentation](/docs/core/entity/sensor#available-device-classes)
