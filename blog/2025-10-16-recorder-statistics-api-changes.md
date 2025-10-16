---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the recorder statistics API"
---

The Python and WS API for injecting and modifying statistics has changed.

The following changes have been made to the WS API:
- The WS command `recorder/update_statistics_metadata` accepts a `unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `unit_class` should be set to `null`. Not specifying the `unit_class` is deprecated and will stop working in Home Assistant Core 2026.11.
- The `metadata` object included in the WS command `recorder/import_statistics` accepts a `unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `unit_class` should be set to `null`. Not specifying the `unit_class` is deprecated and will stop working in Home Assistant Core 2026.11.
- The `metadata` object included in the WS command `recorder/import_statistics` accepts a `mean_type` which specifies the type of mean (`0` for no mean, `1` for arithmetic mean or `2` for circular mean). The `mean_type` replaces the bool flag `has_mean`. Not specifying the `mean_type` is deprecated and will stop working in Home Assistant Core 2026.11.
- The items in the response to the WS commands `recorder/list_statistic_ids` and `recorder/get_statistics_metadata` have `mean_type` and `unit_class`.
- The `has_mean` in the items in the response to the WS commands `recorder/list_statistic_ids` and `recorder/get_statistics_metadata` is deprecated and will be removed in Home Assistant Core 2026.11.

The following changes have been made to the Python API:
- The function `async_update_statistics_metadata` accepts a `new_unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `new_unit_class` should be set to `None`. Not specifying the `new_unit_class` is deprecated and will stop working in Home Assistant Core 2025.11.
- The metadata object passed to the functions `async_import_statistics` and `async_add_external_statistics` accepts a `unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `unit_class` should be set to `None`. Not specifying the `unit_class` is deprecated and will stop working in Home Assistant Core 2025.11.
- The metadata object passed to the functions `async_import_statistics` and `async_add_external_statistics` accepts a `mean_type: StatisticMeanType` which specifies the type of mean (`NONE`, `ARITHMETIC` or `CIRCULAR`). The `mean_type` replaces the bool flag `has_mean`. Not specifying the `mean_type` is deprecated and will stop working in Home Assistant Core 2026.11.
- The items in the return value of the function `async_list_statistic_ids` have `mean_type` and `unit_class`.
- The `has_mean` in the items in the return value of the function `async_list_statistic_ids` is deprecated and will be removed in Home Assistant Core 2026.11.
