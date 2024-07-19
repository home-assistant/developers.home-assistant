---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "New entity feature flags in FanEntity"
---

As of Home Assistant Core 2024.8, we have added two new flags to `FanEntityFeature`: `TURN_ON`, `TURN_OFF`.

Integrations implementing the `turn_on` service call need to set the `TURN_ON` feature flag.
Integrations implementing the `turn_off` service call need to set the `TURN_OFF` feature flag.

There will be a 6-month deprecation period (2025.2) during which `FanEntity` will set these on behalf of the integrations implementing the respective methods. From 2025.2, integrations will be unable to use the respective methods if entity features have not been set accordingly.

Implementing the methods without setting the respective feature flag, will create a warning log entry guiding the user to create an issue for the integration.

Integrations should set the attribute `_enable_turn_on_off_backwards_compatibility` in your `FanEntity` subclass instance to `False` once it has been migrated into using or not using the new feature flags.
This will stop the automatic setting of the new feature flags during the deprecation period, and should be removed once deprecation has ended.
