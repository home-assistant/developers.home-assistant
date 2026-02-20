---
title: Vacuum entity
sidebar_label: Vacuum
---

Derive entity platforms from [`homeassistant.components.vacuum.StateVacuumEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/vacuum/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| fan_speed | string | `none` | The current fan speed.
| fan_speed_list | list | `NotImplementedError()`| List of available fan speeds.
| name | string | **Required** | Name of the entity.
| activity | VacuumActivity | **Required** | Return one of the states listed in the states section.

## States

Setting the state should return an enum from VacuumActivity in the `activity` property.

| Value | Description
| ----- | -----------
| `CLEANING` | The vacuum is currently cleaning.
| `DOCKED` | The vacuum is currently docked, it is assumed that docked can also mean charging.
| `IDLE` | The vacuum is not paused, not docked and does not have any errors.
| `PAUSED` | The vacuum was cleaning but was paused without returning to the dock.
| `RETURNING` | The vacuum is done cleaning and is currently returning to the dock, but not yet docked.
| `ERROR` | The vacuum encountered an error while cleaning.

## Supported features

Supported features are defined by using values in the `VacuumEntityFeature` enum
and are combined using the bitwise or (`|`) operator.
Note that all vacuum entity platforms derived from `homeassistant.components.vacuum.StateVacuumEntity`
must set the `VacuumEntityFeature.STATE` flag.

| Value          | Description                                          |
| -------------- | ---------------------------------------------------- |
| `CLEAN_AREA`   | The vacuum supports cleaning specific areas.         |
| `CLEAN_SPOT`   | The vacuum supports spot cleaning.                   |
| `FAN_SPEED`    | The vacuum supports setting fan speed.               |
| `LOCATE`       | The vacuum supports locating.                        |
| `MAP`          | The vacuum supports retrieving its map.              |
| `PAUSE`        | The vacuum supports the pause command.               |
| `RETURN_HOME`  | The vacuum supports the return to the dock command.  |
| `SEND_COMMAND` | The vacuum supports sending a command to the vacuum. |
| `START`        | The vacuum supports the start command.               |
| `STATE`        | The vacuum supports returning its state.             |
| `STOP`         | The vacuum supports the stop command.                |

## Methods

### `async_get_segments`

Return a list of `Segment` objects representing the cleanable segments reported by the vacuum. Integration platforms are required to implement this method when supporting `CLEAN_AREA`. It is called when configuring the area mapping, so it should return fully up-to-date information.

```python
async def async_get_segments(self) -> list[Segment]:
    """Get the segments that can be cleaned."""
```

The `Segment` dataclass is defined as:

```python
@dataclass(slots=True)
class Segment:
    """Represents a cleanable segment reported by a vacuum."""

    id: str
    name: str
    group: str | None = None
```

The `id` must be globally unique across all segments for a given vacuum entity, regardless of group. The `group` field is used only for grouping segments in the mapping UI.

### `clean_segments` or `async_clean_segments`

Clean the specified segments by their IDs. Integration platforms are required to implement this method when supporting `CLEAN_AREA`. It is called internally by the `clean_area` service after resolving targeted areas to segments using the area mapping.

```python
async def async_clean_segments(self, segment_ids: list[str], **kwargs: Any) -> None:
    """Perform an area clean."""
```

### `last_seen_segments`

A property that returns the segments reported by the vacuum that were available when last configuring the area mapping. Returns `None` if no mapping has been saved yet.

```python
@property
def last_seen_segments(self) -> list[Segment] | None:
    """Return segments as seen by the user, when last mapping the areas."""
```

### `async_create_segments_issue`

A helper method that creates a repair issue when the vacuum reports different segments than what was available when last configuring the area mapping. Integrations should call this when segment changes require the area mapping to be adjusted.

```python
@callback
def async_create_segments_issue(self) -> None:
    """Create a repair issue when vacuum segments have changed."""
```

### `clean_spot` or `async_clean_spot`

Perform a spot clean-up.

### `locate` or `async_locate`

Locate the vacuum cleaner.

### `pause` or `async_pause`

Pause the cleaning task.

### `return_to_base` or `async_return_to_base`

Set the vacuum cleaner to return to the dock.

### `send_command` or `async_send_command`

Send a command to a vacuum cleaner.

### `set_fan_speed` or `async_set_fan_speed`

Set the fan speed.

### `start` or `async_start`

Start or resume the cleaning task.

### `stop` or `async_stop`

Stop the vacuum cleaner, do not return to base.
