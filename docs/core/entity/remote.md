---
title: Remote Entity
sidebar_label: Remote
---

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_activity | str | None | Return the current active activity |
| activity_list | list | None | Return the list of available activites |

## Supported Features

| Constant | Description
| -------- | -----------
| `SUPPORT_LEARN_COMMAND`  | Entity allows learning commands from devices.
| `SUPPORT_DELETE_COMMAND` | Entity allows deleting commands from devices.
| `SUPPORT_ACTIVITY` | Entity supports activities.

## Methods

### Send Command

```python
class MyRemote(RemoteEntity):

    def send_command(self, command: Iterable[str], **kwargs):
        """Send commands to a device."""

    async def async_send_command(self, command: Iterable[str], **kwargs):
        """Send commands to a device."""
```

### Learn Command

Only implement this method if the flag `SUPPORT_LEARN_COMMAND` is set.

```python
class MyRemote(RemoteEntity):

    def learn_command(self, **kwargs):
        """Learn a command from a device."""

    async def async_learn_command(self, **kwargs):
        """Learn a command from a device."""
```

### Delete Command

Only implement this method if the flag `SUPPORT_DELETE_COMMAND` is set.

```python
class MyRemote(RemoteEntity):

    def delete_command(self, **kwargs):
        """Delete a command from a device."""

    async def async_delete_command(self, **kwargs):
        """Delete a command from a device."""
```
