---
title: Event entity
sidebar_label: Event
---

Events are signals that are emitted when something happens, for example, when a user presses a physical button like a doorbell or when a button on a remote control is pressed. The event entity captures these events in the physical world and makes them available in Home Assistant as an entity.

The event entity is stateless, meaning you don't have to maintain a state. Instead, you can trigger an event when something in the physical world happens. Home Assistant will keep track of the last event that was emitted and will show that as the current state of the entity.

The main state of the entity is the timestamp of when the last event was emitted, additionally the type of the event and optionally extra state data that was provided with the event are also kept track of.

An event entity is derived from the  [`homeassistant.components.event.EventEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/event/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name        | Type            | Default      | Description                                          |
| ----------- | --------------- | ------------ | ---------------------------------------------------- |
| event_types | list of strings | **Required** | A list of possible event types this entity can fire. |

Other properties that are common to all entities such as `device_class`, `icon`, `name` etc. are also applicable.

## Firing events

The event entity is a little different compared to other entities. Home Assistant manages the state, but the integration
is responsible for firing the events. This is done by calling the `_trigger_event` method on the event entity.

This method takes the event type as the first argument and optionally extra state data as the second argument.

```python
class MyEvent(EventEntity):

    _attr_device_class = EventDeviceClass.BUTTON
    _attr_event_types = ["single_press", "double_press"]

    @callback
    def _async_handle_event(self, event: str) -> None:
        """Handle the demo button event."""
        self._trigger_event(event, {"extra_data": 123})
        self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """Register callbacks with your device API/library."""
        my_device_api.listen(self._async_handle_event)
```

Only event types that are defined in the `event_types` property can be fired. If an event type is fired that is not defined in the `event_types` property, a `ValueError` will be raised.

:::tip
Be sure to deregister any callbacks when the entity is removed from Home Assistant.
:::

### Available device classes

Optionally specifies what type of entity it is.

| Constant                    | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `EventDeviceClass.BUTTON`   | A button of a remote control has been pressed.        |
| `EventDeviceClass.DOORBELL` | Specifically for buttons that are used as a doorbell. |
| `EventDeviceClass.MOTION`   | For motion events detected by a motion sensor.        |
