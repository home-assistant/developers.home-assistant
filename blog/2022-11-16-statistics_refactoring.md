---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to long term statistics APIs"
---

Some changes have been made to the long-term statistics-related APIs to reduce response size and database load.

The changes are implemented in [this PR](https://github.com/home-assistant/core/pull/82131).

This affects authors of code calling the following WS APIs:
 - `recorder/statistics_during_period`
   - A new optional parameter `types` has been added, which allows providing a list of statistics characteristics to include in the response. Possible values are: `"last_reset"`, `"max"`, `"mean"`, `"min"`, `"state"`, `"sum"`
   - Timestamps `start`, `end` and `last_reset` are now an integer number of ms since the UNIX epoch instead of ISO-formatted strings. The new format means the timestamps can be passed directly to js `Date()` constructor.
   - The `statistic_id` is no longer repeated for each list item in the returned map. This was not used because the return type is a map, keyed by `statistic_id`.

This affects authors of code calling the following Python APIs:
- `homeassistant.recorder.statistics.get_last_short_term_statistics`
  - A new parameter `types` has been added, which allows providing a set of statistics characteristics to include in the response. Possible values are: `"last_reset"`, `"max"`, `"mean"`, `"min"`, `"state"`, `"sum"`
  - Timestamps `start`, `end` and `last_reset` are now an `datetime` objects instead of ISO-formatted strings.
  - The `statistic_id` is no longer repeated for each list item in the returned map. This was not used because the return type is a map, keyed by `statistic_id`.
- `homeassistant.recorder.statistics.get_latest_short_term_statistics`
  - A new parameter `types` has been added, which allows providing a set of statistics characteristics to include in the response. Possible values are: `"last_reset"`, `"max"`, `"mean"`, `"min"`, `"state"`, `"sum"`
  - Timestamps `start`, `end` and `last_reset` are now an `datetime` objects instead of ISO-formatted strings.
  - The `statistic_id` is no longer repeated for each list item in the returned map. This was not used because the return type is a map, keyed by `statistic_id`.
- `homeassistant.recorder.statistics.statistics_during_period`
  - A new parameter `types` has been added, which allows providing a set of statistics characteristics to include in the response. Possible values are: `"last_reset"`, `"max"`, `"mean"`, `"min"`, `"state"`, `"sum"`
  - Timestamps `start`, `end` and `last_reset` are now an `datetime` objects instead of ISO-formatted strings.
  - The `statistic_id` is no longer repeated for each list item in the returned map. This was not used because the return type is a map, keyed by `statistic_id`.
