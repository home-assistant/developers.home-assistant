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

## Supported Features

| Constant | Description 
| -------- | -----------
| `SUPPORT_LEARN_COMMAND` | Entity allows learning commands from devices.

## Methods

### Send Command

```python
class MyRemote(RemoteEntity):

    def send_command(self, **kwargs):
        """Send commands to a device."""

    async def async_send_command(self, **kwargs):
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
