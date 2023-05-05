---
title: Entity
sidebar_label: Introduction
---

For a generic introduction of entities, see [entities architecture](../architecture/devices-and-services.md).

## Basic implementation

Below is an example switch entity that keeps track of its state in memory.
In addition, the switch in the example represents the main feature of a device,
meaning the entity has the same name as its device.

Please refer to [Entity naming](#entity-naming) for how to give an entity its own name.

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True

    def __init__(self):
        self._is_on = False
        self._attr_device_info = ...  # For automatic device registration
        self._attr_unique_id = ...

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

Whenever you receive a new state from your subscription, you can tell Home Assistant that an update is available by calling `schedule_update_ha_state()` or async callback `async_schedule_update_ha_state()`. Pass in the boolean `True` to the method if you want Home Assistant to call your update method before writing the update to Home Assistant.

## Generic properties

The entity base class has a few properties that are common among all entities in Home Assistant. These can be added to any entity regardless of the type. All these properties are optional and don't need to be implemented.

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                    | Type    | Default | Description                                                                                                                                                                                                                                                  |
| ----------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| assumed_state           | boolean | `False` | Return `True` if the state is based on our assumption instead of reading it from the device. |
| attribution             | string  | `None`  | The branding text required by the API provider. |
| available               | boolean | `True`  | Indicate if Home Assistant is able to read the state and control the underlying device. |
| device_class            | string  | `None`  | Extra classification of what the device is. Each domain specifies their own. Device classes can come with extra requirements for unit of measurement and supported features. |
| device_info             | dict    | `None`  | [Device registry](/docs/device_registry_index) descriptor for [automatic device registration.](/docs/device_registry_index#automatic-registration-through-an-entity)
| entity_category         | string  | `None`  | Classification of a non-primary entity. Set to `config` for an entity which allows changing the configuration of a device, for example a switch entity making it possible to turn the background illumination of a switch on and off. Set to `diagnostic` for an entity exposing some configuration parameter or diagnostics of a device but does not allow changing it, for example a sensor showing RSSI or MAC-address. |
| entity_picture          | URL     | `None`  | Url of a picture to show for the entity. |
| extra_state_attributes  | dict    | `None`  | Extra information to store in the state machine. It needs to be information that further explains the state, it should not be static information like firmware version. |
| has_entity_name         | boolean |         | Return `True` if the entity's `name` property represents the entity itself (required for new integrations). This is explained in more detail below.
| name                    | string  | `None`  | Name of the entity. Avoid hard coding a natural language name, use a [translated name](/docs/internationalization/core/#name-of-entities) instead.  |
| should_poll             | boolean | `True`  | Should Home Assistant check with the entity for an updated state. If set to `False`, entity will need to notify Home Assistant of new updates by calling one of the [schedule update methods](integration_fetching_data.md#push-vs-poll). |
| translation_key         | string  | `None`  | A key for looking up translations of the entity's state in [`entity` section of the integration's `strings.json`](/docs/internationalization/core#state-of-entities).
| unique_id               | string  | `None`  | A unique identifier for this entity. Needs to be unique within a platform (ie `light.hue`). Should not be configurable by the user or be changeable. [Learn more.](entity_registry_index.md#unique-id-requirements) |

:::warning
Entities that generate a significant amount of state changes can quickly increase the size of the database when the `extra_state_attributes` also change frequently. Minimize the number of `extra_state_attributes` for these entities by removing non-critical attributes or creating additional `sensor` entities.
:::

## Advanced properties

The following properties are also available on entities. However, they are for advanced use only and should be used with caution.

| Name                            | Type    | Default | Description                                                                                                                                                                                                           |
| ------------------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| entity_registry_enabled_default | boolean | `True`  | Indicate if the entity should be enabled or disabled when first added to the entity registry. This includes fast-changing diagnostic entities or, assumingly less commonly used entities. For example, a sensor exposing RSSI or battery voltage should typically be set to `False`; to prevent unneeded (recorded) state changes or UI clutter by these entities. |
| entity_registry_visible_default | boolean | `True`  | Indicate if the entity should be hidden or visible when first added to the entity registry. |
| force_update                    | boolean | `False` | Write each update to the state machine, even if the data is the same. Example use: when you are directly reading the value from a connected sensor instead of a cache. Use with caution, will spam the state machine. |
| icon                            | icon    | `None`  | Icon to use in the frontend. Icons start with `mdi:` plus an [identifier](https://materialdesignicons.com/). You probably don't need this since Home Assistant already provides default icons for all entities according to its `device_class`. This should be used only in the case where there either is no matching `device_class` or where the icon used for the `device_class` would be confusing or misleading. |

## System properties

The following properties are used and controlled by Home Assistant, and should not be overridden by integrations.

| Name    | Type    | Default | Description                                                                                                                                                                              |
| ------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled | boolean | `True`  | Indicate if entity is enabled in the entity registry. It also returns `True` if the platform doesn't support the entity registry. Disabled entities will not be added to Home Assistant. |

## Entity naming

### `has_entity_name` True (Mandatory for new integrations)

The entity's name property only identifies the data point represented by the entity, and should not include the name of the device or the type of the entity. So for a sensor that represents the power usage of its device, this would be “Power usage”.

If the entity represents a single main feature of a device the entity should typically have its name property return `None`.
The "main feature" of a device would for example be the `LightEntity` of a smart light bulb.

The `friendly_name` state attribute is generated by combining then entity name with the device name as follows:
- The entity is not a member of a device: `friendly_name = entity.name`
- The entity is a member of a device and `entity.name` is not `None`: `friendly_name = f"{device.name} {entity.name}"`
- The entity is a member of a device and `entity.name` is `None`: `friendly_name = f"{device.name}"`

Entity names should start with a capital letter, the rest of the words are lower case (unless it's a proper noun or a capitalized abbreviation of course).

#### Example of a switch entity which is the main feature of a device

*Note: The example is using class attributes to implement properties, for other ways
to implement properties see [Property implementation.](#property-implementation)*
*Note: The example is incomplete, the `unique_id` property must be implemented, and the entity
must be [registered with a device.](/docs/device_registry_index#defining-devices)


```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True
    _attr_name = None

```

#### Example of a switch entity which is either not the main feature of a device, or is not part of a device:

*Note: The example is using class attributes to implement properties, for other ways*
*to implement properties see [Property implementation.](#property-implementation)*
*Note: If the entity is part of a device, the `unique_id` property must be implemented, and the entity
must be [registered with a device.](/docs/device_registry_index#defining-devices)

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True

    @property
    def name(self):
        """Name of the entity."""
        return "My Switch"
```

### `has_entity_name` not implemented or False (Deprecated)

The entity's name property may be a combination of the device name and the data point represented by the entity.

## Property implementation

### Property function

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

### Entity class or instance attributes

Alternatively, a shorter form is to set Entity class or instance attributes according to either of the
following patterns:

```python
class MySwitch(SwitchEntity):

    _attr_icon = "mdi:door"

    ...
```

```python
class MySwitch(SwitchEntity):

    def __init__(self, icon: str) -> None:
        self._attr_icon = icon

    ...
```

This does exactly the same as the first example but relies on a default 
implementation of the property in the base class. The name of the attribute
starts with `_attr_` followed by the property name. For example, the default
`device_class` property returns the `_attr_device_class` class attribute.

Not all entity classes support the `_attr_` attributes for their entity 
specific properties, please refer to the documentation for the respective 
entity class for details.

:::tip
If an integration needs to access its own properties it should access the property (`self.name`), not the class or instance attribute (`self._attr_name`).
:::

### Example

The below code snippet gives an example of best practices for when to implement property functions, and when to use class or instance attributes.

```py
class SomeEntity():
    _attr_device_clas = SensorDeviceClass.TEMPERATURE  # This will be common to all instances of SomeEntity
    def __init__(self, device):
        self._device = device
        self._attr_available = False  # This overrides the default
        self._attr_name = device.get_friendly_name()

        # The following should be avoided:
        if some_complex_condition and some_other_condition and something_is_none_and_only_valid_after_update and device_available:
           ...

    def update(self)
        if self.available  # Read current state, no need to prefix with _attr_
            # Update the entity
            self._device.update()

        if error:
            self._attr_available = False  # Set property value
            return
        # We don't need to check if device available here
        self._attr_is_on = self._device.get_state()  # Update "is_on" property
```

## Lifecycle hooks

Use these lifecycle hooks to execute code when certain events happen to the entity. All lifecycle hooks are async methods.

### `async_added_to_hass()`

Called when an entity has their entity_id and hass object assigned, before it is written to the state machine for the first time. Example uses: restore the state, subscribe to updates or set callback/dispatch function/listener.

### `async_will_remove_from_hass()`

Called when an entity is about to be removed from Home Assistant. Example use: disconnect from the server or unsubscribe from updates.

## Changing the entity model

If you want to add a new feature to an entity or any of its subtypes (light, switch, etc), you will need to propose it first in our [architecture repo](https://github.com/home-assistant/architecture/discussions). Only additions will be considered that are common features among various vendors.
