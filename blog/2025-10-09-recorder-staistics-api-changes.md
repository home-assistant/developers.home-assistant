---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the recorder statistics API"
---

The Python and WS API for injecting and modifying statists has changed.

The following changes have been made to the WS API:
- The WS command `recorder/update_statistics_metadata` accepts a `unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `unit_class` should be set to `null`. Not specifying the `unit_class` is deprecated and will stop working in Home Assistant Core 2026.11.
- The metadata passed to the WS command `recorder/import_statistics` accepts a `unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `unit_class` should be set to `null`. Not specifying the `unit_class` is deprecated and will stop working in Home Assistant Core 2026.11.
- The metadata passed to the WS command `recorder/import_statistics` accepts a `mean_type` which specifies the type of mean (`none`, `arithmetic` or `circular`). The `mean_type` replaces the bool flag `has_mean`. Not specifying the `mean_type` is deprecated and will stop working in Home Assistant Core 2026.11.
- The items in the response to the WS commands `recorder/list_statistic_ids` and `recorder/get_statistics_metadata` have `mean_type` and `unit_class`.
- The `mean_type` in the items in the response to the WS commands `recorder/list_statistic_ids` and `recorder/get_statistics_metadata` is deprecated and will be removed in Home Assistant core 2026.11.

The following changes have been made to the Python API:
- The functions `async_update_statistics_metadata` accepts a `new_unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `new_unit_class` should be set to `null`. Not specifying the `new_unit_class` is deprecated and will stop working in Home Assistant Core 2025.11.
- The metadata object passed to the functions `async_import_statistics` and `async_add_external_statistics` accept a `unit_class` which points to the unit converter to be used for unit conversions. If there is no compatible unit converter, `unit_class` should be set to `null`. Not specifying the `unit_class` is deprecated and will stop working in Home Assistant Core 2025.11.
- The metadata object passed to the functions `async_import_statistics` and `async_add_external_statistics` accept a `mean_type: StatisticMeanType` which specifies the type of mean (`NONE`, `ARITHEMTIC` or `CIRCULAR`). The `mean_type` replaces the bool flag `has_mean`. Not specifying the `mean_type` is deprecated and will stop working in Home Assistant Core 2026.11.
- The items in the return value of the function `async_list_statistic_ids` have `mean_type` and `unit_class`.


Platform entity services should be registered by calling the helper [`service.async_register_platform_entity_service`](/docs/dev_101_services?_highlight=async_register_platform_entity_service#entity-service-actions) from the integration's `async_setup` instead of calling `platform.async_register_entity_service` during platform set up.

Existing integrations should be migrated to the new API to ensure loading the services does not depend on platform setup.

For examples of migrating, see [core PR 152172](https://github.com/home-assistant/core/pull/152172) and [core PR 152047](https://github.com/home-assistant/core/pull/152047).
