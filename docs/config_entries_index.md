---
title: Config Entries
sidebar_label: Introduction
---

Config entries are pieces of configuration that can be consumed by components. Each configuration entry is created via a Config Flow Handler, as defined by each component.

## Setting up an entry

During startup, Home Assistant will setup the entries during the normal setup
of a component. It will first call the normal component setup and then call the method
`async_setup_entry(hass, entry)` for each entry. The same method is called when
Home Assistant is running while a config entry is created.

If a component includes platforms, it will need to forward the entry to the component. This can be done by calling the forward function on the config entry manager:

```python
hass.async_add_job(hass.config_entries.async_forward_entry_setup(config_entry, 'light'))
```

Make sure you use `hass.async_add_job` to avoid a circular dependency between the platform and the component.

For a platform to support config entries, it will need to add a setup entry method:

```python
async def async_setup_entry(hass, config_entry, async_add_devices):
```

## Unloading entries

Components can support unloading a config entry. This is optional. When unloading an entry, it needs to clean up all entities, unsubscribe any event listener and close all connections. To implement this, add `async_unload_entry(hass, entry)` to your component.

Platforms will not need to add any logic for unloading a config entry. The entity component will take care of this. If you need to clean up resources used for an entity, implement the `async_will_remove_from_hass` method on the Entity.
