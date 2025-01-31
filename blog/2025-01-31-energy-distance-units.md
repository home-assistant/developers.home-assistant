---
author: jschlyter
authorURL: https://github.com/jschlyter
title: "Energy by distance units"
---

### Summary of changes

A new `ENERGY_DISTANCE` device class for representing energy consumption by distance, for example the amount of electric energy consumed by an electric car, is now available for number and sensor entities, together with automatic unit conversion based on the unit system. A corresponding `UnitOfEnergyDistance` unit enumerator, and `EnergyDistanceConverter` converter class have been added to support the new device class.

The following units are available:

- kWh/100km
- mi/kWh
- km/kWh

More details can be found in the [Number documentation](/docs/core/entity/number#available-device-classes) and [Sensor documentation](/docs/core/entity/sensor#available-device-classes)


### Inverse Units

Implementing `EnergyDistanceConverter` has also resulted in support for inverse units in `BaseUnitConverter`. This simplifies adding new units tha are inverses of one another, e.g., kWh/100km and km/kWh.
