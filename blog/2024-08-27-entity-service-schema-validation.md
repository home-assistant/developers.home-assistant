---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Validation of entity action schemas"
---

Registering entity service actions allows integration authors to pass in:
- No schema (`None`)
- A dictionary, which will be converted to a voluptuous schema by passing it to `cv.make_entity_service_schema`
- A custom voluptuous schema

For the third case, a warning will now be logged when registering an entity action with a custom schema which does not meet at least one of these criteria:
- A validator returned by `cv.make_entity_service_schema`
- A validator returned by `cv.make_entity_service_schema`, wrapped in a `vol.Schema`
- A validator returned by `cv.make_entity_service_schema`, wrapped in a `vol.All`

In Home Assistant Core 2025.10, it will no longer be possible to register an entity action with a custom schema not meeting this requirement.

The reason for the change is that if `cv.make_entity_service_schema` is not used, the service will not automatically support all possible ways of targeting entities.

More details can be found in the [developer documentation](/docs/dev_101_services/#entity-service-actions) and in core PRs [#124102](https://github.com/home-assistant/core/pull/124102) and [#125057](https://github.com/home-assistant/core/pull/125057).
