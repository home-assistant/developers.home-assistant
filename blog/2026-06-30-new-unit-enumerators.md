---
author: epenet
authorURL: https://github.com/epenet
title: "Introducing new unit enumerators"
---

As of Home Assistant Core 2026.7, the following unit constants are deprecated and replaced 
by a corresponding enum:

  - `UnitOfDensity` enumerator replaces mass over volume `CONCENTRATION_***` constants
    (`"g/m³"`, `"mg/m³"`, `"μg/m³"`, `"μg/ft³"`)
  - `UnitOfRatio` enumerator replaces unit-less ratio `CONCENTRATION_***` constants
    (`"ppm"`, `"ppb"`)

`CONCENTRATION_PARTS_PER_CUBIC_METER` was only used by a single integration and is deprecated
without a replacement unit.

Please note that the use of `PERCENTAGE` constant is also deprecated when used as a unit of 
measurement, even if the constant itself is not deprecated.
