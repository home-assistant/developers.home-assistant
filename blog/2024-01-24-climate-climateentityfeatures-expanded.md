---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "New entity features in Climate entity"
---

As of Home Assistant Core 2024.2 we have added two new enums into `ClimateEntityFeature`: `TURN_ON`, `TURN_OFF`.

Integrations implementing `turn_on` service call needs to set the `TURN_ON` feature enum.
Integrations implementing `turn_off` service call needs to set the `TURN_OFF` feature enum.

There will be a 6 month deprecation period where `ClimateEntity` will set these on behalf of the integrations implementing the respective service call and from 2024.8 it will make integrations unable to use the respective service call if not entity features has been set accordingly

Implementing the service calls without setting the respective `ClimateEntityFeature` will create a warning log entry guiding the user to create an issue for the integration.
