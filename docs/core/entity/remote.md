---
title: Remote Entity
sidebar_label: Remote
---

:::info Incomplete
This entry is incomplete. Contribution welcome.
:::

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| supported_features | int | int | Flag supported features.

## Supported Features

| Constant | Description 
| -------- | -----------
| `SUPPORT_LEARN_COMMAND` | Entity allows learning commands.

## Methods
