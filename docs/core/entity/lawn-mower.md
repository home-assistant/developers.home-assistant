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
| activity | LawnMowerActivity | **Required** | One of the activities in the LawnMowerActivity enum.
| supported_features | int | (abstract method) | Bitmap of supported features. See below.

## Activities

| Activity | Description
| ----- | -----------
| `MOWING` | The lawn mower is currently mowing.
| `DOCKED` | The lawn mower is done mowing and is currently docked.
| `PAUSED` | The lawn mower was active and is now paused.
| `ERROR` | The lawn mower encountered an error while active and needs assistance.

## Supported Features

Supported features are defined by using values in the `LawnMowerEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

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
