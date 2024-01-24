---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "New entity features in Climate entity"
---

As of Home Assistant Core 2024.2 we have added two new flags into `ClimateEntityFeature`: `TURN_ON`, `TURN_OFF`.

Integrations implementing `turn_on` service call needs to set the `TURN_ON` feature flag.
Integrations implementing `turn_off` service call needs to set the `TURN_OFF` feature flag.

There will be a 10 month deprecation period (2025.1) where `ClimateEntity` will set these on behalf of the integrations implementing the respective methods and from 2025.1 it will make integrations unable to use the respective methods if entity features has not been set accordingly.

Implementing the methods without setting the respective feature flag will create a warning log entry guiding the user to create an issue for the integration.
