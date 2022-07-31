---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Saying goodbye to the time_changed event"
---

With Home Assistant Core 0.113, we began transiting to using the asyncio event loop for scheduling events.

With 2022.5, we are excited to announce that this process is now complete. The legacy `time_changed` event, also known as `EVENT_TIME_CHANGED` is no longer fired every second. Integrations that listen for all events no longer need to filter out `EVENT_TIME_CHANGED`. Integrations that run in a separate thread may see slight performance benefits since they will no longer be awakened every second.

With the previous implementation, consumers would subscribe to the `time_changed` event and check the time every time it fired to see if it was a match. This pattern led to many callbacks where most of the time, the callback would reject the event and continue receiving callbacks until the desired time was reached.

If your custom integration is still relying on listening for `time_changed` events, it will need to transition to using one of the built-in event helpers, which are, in most cases, a one-line drop-in replacement. For more information, please review the [integration
documentation on listening for events](https://developers.home-assistant.io/docs/integration_listen_events#tracking-time-changes).



