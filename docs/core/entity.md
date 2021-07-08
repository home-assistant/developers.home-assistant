---
title: Entity
sidebar_label: Introduction
---

For a generic introduction of entities, see [entities architecture](../architecture/devices-and-services.md).

## Basic implementation

Below is an example switch entity that keeps track of their state in memory.

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    def __init__(self):
        self._is_on = False

    @property
    def name(self):
        """Name of the entity."""
        return "My Switch"

    @property
    def is_on(self):
        """If the switch is currently on or off."""
        return self._is_on

    def turn_on(self, **kwargs):
        """Turn the switch on."""
        self._is_on = True

    def turn_off(self, **kwargs):
        """Turn the switch off."""
        self._is_on = False
```

That's all there is to it to build a switch entity! Continue reading to learn more or check out the [video tutorial](https://youtu.be/Cfasc9EgbMU?t=737).

## Updating the entity

An entity represents a device. There are various strategies to keep your entity in sync with the state of the device, the most popular one being polling.

### Polling

With polling, Home Assistant will ask the entity from time to time (depending on the update interval of the component) to fetch the latest state. Home Assistant will poll an entity when the `should_poll` property returns `True` (the default value). You can either implement your update logic using `update()` or the async method `async_update()`. This method should fetch the latest state from the device and store it in an instance variable for the properties to return it.

### Subscribing to updates

When you subscribe to updates, your code is responsible for letting Home Assistant know that an update is available. Make sure you have the `should_poll` property return `False`.

Whenever you receive new state from your subscription, you can tell Home Assistant that an update is available by calling `schedule_update_ha_state()` or async callback `async_schedule_update_ha_state()`. Pass in the boolean `True` to the method if you want Home Assistant to call your update method before writing the update to Home Assistant.

## Generic properties

The entity base class has a few properties that are common among all entities in Home Assistant. These can be added to any entity regardless of the type. All these properties are optional and don't need to be implemented.

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                    | Type    | Default | Description                                                                                                                                                                                                                                                  |
| ----------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| assumed_state           | boolean | `False` | Return `True` if the state is based on our assumption instead of reading it from the device.                                                                                                                                                                 |
| available               | boolean | `True`  | Indicate if Home Assistant is able to read the state and control the underlying device.                                                                                                                                                                      |
| device_class            | string  | `None`  | Extra classification of what the device is. Each domain specifies their own. Device classes can come with extra requirements for unit of measurement and supported features.                                                                                 |
| extra_state_attributes  | dict    | `None`  | Extra information to store in the state machine. It needs to be information that further explains the state, it should not be static information like firmware version. |
| entity_picture          | URL     | `None`  | Url of a picture to show for the entity.                                                                                                                                                                                                                     |
| name                    | string  | `None`  | Name of the entity                                                                                                                                                                                                                                           |
| should_poll             | boolean | `True`  | Should Home Assistant check with the entity for an updated state. If set to `False`, entity will need to notify Home Assistant of new updates by calling one of the [schedule update methods](#methods).                                                     |
| unique_id               | string  | `None`  | A unique identifier for this entity. Needs to be unique within a platform (ie `light.hue`). Should not be configurable by the user or be changeable. [Learn more.](entity_registry_index.md#unique-id-requirements)                                          |

## Advanced properties

The following properties are also available on entities. However, they are for advanced use only and should be used with caution.

| Name                            | Type    | Default | Description                                                                                                                                                                                                           |
| ------------------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| force_update                    | boolean | `False` | Write each update to the state machine, even if the data is the same. Example use: when you are directly reading the value from a connected sensor instead of a cache. Use with caution, will spam the state machine. |
| icon                            | icon    | `None`  | Icon to use in the frontend. Icons start with `mdi:` plus an [identifier](https://materialdesignicons.com/). You probably don't need this since Home Assistant already provides default icons for all entities according to its `device_class`. This should be used only in the case where there either is no matching `device_class` or where the icon used for the `device_class` would be confusing or misleading.     |
| entity_registry_enabled_default | boolean | `True`  | Indicate if the entity should be enabled or disabled when it is first added to the entity registry.                                                                                                                   |

## System properties

The following properties are used and controlled by Home Assistant, and should not be overridden by integrations.

| Name    | Type    | Default | Description                                                                                                                                                                              |
| ------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled | boolean | `True`  | Indicate if entity is enabled in the entity registry. It also returns `True` if the platform doesn't support the entity registry. Disabled entities will not be added to Home Assistant. |

## Simplified property implementation - entity class or instance attributes

Writing property methods for each property is just a couple of lines of code,
for example

```python
class MySwitch(SwitchEntity):

    @property
    def icon(self) -> str | None:
        """Icon of the entity."""
        return "mdi:door"

    ...
```

Alternatively, a shorter form is to set Entity class or instance attributes according to either of the
following patterns:

```python
class MySwitch(SwitchEntity):

    _attr_icon = "mdi:door"

    ...
```

```python
class MySwitch(SwitchEntity):

    def __init(self, icon: str) -> None:
        _attr_icon = icon

    ...
```

This does exactly the same as the first example but relies on a default 
implementation of the property in the base class. The name of the attribute
starts with `_attr_` followed by the property name. For example, the default
`device_class` property returns the `_attr_device_class` class attribute.

Not all entity classes support the `_attr_` attributes, please refer
to the documentation dor the respective entity class for details.

:::tip
If an integration needs to access its own properties it should access the property (`self.name`), not the class or instance attribute (`self._attr_name`).
:::

## Lifecycle hooks

Use these lifecycle hooks to execute code when certain events happen to the entity. All lifecycle hooks are async methods.

### `async_added_to_hass()`

Called when an entity has their entity_id and hass object assigned, before it is written to the state machine for the first time. Example uses: restore the state, subscribe to updates or set callback/dispatch function/listener.

### `async_will_remove_from_hass()`

Called when an entity is about to be removed from Home Assistant. Example use: disconnect from the server or unsubscribe from updates.

## Changing the entity model

If you want to add a new feature to an entity or any of its subtypes (light, switch, etc), you will need to propose it first in our [architecture repo](https://github.com/home-assistant/architecture/issues). Only additions will be considered that are common features among various vendors.
