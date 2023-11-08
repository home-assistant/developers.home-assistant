---
author: Allen Porter
authorURL: https://github.com/allenporter
title: "Service Call API changes"
---

This change affects Service Call APIs: `hass.services.async_call` and `hass.services.call`.

For Home Assistant Core 2023.7 some input arguments and the return values for service calls have
been changed to prepare to better support [Service return values](https://github.com/home-assistant/architecture/discussions/777#discussioncomment-6127898). 

Previously, the return value of `True` on success and `False` if a timeout occurred. The `limit`
argument that sets a timeout has been removed, and the boolean return value has been removed.
Callers that would like a timeout should now set their own using asyncio.