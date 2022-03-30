---
title: Calendar Entity
sidebar_label: Calendar
---

A calendar entity is an entity that represents a set of events with a start
and end date and/or time, helpful for automations. A calendar entity is derived from the [`homeassistant.components.calendar.CalendarEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/calendar/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name  | Type          | Default               | Description                                             |
| ----- | ------------- | --------------------- | ------------------------------------------------------- |
| event | CalendarEvent | `NotImplementedError` | The current or next upcoming `CalendarEvent` or `None`. |

### States

| Constant    | Description                                 |
| ----------- | ------------------------------------------- |
| `STATE_ON`  | The calendar has an active event.           |
| `STATE_OFF` | The calendar does not have an active event. |

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

## CalendarEvent

A `CalendarEvent` represents an individual event on a calendar.

| Name        | Type             | Default      | Description                                                                                                                                     |
| ----------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| start       | datetime or date | **Required** | The start (inclusive) of the event. Must be before `end`. Both `start` and `end` must be the same type. As a datetime, must be in UTC timezone. |
| end         | datetime or date | **Required** | The end (exclusive) of the event. Must be after `start`. As a datetime, must be in UTC timezone.                                                |
| summary     | string           | **Required** | A title or summary of the event.                                                                                                                |
| location    | string           | `None`       | A geographic location of the event.                                                                                                             |
| description | string           | `None`       | A detailed description of the event.                                                                                                            |
