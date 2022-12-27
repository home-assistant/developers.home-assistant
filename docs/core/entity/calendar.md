---
title: Calendar Entity
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
| event | CalendarEvent | `NotImplementedError` | The current or next upcoming `CalendarEvent` or `None`. |
| supported_features | int | int | Flag supported features. |

### States

| Constant    | Description                                 |
| ----------- | ------------------------------------------- |
| `STATE_ON`  | The calendar has an active event.           |
| `STATE_OFF` | The calendar does not have an active event. |

## Supported Features

Supported features are defined by using values in the `CalendarEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value               | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `CREATE_EVENT`      | Entity implements the methods to allow creation of events.  |
| `DELETE_EVENT`      | Entity implements the methods to allow deletion of events.  |
| `UPDATE_EVENT`      | Entity implements the methods to allow update of events.  |


## Methods

### Get Events

A calendar entity can return events that occur during a particular time range. Some notes for implementors:

- The `start_date` is the lower bound and applied to the event's `end` (exclusive).
- The `end_date` is the upper bound and applied to the event's `start` (exclusive).
- Recurring events should be flattened and returned as individual `CalendarEvent`.

```python
class MyCalendar(CalendarEntity):

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime.datetime,
        end_date: datetime.datetime,
    ) -> list[CalendarEvent]:
        """Return calendar events within a datetime range."""
```

### Create Events

A calendar entity may support creating events by specifying the `CREATE_EVENT` supported feature. Integrations that support mutation must handle rfc5545 fields and best practices such as preserving any new unknown fields that are set and recurring events.

```python
class MyCalendar(CalendarEntity):

    async def async_create_event(self, **kwargs: Any) -> None:
        """Add a new event to calendar."""
```

### Delete Events

A calendar entity may support deleting events by specifying the `DELETE_EVENT` supported feature. Integrations that support mutation must support rfc5545 recurring events.

There are three ways that recurring events may be deleted:

- Specifying only the `uid` will delete the entire series
- Specifying the `uid` and `recurrence_id` will delete the specific event instance in the series
- Specifying `uid`, `recurrence_id`, and a `recurrence_range` value may delete a range of events starting at `recurrence_id`. Currently rfc5545 allows the [range](https://www.rfc-editor.org/rfc/rfc5545#section-3.2.13) value of `THISANDFUTURE`.

```python
class MyCalendar(CalendarEntity):

    async def async_delete_event(
        self,
        uid: str,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Delete an event on the calendar."""
```

### Update Events

A calendar entity may support deleting events by specifying the `UPDATE_EVENT` supported feature. Integrations that support mutation must support rfc5545 recurring events.

There are three ways that recurring events may be deleted:
- Specifying only the `uid` will update the entire series
- Specifying the `uid` and `recurrence_id` will update the specific event instance in the series
- Specifying `uid`, `recurrence_id`, and a `recurrence_range` value may update a range of events starting at `recurrence_id`. Currently rfc5545 allows the [range](https://www.rfc-editor.org/rfc/rfc5545#section-3.2.13) value of `THISANDFUTURE`.

```python
class MyCalendar(CalendarEntity):

    async def async_update_event(
        self,
        uid: str,
        event: dict[str, Any],
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Delete an event on the calendar."""
```


## CalendarEvent

A `CalendarEvent` represents an individual event on a calendar.

| Name        | Type             | Default      | Description                                                                                                                                     |
| ----------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| start       | datetime or date | **Required** | The start (inclusive) of the event. Must be before `end`. Both `start` and `end` must be the same type. As a datetime, must be in UTC timezone. |
| end         | datetime or date | **Required** | The end (exclusive) of the event. Must be after `start`. As a datetime, must be in UTC timezone.                                                |
| summary     | string           | **Required** | A title or summary of the event.                                                                                                                |
| location    | string           | `None`       | A geographic location of the event.                                                                                                             |
| description | string           | `None`       | A detailed description of the event.                                                                                                            |
| uid | string | `None` | A unique identifier for the event (required for mutations) |
| recurrence_id | string | `None` | An optional identifier for a specific instance of a recurring event (required for mutations of recurring events) |
| rrule |  string | `None` | A recurrence rule string e.g. `FREQ=DAILY` |
