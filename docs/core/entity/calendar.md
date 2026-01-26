---
title: Calendar entity
sidebar_label: Calendar
---

A calendar entity is an entity that represents a set of events with a start
and end date and/or time, helpful for automations. A calendar entity is derived from the [`homeassistant.components.calendar.CalendarEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/calendar/__init__.py).

Calendar integrations should be compatible with rfc5545 and may optionally support event creation following patterns established in rfc5546. Integrations that support recurring events are responsible for handling expansion of recurring events, such as in a service or API that returns the expanded set of events in the series as separate individual events.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name  | Type          | Default               | Description                                             |
| ----- | ------------- | --------------------- | ------------------------------------------------------- |
| event | <code>CalendarEvent &#124; None</code> | **Required** | The current or next upcoming `CalendarEvent` or `None`. |

### States

A `CalendarEntity` state is similar to a binary sensor, reflecting whether or not there
is an active event:

| Constant    | Description                                 |
| ----------- | ------------------------------------------- |
| `STATE_ON`  | The calendar has an active event.           |
| `STATE_OFF` | The calendar does not have an active event. |


A calendar entity has an `event` property that returns either the current
or next upcoming `CalendarEvent` which is used to determine the state. A calendar
entity implementation is responsible for determining the next upcoming event,
including correctly ordering events and interpreting all day events in the Home 
Assistant timezone. An entity should call `homeassistant.util.dt.now` to get the
current time which has a `tzinfo` value set to the HomeAssistant timezone or examine
`homeassistant.components.util.dt.DEFAULT_TIMEZONE`

## Supported features

Supported features are defined by using values in the `CalendarEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value               | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `CREATE_EVENT`      | Entity implements the methods to allow creation of events.  |
| `DELETE_EVENT`      | Entity implements the methods to allow deletion of events.  |
| `UPDATE_EVENT`      | Entity implements the methods to allow update of events.  |

## Methods

### Get events

A calendar entity can return events that occur during a particular time range. Some notes for implementers:

- The `start_date` is the lower bound and applied to the event's `end` (exclusive). This has a `tzinfo` of the local Home Assistant timezone.
- The `end_date` is the upper bound and applied to the event's `start` (exclusive). This has the same `tzinfo` as `start_date`.
- Recurring events should be flattened and returned as individual `CalendarEvent`.

A calendar entity is responsible for returning the events in order including correctly
ordering all day events. An all day event should be ordered to start at midnight in
the Home Assistant timezone (e.g. from the start/end time argument `tzinfo`, 
or using `homeassistant.util.dt.start_of_local_day`). Note that all day events should still
set a `datetime.date` in the `CalendarEvent` and not a date with a time.

```python
import datetime
from homeassistant.core import HomeAssistant
from homeassistant.components.calendar import CalendarEntity

class MyCalendar(CalendarEntity):

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime.datetime,
        end_date: datetime.datetime,
    ) -> list[CalendarEvent]:
        """Return calendar events within a datetime range."""
```

### Create events

A calendar entity may support creating events by specifying the `CREATE_EVENT` supported feature. Integrations that support mutation must handle rfc5545 fields and best practices such as preserving any new unknown fields that are set and recurring events.

```python
from homeassistant.components.calendar import CalendarEntity

class MyCalendar(CalendarEntity):

    async def async_create_event(self, **kwargs: Any) -> None:
        """Add a new event to calendar."""
```

### Delete events

A calendar entity may support deleting events by specifying the `DELETE_EVENT` supported feature. Integrations that support mutation must support rfc5545 recurring events.

There are three ways that recurring events may be deleted:

- Specifying only the `uid` will delete the entire series
- Specifying the `uid` and `recurrence_id` will delete the specific event instance in the series
- Specifying `uid`, `recurrence_id`, and a `recurrence_range` value may delete a range of events starting at `recurrence_id`. Currently rfc5545 allows the [range](https://www.rfc-editor.org/rfc/rfc5545#section-3.2.13) value of `THISANDFUTURE`.

```python
from homeassistant.components.calendar import CalendarEntity


class MyCalendar(CalendarEntity):

    async def async_delete_event(
        self,
        uid: str,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Delete an event on the calendar."""
```

### Update events

A calendar entity may support updating events by specifying the `UPDATE_EVENT` supported feature. Integrations that support mutation must support rfc5545 recurring events.

There are three ways that recurring events may be updated:
- Specifying only the `uid` will update the entire series
- Specifying the `uid` and `recurrence_id` will update the specific event instance in the series
- Specifying `uid`, `recurrence_id`, and a `recurrence_range` value may update a range of events starting at `recurrence_id`. Currently rfc5545 allows the [range](https://www.rfc-editor.org/rfc/rfc5545#section-3.2.13) value of `THISANDFUTURE`.

```python
from homeassistant.components.calendar import CalendarEntity


class MyCalendar(CalendarEntity):

    async def async_update_event(
        self,
        uid: str,
        event: dict[str, Any],
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Update an event on the calendar."""
```


## CalendarEvent

A `CalendarEvent` represents an individual event on a calendar.

| Name        | Type             | Default      | Description                                                                                                                                     |
| ----------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| start       | datetime or date | **Required** | The start (inclusive) of the event. Must be before `end`. Both `start` and `end` must be the same type. As a datetime, must have a timezone.    |
| end         | datetime or date | **Required** | The end (exclusive) of the event. Must be after `start`. As a datetime, must have a timezone that is the same as start.                         |
| summary     | string           | **Required** | A title or summary of the event.                                                                                                                |
| location    | string           | `None`       | A geographic location of the event.                                                                                                             |
| description | string           | `None`       | A detailed description of the event.                                                                                                            |
| uid | string | `None` | A unique identifier for the event (required for mutations) |
| recurrence_id | string | `None` | An optional identifier for a specific instance of a recurring event (required for mutations of recurring events) |
| rrule |  string | `None` | A recurrence rule string e.g. `FREQ=DAILY` |
## Color management

Calendar entities can have associated colors that are used in the frontend (calendar panel, calendar card). The color is stored as an entity option in the entity registry, allowing users to customize the calendar color through the UI.

### How colors work

The color management lifecycle works as follows:

1. **Initial color**: Integrations can provide a default color by setting `_attr_initial_color` to a hex color string (e.g., `#16a765`).
2. **Storage**: When the entity is first added to Home Assistant, the initial color is automatically stored in the entity registry as an entity option.
3. **Reading**: The frontend reads the color directly from entity registry options when displaying the calendar.
4. **User modification**: Users can change the color through the entity settings in the UI, which updates the entity registry options.

### Providing a default color

If a calendar integration wants to provide a default color (for example, a color retrieved from the calendar service API), it should set the `_attr_initial_color` attribute to a hex color string. This value will be used as the initial color and stored in entity registry options when the entity is first added:

```python
from homeassistant.components.calendar import CalendarEntity


class MyCalendar(CalendarEntity):

    def __init__(self, name: str, calendar_color: str | None = None) -> None:
        """Initialize the calendar entity."""
        self._attr_name = name
        self._attr_initial_color = calendar_color  # Hex color from calendar service API, e.g., "#16a765"
```

Example with color retrieved from a calendar service:

```python
from homeassistant.components.calendar import CalendarEntity


class MyCalendar(CalendarEntity):

    def __init__(self, name: str, calendar_data: dict) -> None:
        """Initialize the calendar entity."""
        self._attr_name = name
        
        # Set color from calendar service API if available
        # The color should be in hex format with # prefix, e.g., "#16a765"
        if "backgroundColor" in calendar_data:
            self._attr_initial_color = calendar_data["backgroundColor"]
```

### Important notes

- The `_attr_initial_color` must be a **hex color string** with the `#` prefix (e.g., `"#16a765"`), not an RGB tuple.
- The color is automatically validated and stored in entity registry options when the entity is first registered through the `get_initial_entity_options()` method (handled by the `CalendarEntity` base class).
- The initial color is **only set once** when the entity is first added to Home Assistant. After that, the value is read from entity registry options.
- Users can override the initial color at any time through the entity settings UI, and their preference will be stored in the entity registry.
- The color is **only used by the frontend** for display purposes. The calendar entity does not need to read or access the color value after setting `_attr_initial_color`.
- Integrations only need to set `_attr_initial_color` in the entity's `__init__()` method if they want to provide a default color from the calendar service.