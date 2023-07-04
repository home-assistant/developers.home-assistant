---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Service call description filters"
---

Service call descriptions have been changed to support filtering.
It's possible to add a filter to a service call to not show entities which do not support the service call, it's also possible to add a filter to a service call field to not show fields which are not supported by a selected entity to the user.

For example:
- The `brightness` service call parameter for `light.turn_on` will only be shown if the light supports brightness.
- The `climate.set_aux_heat` service call will only allow picking a climate entity which supports auxiliary heat.

This features was introduced in core [PR #86162](https://github.com/home-assistant/core/pull/86162) and is documented [here](/docs/dev_101_services#filtering-service-fields).
