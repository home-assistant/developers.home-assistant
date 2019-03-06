---
title: Alarm Control Panel Entity
sidebar_label: Alarm Control Panel
id: version-0.89.0-entity_alarm_control_panel
original_id: entity_alarm_control_panel
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


### Code Formats

| Value | Description
| ----- | -----------
| None | No code required.
| Number | Code is a number (Shows ten-key pad on frontend).
| Any | Code is a string.


## Methods

### Alarm Disarm
Send disarm command.

```python
class MyAlarm(AlarmControlPanel):
    # Implement one of these methods.

    def alarm_disarm(self, code=None) -> None:
        """Send disarm command."""

    async def async_alarm_disarm(self, code=None) -> None:
        """Send disarm command."""
```

### Alarm Arm Home
Send arm home command.

```python
class MyAlarm(AlarmControlPanel):
    # Implement one of these methods.

    def alarm_arm_home(self, code=None) -> None:
        """Send arm home command."""

    def async_alarm_arm_home(self, code=None) -> None:
        """Send arm home command."""
```

### Alarm Arm Away
Send arm away command.

```python
class MyAlarm(AlarmControlPanel):
    # Implement one of these methods.

    def alarm_arm_away(self, code=None) -> None:
        """Send arm away command."""

    def async_alarm_arm_away(self, code=None) -> None:
        """Send arm away command."""
```

### Alarm Arm Night
Send arm night command.

```python
class MyAlarm(AlarmControlPanel):
    # Implement one of these methods.

    def alarm_arm_night(self, code=None) -> None:
        """Send arm night command."""

    def async_alarm_arm_night(self, code=None) -> None:
        """Send arm night command."""
```

### Alarm Trigger
Send alarm trigger command.

```python
class MyAlarm(AlarmControlPanel):
    # Implement one of these methods.

    def alarm_trigger(self, code=None) -> None:
        """Send alarm trigger command."""

    def async_alarm_trigger(self, code=None) -> None:
        """Send alarm trigger command."""
```

### Alarm Custom Bypass
Send arm custom bypass command.

```python
class MyAlarm(AlarmControlPanel):
    # Implement one of these methods.

    def alarm_arm_custom_bypass(self, code=None) -> None:
        """Send arm custom bypass command."""

    def async_alarm_arm_custom_bypass(self, code=None) -> None:
        """Send arm custom bypass command."""
```
