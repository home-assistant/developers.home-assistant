---
title: Scene Entity
sidebar_label: Scene
--- 

A scene entity is an entity that can restore a wanted state for a group of entities. A scene entity can activate the scene towards a group of devices but remains stateless from the Home Assistant perspective.

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
class MySwitch(Scene):
    # Implement one of these methods.

    def activate(self, **kwargs: Any) -> None:
        """Activate scene. Try to get entities into requested state."""

    async def async_activate(self, **kwargs: Any) -> None:
        """Activate scene. Try to get entities into requested state."""
```

The activate method can be used to activate the scene towards a device or service.
It is called by Home Assistant when the user presses the scene `activate` button or when the `scene.turn_on` service is called to activate the scene.

### Available device classes

There are no specific device classes. The `device_class` attribute is not set on the scene entity.
