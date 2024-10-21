---
title: Alarm control panel entity
sidebar_label: Alarm control panel
---

An alarm control panel entity controls an alarm.  Derive a platform entity from [`homeassistant.components.alarm_control_panel.AlarmControlPanelEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/alarm_control_panel/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| alarm_state | <code>AlarmControlPanelEntityState &#124; None</code> | **Required** | One of the alarm values listed in the **states**.
| code_arm_required | bool | `True` | Whether the code is required for arm actions.
| code_format | <code>CodeFormat &#124; None</code> | `None` | One of the states listed in the **code formats** section.
| changed_by | <code>str &#124; None</code> | `None` | Last change triggered by.

### States

Setting the state should return an enum from AlarmControlPanelEntityState in the `alarm_state` property.

| Value | Description
| ----- | -----------
| `DISARMED` | The alarm is disarmed (`off`).
| `ARMED_HOME` | The alarm is armed in home mode.
| `ARMED_AWAY` | The alarm is armed in away mode.
| `ARMED_NIGHT` | The alarm is armed in night mode.
| `ARMED_VACATION` | The alarm is armed in vacation mode.
| `ARMED_CUSTOM_BYPASS` |  The alarm is armed in bypass mode.
| `PENDING` | The alarm is pending (towards `triggered`).
| `ARMING` | The alarm is arming.
| `DISARMING` | The alarm is disarming.
| `TRIGGERED` | The alarm is triggered.

## Supported features

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

### Code formats

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

### Alarm arm home

Send arm home command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_home(self, code=None) -> None:
        """Send arm home command."""

    async def async_alarm_arm_home(self, code=None) -> None:
        """Send arm home command."""
```

### Alarm arm away

Send arm away command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_away(self, code=None) -> None:
        """Send arm away command."""

    async def async_alarm_arm_away(self, code=None) -> None:
        """Send arm away command."""
```

### Alarm arm night

Send arm night command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_night(self, code=None) -> None:
        """Send arm night command."""

    async def async_alarm_arm_night(self, code=None) -> None:
        """Send arm night command."""
```

### Alarm arm vacation

Send arm vacation command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_vacation(self, code=None) -> None:
        """Send arm vacation command."""

    async def async_alarm_arm_vacation(self, code=None) -> None:
        """Send arm vacation command."""
```

### Alarm trigger

Send alarm trigger command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_trigger(self, code=None) -> None:
        """Send alarm trigger command."""

    async def async_alarm_trigger(self, code=None) -> None:
        """Send alarm trigger command."""
```

### Alarm custom bypass

Send arm custom bypass command.

```python
class MyAlarm(AlarmControlPanelEntity):
    # Implement one of these methods.

    def alarm_arm_custom_bypass(self, code=None) -> None:
        """Send arm custom bypass command."""

    async def async_alarm_arm_custom_bypass(self, code=None) -> None:
        """Send arm custom bypass command."""
```
