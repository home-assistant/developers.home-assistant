---
author: Allen Porter
authorURL: https://github.com/allenporter
title: "UpdatedCalendar best practices"
---

Home Assistant has improved best practices for Calendar events. In particular, there are more detailed expectations and enforcement of invariants to ensure that the UI and calendar triggers and other automations work correctly in all cases.

Notable best practices and invariants include:
- The `CalendarEvent` invariants are now enforced.
- A `CalendarEvent` property `end` is exclusive. e.g. An all day event that lasts one day should have an end date with 1 day after the start date.
- A `CalendarEvent` can accept a `datetime` in any timezone.  Floating dates without a timezone are not allowed.
- Events returned by `async_get_events` are expected to be returned in order.
- All Day events returned by `async_get_events` should be evaluated in the Home Assistant local timezone. That is, an all day event should be ordered as if it starts at midnight in the local time.

Review the updated [Calendar Entity developer documentation](docs/core/entity/calendar) for additional detail.