---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Additional validation in Climate set temperature"
---

As of Home Assistant Core 2024.10, we have added further validation of the parameters passed to the `set_temperature` method. This means that integrations don't need to implement this validation in their own methods.

Before 2024.10 it was possible to set the `temperature` parameter in the action when the entity did not set `ClimateEntityFeature.TARGET_TEMPERATURE` or `target_temp_low`/`target_temp_high` parameters when the entity did not set `ClimateEntityFeature.TARGET_TEMPERATURE_RANGE`. This will no longer be possible and a `ServiceValidationError` will be raised informing the user that they used an incorrect parameter in the action call.

Also, when setting a temperature range, it was possible to set `target_temp_low` to a higher value than `target_temp_high`.
This will raise a `ServiceValidationError` informing the user the high value needs to be higher than the low value.
