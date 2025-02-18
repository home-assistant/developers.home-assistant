---
author: Michael
authorURL: https://github.com/mib1185
title: Explicitly pass in the config entry
---

At the moment, we rely on the `ContextVar` to set the related config entry in a coordinator.

For core integrations, it is now required to pass in the config entry explicitly to the [DataUpdateCoordinator](/docs/integration_fetching_data.md#coordinated-single-api-poll-for-data-for-all-entities). For custom integrations it is not enforced, but you're welcome to still adopt this approach.
