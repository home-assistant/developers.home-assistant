---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
authorTwitter: balloob
title: Entity class names
---

Ever wondered when implementing entities for our entity integrations why you had to extend `BinarySensorDevice` and not `BinarySensorEntity`? Wonder no longer, as we have addressed the situation in Home Assistant 0.110 by renaming all classes that incorrectly had Device in their name. The old classes are still around but will log a warning when used.

All integrations in Home Assistant have been upgraded. Custom component authors need to do the migration themselves. You can do this while keeping backwards compatibility by using the following snippet:

```python
try:
    from homeassistant.components.binary_sensor import BinarySensorEntity
except ImportError:
    from homeassistant.components.binary_sensor import BinarySensorDevice as BinarySensorEntity
```

The following classes have been renamed:

| Old Class Name       | New Class Name       |
| -------------------- | -------------------- |
| `BinarySensorDevice` | `BinarySensorEntity` |
| `MediaPlayerDevice`  | `MediaPlayerEntity`  |
| `LockDevice`         | `LockEntity`         |
| `ClimateDevice`      | `ClimateEntity`      |
| `CoverDevice`        | `CoverEntity`        |
| `VacuumDevice`       | `VacuumEntity`       |
| `RemoteDevice`       | `RemoteEntity`       |
| `Light`              | `LightEntity`        |
| `SwitchDevice`       | `SwitchEntity`       |
| `WaterHeaterDevice`  | `WaterHeaterEntity`  |
