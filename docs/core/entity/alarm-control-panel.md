---
title: Alarm Control Panel Entity
sidebar_label: Alarm Control Panel
---

An alarm control panel entity controls an alarm.  Derive a platform entity from [`homeassistant.components.alarm_control_panel.AlarmControlPanelEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/alarm_control_panel/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state | <code>str &#124; None</code> | **Required** | One of the states listed in the **states**.
| code_arm_required | bool | `True` | Whether the code is required for arm actions.
| code_format | <code>CodeFormat &#124; None</code> | `None` | One of the states listed in the **code formats** section.
| changed_by | <code>str &#124; None</code> | `None` | Last change triggered by.

### States

| Value | Description
| ----- | -----------
| `None` | Unknown state.
| `disarmed` | The alarm is disarmed (`off`).
| `armed_home` | The alarm is armed in home mode.
| `armed_away` | The alarm is armed in away mode.
| `armed_night` | The alarm is armed in night mode.
| `armed_vacation` | The alarm is armed in vacation mode.
| `armed_custom_bypass` |  The alarm is armed in bypass mode.
| `pending` | The alarm is pending (towards `triggered`).
| `arming` | The alarm is arming.
| `disarming` | The alarm is disarming.
| `triggered` | The alarm is triggered.

## Supported Features

Supported features are defined by using values in the `AlarmControlPanelEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Constant | Description |
|----------|--------------------------------------|
| `AlarmControlPanelEntityFeature.ARM_AWAY` | The alarm supports arming in away mode.
| `AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS` | The alarm supports arming with a bypass.
| `AlarmControlPanelEntityFeature.ARM_HOME` | The alarm supports arming in home mode.
| `AlarmControlPanelEntityFeature.ARM_NIGHT` | The alarm supports arming in night mode.
| `AlarmControlPanelEntityFeature.ARM_VACATION` | The alarm supports arming in vacation mode.
| `AlarmControlPanelEntityFeature.TRIGGER` | The alarm can be triggered remotely.

### Code Formats

Supported code formats are defined by using values in the `CodeFormat` enum.

| Value | Description
| ----- | -----------
| `None` | No code required.
| `CodeFormat.NUMBER` | Code is a number (Shows ten-key pad on frontend).
| `CodeFormat.TEXT` | Code is a string.

## Methods

### Alarm Disarm

Send disarm command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_disarm(self, code=None) -> None:
        """Send disarm command."""

    async def async_alarm_disarm(self, code=None) -> None:
        """Send disarm command."""
```

### Alarm Arm Home

Send arm home command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_home(self, code=None) -> None:
        """Send arm home command."""

    async def async_alarm_arm_home(self, code=None) -> None:
        """Send arm home command."""
```

### Alarm Arm Away

Send arm away command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_away(self, code=None) -> None:
        """Send arm away command."""

    async def async_alarm_arm_away(self, code=None) -> None:
        """Send arm away command."""
```

### Alarm Arm Night

Send arm night command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_night(self, code=None) -> None:
        """Send arm night command."""

    async def async_alarm_arm_night(self, code=None) -> None:
        """Send arm night command."""
```

### Alarm Arm Vacation

Send arm vacation command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_vacation(self, code=None) -> None:
        """Send arm vacation command."""

    async def async_alarm_arm_vacation(self, code=None) -> None:
        """Send arm vacation command."""
```

### Alarm Trigger

Send alarm trigger command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_trigger(self, code=None) -> None:
        """Send alarm trigger command."""

    async def async_alarm_trigger(self, code=None) -> None:
        """Send alarm trigger command."""
```

### Alarm Custom Bypass

Send arm custom bypass command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_custom_bypass(self, code=None) -> None:
        """Send arm custom bypass command."""

    async def async_alarm_arm_custom_bypass(self, code=None) -> None:
        """Send arm custom bypass command."""
```
