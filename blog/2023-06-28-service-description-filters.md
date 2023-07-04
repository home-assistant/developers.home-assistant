---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Service call description filters"
---

Service call descriptions now support filtering, to avoid showing entieis not supported by a service calls and service call parameters that are not supported by an entity to the user. For example:
- The `brightness` service call parameter for `light.turn_on` will only be shown if the light supports brightness.
- The `climate.set_aux_heat` service call will only allow picking a climate entity which supports auxiliary heat.

This features was introduced in core [PR #86162](https://github.com/home-assistant/core/pull/86162) and is documented [here](/docs/dev_101_services#filtering-service-fields).
