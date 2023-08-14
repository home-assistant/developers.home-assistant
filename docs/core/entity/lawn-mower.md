---
title: Lawn Mower Entity
sidebar_label: Lawn Mower
---

Derive entity platforms from [`homeassistant.components.lawn_mower.LawnMowerEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/lawn_mower/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::


| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| name | string | **Required** | Name of the entity.
| state | string | **Required** | One of the states listed in the states section.
| supported_features | int | (abstract method) | Bitmap of supported features. See below.

## States

| State | Description
| ----- | -----------
| `MOWING` | The lawn mower is currently mowing.
| `DOCKING` | The lawn mower is done mowing and is currently returning to the dock.
| `PAUSED` | The lawn mower was mowing but was paused without returning to the dock.
| `ERROR` | The lawn mower encountered an error while mowing and needs assistance.

## Supported Features

Supported features are defined by using values in the `LawnMowerEntityFeature` enum
and are combined using the bitwise or (`|`) operator.
Note that all lawn mower entity platforms derived from `homeassistant.components.lawn_mower.LawnMowerEntity`
must set the `LawnMowerEntityFeature.STATE` flag.

| Value          | Description                                          |
| -------------- | ---------------------------------------------------- |
| `START_MOWING`      | The lawn mower supports the mowing command.       |
| `PAUSE`   | The lawn mower supports pausing the current task.                   |
| `DOCK`    | The lawn mower supports the return to dock command.

## Methods

### `start_mowing` or `async_start_mowing`

Start or resume the mowing task.

### `dock` or `async_dock`

Stop the lawn mower, return to dock.

### `pause` or `async_pause`

Pause the lawn mower during current operation.
