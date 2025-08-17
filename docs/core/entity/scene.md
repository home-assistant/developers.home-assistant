---
title: Scene entity
sidebar_label: Scene
--- 

A scene entity is an entity that [can reproduce a wanted state](/docs/core/platform/reproduce_state/) for a group of entities. A scene entity can activate the scene towards a group of devices but remains stateless from the Home Assistant perspective.

A scene entity is derived from [`homeassistant.components.scene.Scene`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/scene/__init__.py).

If you want to represent something that can be turned on and off (and thus have an actual state), you should use a `switch` entity instead.

Scene entities can also [be created by the user via the Scene editor or YAML](https://www.home-assistant.io/integrations/scene).

## Properties

As this integration is stateless, it doesn't provide any specific properties for itself.
Other properties that are common to all entities such as `icon` and `name` etc are still applicable.

## Methods

### Activate

Activate the scene.

```python
class MyScene(Scene):
    # Implement one of these methods.

    def activate(self, **kwargs: Any) -> None:
        """Activate scene. Try to get entities into requested state."""

    async def async_activate(self, **kwargs: Any) -> None:
        """Activate scene. Try to get entities into requested state."""
```

The activate method can be used to activate the scene towards a device or service.
It is called by Home Assistant when the user presses the scene `activate` button or when the `scene.turn_on` action is called to activate the scene.

Some integrations can receive external events (for example, physical button presses) that activate scenes outside of Home Assistant. These activations do not originate from the Home Assistant UI or service calls, but from external sources such as hardware controllers or third-party systems.

To support this scenario, integrations should notify Home Assistant when an external scene activation occurs. This ensures the scene entity's state is updated and can be used in automations.

```python
# Inherit from BaseScene
class MyScene(BaseScene):

    # Note the leading underscore
    async def _async_activate(self, **kwargs: Any) -> None:
        """Activate scene."""
        # Call a service to activate scene
        await mqtt.async_publish(self.hass, self._topic, self._payload)

    # Record the activation in the callback of your service
    async def _state_received(self, msg: ReceiveMessage) -> None:
        self._async_record_activation()
        self.async_schedule_update_ha_state()
```

### Available device classes

There are no specific device classes. The `device_class` attribute is not set on the scene entity.
