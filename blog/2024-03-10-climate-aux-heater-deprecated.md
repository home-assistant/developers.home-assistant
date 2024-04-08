---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "Climate entity auxiliary heater is deprecated"
---

As of Home Assistant Core 2024.4 we have deprecated the auxiliary heater functionality in `ClimateEntity`.

Integrations that are currently implementing the `is_aux_heat` property and the `turn_aux_heat_on`/`turn_aux_heat_off` methods need to remove these and alternatively implement other entities to accommodate the necessary functionality such as a `SwitchEntity` or in the case of a read-only property a `BinarySensorEntity`.

You can read more about this decision [here](https://github.com/home-assistant/architecture/discussions/932).