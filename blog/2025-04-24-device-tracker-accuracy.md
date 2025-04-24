---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Device tracker TrackerEntity location accuracy attribute type change
---

## Device tracker TrackerEntity location accuracy attribute type change

The type of `location_accuracy` attribute (short hand `_attr_location_accuracy`) of the `TrackerEntity` class of the `device_tracker` entity component has been changed from `int` to `float`.

Type conversions in case the source value is a `float` are no longer needed.

### Example

```python
class ExampleTrackerEntity(TrackerEntity):
    """Test tracker entity."""

    _attr_location_accuracy: float = 2.5

    @cached_property
    def location_accuracy(self) -> float:
        """Return the location accuracy of the device.

        Value in meters.
        """
        return self._attr_location_accuracy
```
