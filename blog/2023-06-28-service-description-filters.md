---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Service call description filters"
---

Service call fields now support filtering, to avoid showing service call parameters that are not supported by an entity to the user. For example, the `brightness` service call parameter for `light.turn_on` will only be shown if the light supports brightness.

This is an extension of the previously supported possibility to filter out entities that don't support a certain service call.

This features was introduced in core [PR #86162](https://github.com/home-assistant/core/pull/86162) and is documented [here](/docs/dev_101_services#filtering-service-fields).
