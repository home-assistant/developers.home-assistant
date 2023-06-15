---
author: Allen Porter
authorURL: https://github.com/allenporter
title: "Service Call API changes"
---

This change affects Service Call APIs: `hass.services.async_call` and `hass.services.call`.

For Home Assistant Core 2023.7 the return values for service calls have been changed to better
support [Service return values](https://github.com/home-assistant/architecture/discussions/777#discussioncomment-6127898). The behavior has been updated to raise raise an
`asyncio.TimeoutError` on timeout and the return value is no longer a boolean.