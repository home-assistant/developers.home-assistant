---
title: Notify entity
sidebar_label: Notify
---

A notify entity is an entity that can send a message towards a device or service but remains stateless from the Home Assistant perspective.

A notify entity is derived from the  [`homeassistant.components.notify.NotifyEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/notify/__init__.py),
and can be helpful to send notification messages as (but not limited to):

- an SMS
- an email
- a direct message or chat
- a screen message on a device's LCD display

## States

The state of a notify entity is a timestamp, representing the date and time of the last message sent.
Unlike a `text` entity, the `notify` entity has no state that can be set.

If you want to represent something that has a text value that can be changed (and thus has an actual state), you should use a `text` entity instead.

## Properties

As this integration is stateless, it doesn't provide any specific properties for itself.
Other properties that are common to all entities such as `icon` and `name` etc are still applicable.

## Methods

### Send message

The send message method is used to send a message to a device or service.

```python
class MyNotifier(NotifyEntity):
    # Implement one of these methods.

    def send_message(self, message: str, title: str | None = None) -> None:
        """Send a message."""

    async def async_send_message(self, message: str, title: str | None = None) -> None:
        """Send a message."""
```

### Record notification

Some integrations provide custom actions with extended, integration-specific functionality for sending notifications, or otherwise trigger notifications from within Home Assistant. To track when a notification is sent, integrations can call `_async_record_notification` or `_record_notification`.

:::important
Only notifications that originate from within Home Assistant should be recorded on the notify entity. Notifications generated externally must not be recorded. Use an event entity for those instead.
:::

```python
class MyNotifier(NotifyEntity):

    # Default method to send notification via notify.send_message action
    async def async_send_message(self, message: str, title: str | None = None) -> None:
        """Send a message."""
        await self._publish(message=message, title=title)

    # Integration implements a custom entity action to send notifications
    async def publish(self, message: str, title: str | None = None, priority: int | None = None) -> None:
        """Send a message with priority."""
        await self._publish(message=message, title=title, priority=priority)
        # Record that a notification was sent
        self._async_record_notification()
```
