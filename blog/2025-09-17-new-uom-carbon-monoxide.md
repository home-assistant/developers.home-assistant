---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Device class Carbon Monoxide now supports mg/m³
---

## Device class Carbon Monoxide now supports mg/m³

The concentration of Carbon Monoxide is often expressed in PPM (parts per million).

Directive 2008/50/EC of the European Parliament and of the Council of 21 May 2008 requires carbon monoxide pollution to be measured in mg/m³.

With [#152456](https://github.com/home-assistant/core/pull/152456), this new unit or measurement including unit conversion is now supported for both `sensor` and `number` entity platforms with the `carbon_monoxide` device class.
