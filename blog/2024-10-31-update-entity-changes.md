---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the update entity"
---

### Summary of changes

The `update` entity has been adjusted:
- The `in_progress` property and the corresponding state attribute should now only be a `bool` indicating if an update is in progress, or `None` if unknown.
- A new property and a corresponding state attribute `update_percentage` has been added which can either return an `int` or `float` indicating the progress from 0 to 100% or None.
- A new property and a corresponding state attribute `display_precision` to control the number of decimals to display in frontend when `update_percentage` is a `float`.

### Backwards compatibility

Until Home Assistant Core 2025.12, a numerical value in the `in_progress` property will be automatically copied to the `update_percentage` state attribute.

See the [update entity developer documentation](https://developers.home-assistant.io/docs/core/entity/update) for details.
