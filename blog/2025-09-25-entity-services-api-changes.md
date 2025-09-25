---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Improved API for registering platform entity services"
---

Platform entity services should be registered by calling the helper [`service.async_register_platform_entity_service`](docs/dev_101_services?_highlight=async_register_platform_entity_service#entity-service-actions) from the integration's `async_setup` instead of calling `platform.async_register_entity_service` during platform set up.

Existing integrations should be migrated to the new API to ensure loading the services does not depend on platform set up.

For examples of migrating, see [core PR 152172](https://github.com/home-assistant/core/pull/152172) and [core PR 152047](https://github.com/home-assistant/core/issues/152047).
