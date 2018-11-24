---
title: Config Entries
sidebar_label: Introduction
id: version-0.82.0-config_entries_index
original_id: config_entries_index
---

Config Entries are configuration data that are persistently stored by Home Assistant. A config entry is created by a user via the UI. The UI flow is powered by a [config flow handler](config_entries_config_flow_handler.md) as defined by the component.

## Setting up an entry

During startup, Home Assistant first calls the [normal component setup](https://developers.home-assistant.io/docs/en/creating_component_index.html),
and then call the method `async_setup_entry(hass, entry)` for each entry. If a new Config Entry is
created at runtime, Home Assistant will also call `async_setup_entry(hass, entry)` ([example](https://github.com/home-assistant/home-assistant/blob/0.68.0/homeassistant/components/hue/__init__.py#L119)).

#### For platforms

If a component includes platforms, it will need to forward the Config Entry to the platform. This can
be done by calling the forward function on the config entry manager ([example](https://github.com/home-assistant/home-assistant/blob/0.68.0/homeassistant/components/hue/bridge.py#L81)):

```python
# Use `hass.async_add_job` to avoid a circular dependency between the platform and the component
hass.async_add_job(hass.config_entries.async_forward_entry_setup(config_entry, 'light'))
```

For a platform to support config entries, it will need to add a setup entry method ([example](https://github.com/home-assistant/home-assistant/blob/0.68.0/homeassistant/components/light/hue.py#L60)):

```python
async def async_setup_entry(hass, config_entry, async_add_devices):
```

## Unloading entries

Components can optionally support unloading a config entry. When unloading an entry, the component needs
to clean up all entities, unsubscribe any event listener and close all connections. To implement this,
add `async_unload_entry(hass, entry)` to your component ([example](https://github.com/home-assistant/home-assistant/blob/0.68.0/homeassistant/components/hue/__init__.py#L136)).

Platforms will not need to add any logic for unloading a config entry. The entity component will take care of this.
If you need to clean up resources used for an entity, implement the `async_will_remove_from_hass` method on the Entity ([example](https://github.com/home-assistant/home-assistant/blob/0.68.0/homeassistant/components/media_player/cast.py#L313)).
