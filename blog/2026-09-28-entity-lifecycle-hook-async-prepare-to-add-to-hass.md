---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "New entity lifecycle hook async_prepare_to_add_to_hass"
---

## Summary

A new entity lifecycle hook, `Entity.async_prepare_to_add_to_hass`, allows integrations to run code *before* an entity is added to Home Assistant.

Integrations which need to do work before an entity is added have so far accomplished that by overriding `Entity.add_to_platform_start`. That method is an implementation detail of the entity platform helper and is not meant to be overridden. Integrations which override it should migrate to the new hook.

This is implemented in core [PR #182156](https://github.com/home-assistant/core/pull/182156), the rationale is described in architecture proposal [home-assistant/architecture#1480](https://github.com/home-assistant/architecture/discussions/1480). The changes land in Home Assistant Core 2026.10.

## Details

### The new hook

```python
async def async_prepare_to_add_to_hass(self) -> None:
    """Run before the entity is added to hass."""
```

`async_prepare_to_add_to_hass` is awaited on every add attempt, before the entity is assigned an `entity_id`, before its entity registry entry is created and assigned to `registry_entry`, and before its state is written to the state machine. The entity's `hass` and `platform` attributes are assigned when the hook runs.

Unlike `async_added_to_hass`, the hook also runs for adds which will be aborted, for example because the entity is disabled in the entity registry, or because its `entity_id` or `unique_id` collides with an entity which has already been added. That's what makes it useful for work which must happen regardless of whether the entity ends up being added, but it also means code in the hook must not assume that the add will complete.

Raising an exception from the hook aborts the add.

### Cleaning up

Since the add may be aborted, `async_will_remove_from_hass` is not guaranteed to run for an entity whose `async_prepare_to_add_to_hass` has run. Clean up of anything set up in the hook should be registered with `async_on_remove`, which is called both when an add is aborted and when a successfully added entity is removed:

```python
async def async_prepare_to_add_to_hass(self) -> None:
    """Run before the entity is added to hass."""
    await super().async_prepare_to_add_to_hass()
    unsubscribe = self._device.subscribe(self._handle_update)
    self.async_on_remove(unsubscribe)
```

### Migrating from `add_to_platform_start`

Integrations which override `Entity.add_to_platform_start` should override `async_prepare_to_add_to_hass` instead. The new hook takes no arguments; use `self.hass` and `self.platform` in place of the `hass` and `platform` arguments, and `self.parallel_updates` in place of `parallel_updates`.

Before:

```python
@callback
def add_to_platform_start(
    self,
    hass: HomeAssistant,
    platform: EntityPlatform,
    parallel_updates: asyncio.Semaphore | None,
) -> None:
    """Start adding an entity to a platform."""
    super().add_to_platform_start(hass, platform, parallel_updates)
    _async_register_thing(hass, platform.platform_name, self.unique_id)
```

After:

```python
async def async_prepare_to_add_to_hass(self) -> None:
    """Run before the entity is added to hass."""
    await super().async_prepare_to_add_to_hass()
    _async_register_thing(self.hass, self.platform.platform_name, self.unique_id)
```

### Which hook to use

Most integrations do not need the new hook. As a rule of thumb:

- Use `async_added_to_hass` for the usual setup work: restoring state, subscribing to updates, registering listeners, fetching initial data. It runs only for entities which are successfully added, after the entity has its `entity_id` and its entity registry entry.
- Use `async_will_remove_from_hass` to undo work done in `async_added_to_hass`.
- Use `async_prepare_to_add_to_hass` only when the work genuinely has to happen before the entity is registered, or has to happen even if the entity is disabled.
- Use `async_on_remove` for clean up which must run on both an aborted add and a normal removal.
- Do not override `add_to_platform_start`, `add_to_platform_finish` or `add_to_platform_abort`.

The lifecycle hooks are documented in [entity lifecycle hooks](/docs/core/entity#lifecycle-hooks).
