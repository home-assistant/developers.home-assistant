---
title: Alarm Control Panel Entity
sidebar_label: Alarm Control Panel
id: version-0.72-entity_alarm_control_panel
original_id: entity_alarm_control_panel
---

> This entry is incomplete. Contribution welcome.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| code_format | string | `None` | The format of the panel code.

### Available code formats

| Value | Description
| ----- | -----------
| None | No code required.
| Number | Code is a number (Shows ten-key pad on frontend).
| Any | Code is a string.

## Methods

