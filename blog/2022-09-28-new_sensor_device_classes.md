---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "New sensor device classes"
---

Several new sensor device classes have been added:
 - `distance`, a distance measured in either of `cm`, `ft`, `in`, `km`, `m`, `mi`, `mm`, `yd`
 - `speed`, a speed measured in either of `ft/s`, `in/d`, `in/h`, `km/h`, `kn`, `m/s`, `mm/d`, `mph`
 - `volume`, a volume measured in either of `fl. oz.`, `ft³`, `gal`, `L`, `mL`, `m³`
 - `weight`, a mass measured in either of `g`, `kg`, `lb`, `mg`, `oz`, `µg`

 Like `pressure` and `temperatures` sensors, users can freely choose the display unit from the UI for sensors using any of the new device classes.

### Long term statistics

 Long term statistics will store `distance` as `m`, `speed` as `m/s`, `volume` as `m³` and `weight` as `g`.
 For existing sensors which are modified to one of the new device classes, statistics will continue to be recorded in the sensor's `state_unit` but users will be given the option to have existing statistics converted to the normalized unit.
