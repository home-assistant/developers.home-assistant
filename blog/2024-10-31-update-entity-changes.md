---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the update entity"
---

### Summary of changes

The `update` entity has been adjusted:
- The `in_progress` property and the corresponding state attribute should now only be a `bool` indicating if an update is in progress, or `None` if unknown.
- A new property and a corresponding state attribute `update_percentage` has been added which can either return an `int` or `float` indicating the progress from 0 to 100% or None.
- A new property and a corresponding state attribute `display_precision` has been added to control the number of decimals to display in the frontend when `update_percentage` is a `float`.

### Backwards compatibility

Until Home Assistant Core 2025.12, a numerical value in the `in_progress` property will be automatically copied to the `update_percentage` state attribute.

### Documentation and core implementation

See the [update entity developer documentation](https://developers.home-assistant.io/docs/core/entity/update) for details.

PRs:
- PR adding the [`update_percentage` state attribute](https://github.com/home-assistant/core/pull/128877)
- PR adding the [`update_percentage` property](https://github.com/home-assistant/core/pull/128908)
- PR adding the [`display_precision` state attribute and property](https://github.com/home-assistant/core/pull/128930)
- An example of [updating an integration's update entity](https://github.com/home-assistant/core/pull/129380)
