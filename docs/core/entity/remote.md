---
title: Remote entity
sidebar_label: Remote
---

The remote entity can represent two different types of devices:

1. A physical device that sends commands.
2. A virtual device in Home Assistant that sends commands to another physical device, eg a television.

Derive entity platforms from [`homeassistant.components.remote.RemoteEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/remote/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| is_on | boolean | `None` | If the device is currently on or off. |
| current_activity | str | None | Return the current active activity |
| activity_list | list | None | Return the list of available activities |

### Activity

An activity is a predefined activity or macro that puts the remote in a specific state. For example, a "Watch TV" activity may turn on multiple devices and change the channel to a specific channel.

## Supported features

Supported features are defined by using values in the `RemoteEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value            | Description                                   |
| ---------------- | --------------------------------------------- |
| `LEARN_COMMAND`  | Entity allows learning commands from devices. |
| `DELETE_COMMAND` | Entity allows deleting commands from devices. |
| `ACTIVITY`       | Entity supports activities.                   |

## Methods

### Turn on command

```python
class MyRemote(RemoteEntity):

    def turn_on(self, activity: str = None, **kwargs):
         """Send the power on command."""

    async def async_turn_on(self, activity: str = None, **kwargs):
         """Send the power on command."""
```

### Turn off command

```python
class MyRemote(RemoteEntity):

    def turn_off(self, activity: str = None, **kwargs):
         """Send the power off command."""

    async def async_turn_off(self, activity: str = None, **kwargs):
         """Send the power off command."""
```

### Toggle command

```python
class MyRemote(RemoteEntity):

    def toggle(self, activity: str = None, **kwargs):
         """Toggle a device."""

    async def async_toggle(self, activity: str = None, **kwargs):
         """Toggle a device."""
```

### Send command

```python
class MyRemote(RemoteEntity):

    def send_command(self, command: Iterable[str], **kwargs):
        """Send commands to a device."""

    async def async_send_command(self, command: Iterable[str], **kwargs):
        """Send commands to a device."""
```

### Learn command

Only implement this method if the flag `SUPPORT_LEARN_COMMAND` is set.

```python
class MyRemote(RemoteEntity):

    def learn_command(self, **kwargs):
        """Learn a command from a device."""

    async def async_learn_command(self, **kwargs):
        """Learn a command from a device."""
```

### Delete command

Only implement this method if the flag `SUPPORT_DELETE_COMMAND` is set.

```python
class MyRemote(RemoteEntity):

    def delete_command(self, **kwargs):
        """Delete a command from a device."""

    async def async_delete_command(self, **kwargs):
        """Delete a command from a device."""
```
