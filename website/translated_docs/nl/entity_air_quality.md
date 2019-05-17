---
title: Air Quality Entity
sidebar_label: Air Quality
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name                         | Type  | Default      | Description                                   |
| ---------------------------- | ----- | ------------ | --------------------------------------------- |
| particulate_matter_2_5     | float | **Required** | The particulate matter 2.5 (<= 2.5 μm) level. |
| particulate_matter_10      | float | **Required** | The particulate matter 10 (<= 10 μm) level.   |
| particulate_matter_0_1     | float | `None`       | The particulate matter 0.1 (<= 0.1 μm) level. |
| air_quality_index          | float | `None`       | The Air Quality Index (AQI).                  |
| ozone                        | float | `None`       | The O3 (ozone) level.                         |
| carbon_monoxide              | float | `None`       | The CO (carbon monoxide) level.               |
| carbon_dioxide               | float | `None`       | The CO2 (carbon dioxide) level.               |
| sulphur_dioxide              | float | `None`       | The SO2 (sulphur dioxide) level.              |
| nitrogen_oxide               | float | `None`       | The N2O (nitrogen oxide) level.               |
| nitrogen_monoxide            | float | `None`       | The NO (nitrogen monoxide) level.             |
| nitrogen_dioxide             | float | `None`       | The NO2 (nitrogen dioxide) level.             |
| volatile_organic_compounds | float | `None`       | The volatile organic compounds (VOC) level.   |

Properties have to follow the units defined in the `unit_system`.