---
title: Alarm Control Panel Entity
sidebar_label: Alarm Control Panel
---

> This entry is incomplete. Contribution welcome.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state	| string | **Required** | One of the states listed in the states section.
| code_format | string | `None` | Regex for code format or `None` if no code is required.
| changed_by | string | `None` | Last change triggered by.


## States
| State | Description
| ----- | -----------
| `SERVICE_ALARM_TRIGGER` | The alarm is triggered.
| `SERVICE_ALARM_DISARM` | The alarm is disarmed (`off`).
| `SERVICE_ALARM_ARM_HOME` | The alarm is armed in home mode.
| `SERVICE_ALARM_ARM_AWAY` | The alarm is armed in away mode.
| `SERVICE_ALARM_ARM_NIGHT` | The alarm is armed in night mode.
| `SERVICE_ALARM_ARM_CUSTOM_BYPASS` |  The alarm is armed in bypass mode.


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
