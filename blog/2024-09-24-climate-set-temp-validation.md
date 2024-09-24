---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Additional validation in Climate set temperature"
---

As of Home Assistant Core 2024.10, we have implemented further validation into the `set_temperature` method. This means that the integrations does not need to implement this validation in their own methods.

Currently it was possible to use the `temperature` attribute when the entity did not set `ClimateEntityFeature.TARGET_TEMPERATURE` or `target_temp_low`/`target_temp_high` when the entity did not set `ClimateEntityFeature.TARGET_TEMPERATURE_RANGE`. This has been deprecated and will raise an error starting from 2025.4.

Also, when setting a temperature range, it was possible to set `target_temp_low` to a higher value than `target_temp_high`.
This will now directly raise an error informing the user the high value needs to be higher than the low value.
