---
author: Artur Pragacz
authorURL: https://github.com/arturpragacz
title: "The capability_attributes field removed from CalculatedState"
---

The `capability_attributes` field has been removed from `CalculatedState`. Capability attributes are still included in all attributes, which remain available in `CalculatedState`.

`CalculatedState` is the container with state and attributes returned by `Entity._async_calculate_state`.

For details, see [core PR 151672](https://github.com/home-assistant/core/pull/151672).
