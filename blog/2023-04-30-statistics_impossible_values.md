---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Statistics WebSocket API changes"
---

This change affects WebSocket APIs: `recorder/statistic_during_period` and `recorder/statistics_during_period`. The Home Assistant project does not currently document these APIs, as they may change.

For Home Assistant Core 2023.6 the statistics WebSocket API will no longer return columns that it knows will be empty. Callers should treat the lack of values the same as null values.

To reduce database overhead, if the statistics backend knows in advance that all rows for a column will be empty values, the column will no longer be returned.