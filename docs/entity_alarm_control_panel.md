---
title: Alarm Control Panel Entity
sidebar_label: Alarm Control Panel
---

> This entry is incomplete. Contribution welcome.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state	| string | **Required** | One of the states listed in the **states** section.
| code_format | string | `None` | One of the states listed in the **code formats** section.
| changed_by | string | `None` | Last change triggered by.


### States

| Value | Description
| ----- | -----------
| `disarmed` | The alarm is disarmed (`off`).
| `armed_home` | The alarm is armed in home mode.
| `armed_away` | The alarm is armed in away mode.
| `armed_night` | The alarm is armed in night mode.
| `armed_custom_bypass` |  The alarm is armed in bypass mode.
| `pending` | The alarm is pending (towards `triggered`).
| `arming` | The alarm is arming.
| `disarming` | The alarm is disarming.
| `triggered` | The alarm is triggered.


### Available code formats

| Value | Description
| ----- | -----------
| None | No code required.
| Number | Code is a number (Shows ten-key pad on frontend).
| Any | Code is a string.


## Methods
Note, the methods also have corresponding `async_` commands (e.g., `acync_alarm_disarm`) and optinal `code` parameter.

### `alarm_disarm`
Send disarm command.

### `alarm_arm_home`
Send arm home command.

### `alarm_arm_away`
Send arm away command.

### `alarm_arm_night`
Send arm night command.

### `alarm_trigger`
Send alarm trigger command.

### `alarm_arm_custom_bypass`
Send arm custom bypass command.
