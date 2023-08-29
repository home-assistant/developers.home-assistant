---
title: Air Quality Entity
sidebar_label: Air Quality
---

## Properties

:::caution Deprecated
The Air Quality entity is deprecated and should not be used. Instead, use
separate sensors for these measurements.

Integrations that still rely on the Air Quality Entity should be migrated.
:::

:::caution
The Air Quality entity does not support attribute shorthand for [property implementation](../entity.md#entity-class-or-instance-attributes)
:::


| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| particulate_matter_2_5 | `str \| int \| float \| None` | **Required** | The particulate matter 2.5 (<= 2.5 μm) level.
| particulate_matter_10 | `str \| int \| float \| None` | `None` | The particulate matter 10 (<= 10 μm) level.
| particulate_matter_0_1 | `str \| int \| float \| None` | `None` | The particulate matter 0.1 (<= 0.1 μm) level.
| air_quality_index | `str \| int \| float \| None` | `None` | The Air Quality Index (AQI).
| ozone | `str \| int \| float \| None` | `None` | The O3 (ozone) level.
| carbon_monoxide | `str \| int \| float \| None` | `None` | The CO (carbon monoxide) level.
| carbon_dioxide | `str \| int \| float \| None` | `None` | The CO2 (carbon dioxide) level.
| sulphur_dioxide | `str \| int \| float \| None` | `None` | The SO2 (sulphur dioxide) level.
| nitrogen_oxide | `str \| int \| float \| None` | `None` | The N2O (nitrogen oxide) level.
| nitrogen_monoxide | `str \| int \| float \| None` | `None` | The NO (nitrogen monoxide) level.
| nitrogen_dioxide | `str \| int \| float \| None` | `None` | The NO2 (nitrogen dioxide) level.

Properties have to follow the units defined in the `unit_system`.
