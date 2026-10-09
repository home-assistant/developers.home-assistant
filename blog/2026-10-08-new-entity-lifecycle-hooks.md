---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "New entity lifecycle hooks"
---

## Summary

Two new entity lifecycle hooks have been added:

- `Entity.async_prepare_to_add_to_hass` allows integrations to run code *before* an entity is added to Home Assistant. It's available from Home Assistant Core 2026.10.
- `Entity.async_entity_id_changed` is called when an entity's `entity_id` is changed in the entity registry. From Home Assistant Core 2026.11, an entity is no longer removed and added again when its `entity_id` is changed; it's updated in place instead.

Custom integrations which implement `async_prepare_to_add_to_hass`, `async_added_to_hass` or `async_will_remove_from_hass` need to opt in to in-place `entity_id` changes by implementing `async_entity_id_changed`. Until they do, their entities are still removed and added again when the `entity_id` changes. This backwards compatibility will be removed in Home Assistant Core 2027.11.

The lifecycle hooks are documented in [entity lifecycle hooks](/docs/core/entity#lifecycle-hooks).

## Running code before an entity is added

### The new hook

```python
async def async_prepare_to_add_to_hass(self) -> None:
    """Run before the entity is added to hass."""
```

`async_prepare_to_add_to_hass` is awaited on every add attempt, before the entity platform processes the entity's registry entry for this add attempt, and before the entity's state is written to the state machine. The entity's `hass` and `platform` attributes are assigned when the hook runs, but the hook must not rely on `entity_id` or `registry_entry`: depending on how the entity is added, they may be unset, set by the integration, or left over from an earlier add.

Unlike `async_added_to_hass`, the hook also runs for adds which will be aborted, for example because the entity is disabled in the entity registry, or because its `entity_id` or `unique_id` collides with an entity which has already been added. That's what makes it useful for work which must happen regardless of whether the entity ends up being added, but it also means code in the hook must not assume that the add will complete.

Raising an exception from the hook aborts the add.

This is implemented in core [PR #182156](https://github.com/home-assistant/core/pull/182156), the rationale is described in architecture proposal [home-assistant/architecture#1480](https://github.com/home-assistant/architecture/discussions/1480).

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

Integrations have so far accomplished running code before an entity is added by overriding `Entity.add_to_platform_start`. That method is an implementation detail of the entity platform helper and is not meant to be overridden. Integrations which override it should override `async_prepare_to_add_to_hass` instead. The new hook takes no arguments; use `self.hass` and `self.platform` in place of the `hass` and `platform` arguments, and `self.parallel_updates` in place of `parallel_updates`.

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

## Changing the entity ID in place

Until now, an entity was removed and then added again under its new `entity_id` when its `entity_id` was changed in the entity registry. This ran the entity's whole remove and add lifecycle again, including `async_will_remove_from_hass` and `async_added_to_hass`, even though for most entities nothing but the `entity_id` itself had to change.

From Home Assistant Core 2026.11, the entity is instead updated in place. Home Assistant removes the state under the old `entity_id`, sets `self.entity_id` to the new `entity_id`, moves its own bookkeeping (entity registry and device registry tracking, entity sources, restore state and entity groups) to the new `entity_id`, and writes the state under the new `entity_id`. `async_will_remove_from_hass` and `async_added_to_hass` are not called.

This is implemented in core [PR #183946](https://github.com/home-assistant/core/pull/183946) and [PR #184943](https://github.com/home-assistant/core/pull/184943), the rationale is described in architecture proposal [home-assistant/architecture#1393](https://github.com/home-assistant/architecture/discussions/1393).

### The new hook

Entities which have set up anything keyed on their own `entity_id` can implement a new callback to update it:

```python
@callback
def async_entity_id_changed(self, old_entity_id: str) -> None:
    """Run when the entity_id has been changed in the entity registry."""
```

`async_entity_id_changed` is called after Home Assistant has removed the state under the old `entity_id`, moved its own bookkeeping and run `async_registry_entry_updated`. `self.entity_id` is already the new `entity_id`, the previous `entity_id` is passed as `old_entity_id`. Use it to update anything the state or attributes are derived from, for example state change listeners or dispatcher signals keyed on `self.entity_id`.

Writing the state from the hook is optional: if the state has not been written under the new `entity_id` when the hook returns, Home Assistant writes it. Work which needs the entity's own state under its new `entity_id`, for example rendering templates which reference `this`, should first write the state with `self.async_write_ha_state()`.

The hook must not await. Work which must be awaited can be done in a task; since entity registry updates are not serialized with it, check after each `await` that the entity is still added and that `self.entity_id` has not changed again.

The hook must call `super()`, so base classes can update their own bookkeeping.

Exceptions raised by the hook are caught and logged by Home Assistant, and the `entity_id` change still completes: the state is written under the new `entity_id`. This is unlike `async_prepare_to_add_to_hass`, where raising an exception aborts the add.

Example:

```python
async def async_added_to_hass(self) -> None:
    """Run when the entity has been added to hass."""
    await super().async_added_to_hass()
    self._subscribe_signal()
    self.async_on_remove(lambda: self._unsub_signal())

@callback
def _subscribe_signal(self) -> None:
    """Subscribe to the signal for the current entity_id."""
    self._unsub_signal = async_dispatcher_connect(
        self.hass, f"{DOMAIN}_{self.entity_id}", self._handle_signal
    )

@callback
def async_entity_id_changed(self, old_entity_id: str) -> None:
    """Run when the entity_id has been changed in the entity registry."""
    super().async_entity_id_changed(old_entity_id)
    self._unsub_signal()
    self._subscribe_signal()
```

Note that the callback registered with `async_on_remove` calls whatever the current unsubscribe function is. Passing the unsubscribe function itself, as in `self.async_on_remove(self._unsub_signal)`, registers the initial subscription's unsubscribe function: after the `entity_id` has changed, removing the entity calls that stale function again, and the new subscription leaks.

### Backwards compatibility

An entity whose add and remove hooks depend on its `entity_id` would break if it was silently changed in place. To give custom integrations time to migrate, an entity is still removed and added again when its `entity_id` changes if its class, or one of its base classes other than `Entity`, implements `async_prepare_to_add_to_hass`, `async_added_to_hass` or `async_will_remove_from_hass`, unless that same class or a subclass of it also implements `async_entity_id_changed`.

Custom integration authors should check whether their entities set up anything keyed on their own `entity_id`, and then implement `async_entity_id_changed`. If nothing needs to be updated, implementing it as a method which only calls `super()` is enough to opt in:

```python
@callback
def async_entity_id_changed(self, old_entity_id: str) -> None:
    """Opt in to in-place entity_id changes."""
    super().async_entity_id_changed(old_entity_id)
```

This backwards compatibility will be removed in Home Assistant Core 2027.11. After that, all entities have their `entity_id` changed in place.

## Which hook to use

As a rule of thumb:

- Use `async_added_to_hass` for the usual setup work: restoring state, subscribing to updates, registering listeners, fetching initial data. It runs as the last step of an add attempt, after the entity has its `entity_id` and its entity registry entry. It's not called for adds which are aborted earlier, for example because the entity is disabled, but the add can still fail after it has started: if it raises, if the add is cancelled, or if writing the first state raises.
- Use `async_will_remove_from_hass` to undo work done in `async_added_to_hass` when a successfully added entity is removed. It's not called when the add fails.
- Use `async_prepare_to_add_to_hass` only when the work genuinely has to happen before the entity platform processes the entity's registry entry, or has to happen even if the entity is disabled.
- Use `async_on_remove` for clean up which must run both when an add is aborted or fails and when the entity is removed. This is the safe choice for anything set up in `async_prepare_to_add_to_hass` or `async_added_to_hass`.
- Use `async_entity_id_changed` to update anything keyed on the entity's own `entity_id` when it changes. If the work needs the state under the new `entity_id`, write it with `self.async_write_ha_state()` first.
- Do not override `add_to_platform_start`, `add_to_platform_finish` or `add_to_platform_abort`.
