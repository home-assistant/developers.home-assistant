---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Devices are restricted to a single config entry and at most one subentry"
---

## Summary

A device is now owned by a single config entry, and by a single (or no) config subentry. Devices are no longer merged across integrations: a physical device supported by several integrations is now represented by one device per config entry instead of a single shared device.

Devices which were previously tied to multiple config entries are split into one device per config entry when the device registry is loaded. The entity registry is updated so entities point to the correct device.

**Most integrations don't interact directly with the device registry and don't need any changes.** Integrations which interact with it directly need to handle the deprecations listed below.

This is implemented in core [PR #175785](https://github.com/home-assistant/core/pull/175785), the rationale is described in architecture proposal [home-assistant/architecture#1226](https://github.com/home-assistant/architecture/discussions/1226). The changes land in Home Assistant Core 2026.8.

## Background

Until now, a physical device supported by several integrations has been merged into a single, shared device. This was achieved by identifying devices by connections and identifiers which are globally unique, so that for example a device tracker and a native integration referring to the same MAC address end up on the same device.

This causes a few problems:

- There's no single source of truth for device information such as name or model; conflicting values are discarded instead of preserved.
- Users get a confusing experience where a device page contains a hodgepodge of entities from multiple integrations.
- There are long-standing bugs where modifying the connections and identifiers of a device causes multiple devices to end up with the same connections, violating the original design of the device registry.

The new behavior is achieved by making identifiers and connections unique per config entry instead of globally unique.

## Deprecations

Using the deprecated functionality below logs a warning at runtime. Unless noted otherwise, deprecated functionality remains supported until Home Assistant Core 2027.8.

### `DeviceEntry.config_entries`

Deprecated, use `DeviceEntry.config_entry_id` instead. The property is kept as a compatibility shim which returns a set with the device's single config entry.

### `DeviceEntry.config_entries_subentries`

Deprecated, use `DeviceEntry.config_entry_id` and `DeviceEntry.config_subentry_id` instead. The property is kept as a compatibility shim.

### `DeviceEntry.primary_config_entry`

Deprecated, use `DeviceEntry.config_entry_id` instead. A device now belongs to a single config entry, which is its primary config entry.

### Reading config entries of a composite device

`DeviceEntry.config_entries`, `DeviceEntry.config_entries_subentries` and `DeviceEntry.primary_config_entry` are only deprecated for ordinary devices, which belong to a single config entry. They are not deprecated when interacting with a synthesized composite device, the read-only device the backwards compatibility resolution returns for a pre-migration composite device id (see [Backwards compatibility](#backwards-compatibility)). Such a device spans several config entries, which `config_entry_id` and `config_subentry_id` can't represent, so these three properties, which report the union across the split devices, remain the way to read that information.

### `DeviceInfo["via_device"]` and `DeviceRegistry.async_get_or_create(via_device=...)`

Deprecated, use `via_device_id` instead. Because identifiers are only unique per config entry, an identifier pair no longer unambiguously points at a single device, which is why `via_device` is deprecated.

Passing both `via_device` and `via_device_id` raises `HomeAssistantError`.

### `DeviceRegistry.async_update_device()` config entry parameters

The `add_config_entry_id`, `add_config_subentry_id`, `remove_config_entry_id` and `remove_config_subentry_id` parameters are all deprecated. A device belongs to a single config entry and subentry, so adding and removing config entries is no longer meaningful; a device is instead moved or removed.

To move a device to another config entry or subentry, pass the new `new_config_entry_id` and `new_config_subentry_id` parameters:

```py
device_registry.async_update_device(
    device.id,
    new_config_entry_id=config_entry.entry_id,
    new_config_subentry_id=subentry.subentry_id,
)
```

Moving a device with the old parameters took the integration several `async_update_device` calls, adding the device to the new config entry and subentry and then removing it from the old ones, with a separate case for a device that only changed subentry within the same config entry. The single call shown above replaces all of that. In addition, the device registry now clears a `CONFIG_ENTRY` disable when a device is moved to an enabled config entry, so the integration no longer has to carry the `disabled_by` flag across the move by hand.

Relatedly, `async_update_device` now validates the `disabled_by` flag against the owning config entry's disabled state, added in core [PR #176681](https://github.com/home-assistant/core/pull/176681). Setting `disabled_by=None` for a device on a disabled config entry, or `disabled_by=DeviceEntryDisabler.CONFIG_ENTRY` for a device on an enabled config entry, is inconsistent; such a value is ignored and logged now, and will raise from Home Assistant Core 2027.8.

Core integrations have been updated as examples: `openai_conversation` in [PR #176662](https://github.com/home-assistant/core/pull/176662), `scrape` in [PR #176663](https://github.com/home-assistant/core/pull/176663), `waqi` in [PR #176664](https://github.com/home-assistant/core/pull/176664) and `wolflink` in [PR #176665](https://github.com/home-assistant/core/pull/176665).

To remove a device, call `DeviceRegistry.async_remove_device()`:

```py
device_registry.async_remove_device(device.id)
```

Core integrations have been updated to remove devices this way in PRs [#176669](https://github.com/home-assistant/core/pull/176669), [#176671](https://github.com/home-assistant/core/pull/176671), [#176672](https://github.com/home-assistant/core/pull/176672) and [#176673](https://github.com/home-assistant/core/pull/176673).

### `DeviceRegistry.async_get_device()`

Deprecated. Identifiers and connections are only unique per config entry, so a lookup by identifiers or connections can by design match more than one device, and what `async_get_device` returns is therefore ambiguous.

When the owning config entry is known, look the device up scoped to that config entry with the new methods `DeviceRegistry.async_get_device_by_identifier()` or `DeviceRegistry.async_get_device_by_connection()`, added in core [PR #176879](https://github.com/home-assistant/core/pull/176879). Each takes a single identifier or connection tuple plus the config entry id, so the lookup can no longer be ambiguous:

```py
# Before
device = device_registry.async_get_device(identifiers={(DOMAIN, serial_number)})
# After
device = device_registry.async_get_device_by_identifier(
    (DOMAIN, serial_number), entry.entry_id
)
```

Inside an entity, prefer `self.device_entry` over a registry lookup. If you genuinely need every device matching a key, possibly across config entries, use `DeviceRegistry.async_get_devices()`, which returns a list.

Core integrations are being migrated to the new methods, `heos` in core [PR #176932](https://github.com/home-assistant/core/pull/176932) is an example.

During the deprecation period, `async_get_device` resolves an ambiguous lookup as described in [Backwards compatibility](#backwards-compatibility) below. Note that this backwards-compatible resolution only happens through the `DeviceRegistry` lookup methods such as `async_get()` and `async_get_device()`; interacting with the `devices` container directly, for example `DeviceRegistry.devices.get(device_id)`, does not synthesize a composite device.

### Adding a helper config entry to another integration's device

Helper integrations must not add their config entry to the source entity's device or to a user-selected device, they should link their entities to the device instead. This is a direct consequence of the change described here: a device now belongs to a single config entry, so a helper config entry can no longer be added to a device owned by another integration.

This was announced last year in [Updated guidelines for helper integrations linking to other integration's device](/blog/2025/07/18/updated-pattern-for-helpers-linking-to-devices), and stops working in Home Assistant Core 2026.8.

### `helpers.device.async_device_info_to_link_from_entity()` and `async_device_info_to_link_from_device_id()`

Deprecated in core [PR #176696](https://github.com/home-assistant/core/pull/176696). Both helpers now always return `None`.

They returned a `DeviceInfo` carrying another device's identifiers and connections, which implicitly added the caller's config entry to that device. A device with a single config entry can't represent that, it would silently fork a duplicate device instead.

Link the helper entity to the device by setting `self.device_entry` in the entity's constructor instead:

```py
self.device_entry = async_entity_id_to_device(hass, source_entity_id)
```

The helpers are removed in Home Assistant Core 2027.8.

### `helpers.helper_integration.async_handle_source_entity_changes(add_helper_config_entry_to_device=...)`

Deprecated in core [PR #176701](https://github.com/home-assistant/core/pull/176701). The parameter no longer has any effect and should be removed from the call.

When the source entity moves to another device, `async_handle_source_entity_changes` now only updates the helper entity to link to the new device, it no longer removes the helper config entry from the old device and adds it to the new one.

Passing the parameter is accepted until Home Assistant Core 2027.8, and logs a warning.

### Cleaning up helper devices

The helper used to clean up a helper integration's devices from a config entry migration step has been renamed from `async_remove_helper_config_entry_from_source_device` to `homeassistant.helpers.helper_integration.async_remove_helper_devices` in core [PR #176714](https://github.com/home-assistant/core/pull/176714). The old name is kept as a deprecated alias which keeps working until Home Assistant Core 2027.8. The new signature is:

```py
def async_remove_helper_devices(
    hass: HomeAssistant,
    *,
    helper_config_entry_id: str,
    source_device_id: str | None,
    sweep_helper_devices: bool = False,
    keep_device_ids: Collection[str] = (),
) -> None:
```

### `helpers.device.async_remove_stale_devices_links_keep_entity_device()` and `async_remove_stale_devices_links_keep_current_device()`

Deprecated in core [PR #176881](https://github.com/home-assistant/core/pull/176881), both are now no-ops. Call `async_remove_helper_devices` with `sweep_helper_devices=True` from the helper's `async_setup_entry` instead:

```py
async_remove_helper_devices(
    hass,
    helper_config_entry_id=entry.entry_id,
    source_device_id=entry.options.get(CONF_DEVICE_ID),
    sweep_helper_devices=True,
)
```

The `template` helper has been migrated as an example in core [PR #176900](https://github.com/home-assistant/core/pull/176900). The functions are removed in Home Assistant Core 2027.8.

## Devices can only have a single config subentry

A device can no longer be tied to more than one config subentry. This is a breaking change without a backwards compatibility shim; integrations which attach several subentries to the same device must create one device per subentry.

### Example: `telegram_bot`

The `telegram_bot` integration has been adjusted for this in core [PR #176606](https://github.com/home-assistant/core/pull/176606), which can be used as an example.

It previously had a single bot device shared by every chat, with each chat's subentry attached to that same device. It now creates an individual device per chat, linked to the bot device as a via device. A config entry migration moves each chat's notify entity onto its own device and strips the chat subentries from the bot device, leaving the bot device with no subentry.

Note that the PR was written before `via_device_id` was added, new code should use `via_device_id` instead of `via_device`.

When [child devices](https://github.com/home-assistant/architecture/discussions/1414) are introduced, integrations which model this with a via device should migrate to child devices instead.

## Linking an entity to a split device

A pre-migration composite device id no longer refers to a real device. Attempting to link an entity to such an id, by passing it to `EntityRegistry.async_get_or_create(device_id=...)` or `EntityRegistry.async_update_entity(device_id=...)`, is ignored with a logged warning rather than applied (core PRs [#176650](https://github.com/home-assistant/core/pull/176650) and [#176886](https://github.com/home-assistant/core/pull/176886)). A new entity is then created with no device, and an existing entity keeps its current device. Passing a genuinely non-existent device id still raises `ValueError` as before.

Entities whose stored device is a composite device with no split owned by the entity's config entry are detached from the device when the registry is loaded, in core [PR #176819](https://github.com/home-assistant/core/pull/176819); the owning integration is expected to re-link them.

Link entities to one of the split devices instead, looking it up with `async_get_device_by_identifier` or `async_get_device_by_connection`.

## Device registry events

Splitting a pre-migration composite device happens when the registry is loaded from storage, before any listeners run, so it emits no `EVENT_DEVICE_REGISTRY_UPDATED` events; devices are already split at startup.

Two things change for integrations which subscribe to `EVENT_DEVICE_REGISTRY_UPDATED`, or use `async_track_device_registry_updated_event`, and inspect the payload:

- The `changes` dict of an `update` event reports a device move with the keys `config_entry_id` and `config_subentry_id`, replacing the previous `config_entries` and `config_entries_subentries`.
- Updating or removing a pre-migration composite device id forwards the operation to each split device, so one event is fired per split device rather than a single event for the composite id.

A device now belongs to a single config entry, so it can no longer lose one config entry while staying around for another. Integrations which previously watched `update` events for a change to the `config_entries` or `config_entries_subentries` keys, typically to detect their config entry being removed from a device shared with another integration, probably only need to handle `remove` events now: a device losing its config entry means the device is removed.

## Backwards compatibility

Splitting devices changes assumptions which custom integrations may rely on, and device ids which are stored in automations and scripts no longer exist as devices. To soften that, the device registry makes a best-effort attempt to keep unmodified custom integrations working, by resolving a pre-migration composite device id to the devices it was split into.

This is best-effort, not a guarantee. The shims can't cover every way a custom integration interacts with the device registry, and an operation which is ambiguous across the split devices can't be applied at all. An AI-assisted analysis of 462 custom integrations interacting directly with the device registry suggests at least 90% are expected to work unaffected, which also means some will not. Please migrate your integration to the new API rather than relying on these shims; they are removed in Home Assistant Core 2027.8.

During the deprecation period:

- `DeviceRegistry.async_get()` synthesizes a read-only restored composite device when passed the id of a pre-migration composite device. Its identifiers, connections and config entries are the union of the split devices'. The synthesis only happens in `async_get()`; interacting with the `devices` container directly, for example `DeviceRegistry.devices.get(device_id)`, does not synthesize a composite and returns `None` for a pre-migration composite device id.
- `DeviceRegistry.async_get_device()` resolves a lookup by identifiers or connections matching several config entries to a single device when possible, preferring the device whose config entry domain matches the looked-up identifier. If the remaining matches are the splits of one pre-migration composite device, a read-only composite spanning them is returned. For independent devices sharing an identifier or connection, a device owned by the calling integration is preferred, falling back to the first match.
- `DeviceRegistry.async_update_device()` and `DeviceRegistry.async_remove_device()` forward the call to each of the split devices. Arguments which rewrite a device's identity or move it are ambiguous across the split devices; they are ignored and reported to the offending integration.
- Entity registry `get_entries_for_device_id()` and `async_entries_for_device()` expand a pre-migration composite device id to the entities of the devices it was split into.
- Actions targeting a pre-migration composite device id trickle down to the split devices.
- User customizations (area, floor, labels, name) are kept when a device is split.

A new method `DeviceRegistry.async_get_devices_for_composite_device_id()` returns the devices a pre-migration composite device was split into. `DeviceRegistry.async_is_composite_device_id()` returns whether a device id is a pre-migration composite device id, that is, an id which was split into one device per config entry and no longer refers to a registered device; it is added in core [PR #176923](https://github.com/home-assistant/core/pull/176923).
