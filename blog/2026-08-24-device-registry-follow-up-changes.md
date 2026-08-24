---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "More device registry deprecations, new helpers and validation"
---

## Summary

This is a follow-up to [Devices are restricted to a single config entry and at most one subentry](/blog/2026/07/21/device-registry-single-config-entry), and covers additional device registry deprecations, a few new helper methods, and some stricter validation that landed after that post.

**Most custom integrations won't be affected by this set of changes.** Read on if your integration sets `via_device` or `default_manufacturer` / `default_model` / `default_name` in `DeviceInfo`, looks devices up in the registry, reads the registry's `devices`, `deleted_devices` or `child_devices` containers, calls `async_update_device` directly, or attaches a device to an entity that has no config entry or unique id.

Unless noted otherwise, deprecated functionality logs a warning at runtime and remains supported until Home Assistant Core 2027.8. As before, deprecations which are only relevant to core and core integrations are enforced more strictly there: those callers raise immediately, while custom integrations keep getting a warning until the removal version.

<!--truncate-->

## `via_device` follow-ups

The previous post deprecated `DeviceInfo["via_device"]` and `DeviceRegistry.async_get_or_create(via_device=...)` in favor of `via_device_id`, because identifiers are only unique per config entry and no longer point at a single device. A few related changes build on that.

### Looking up a via device id: `async_get_device_id_by_identifier()`

To set `via_device_id` you need the device id of the via device. The new helper `homeassistant.helpers.device_registry.async_get_device_id_by_identifier()` looks it up, scoped to the config entry that owns the via device:

```py
@callback
def async_get_device_id_by_identifier(
    hass: HomeAssistant, identifier: tuple[str, str], *, config_entry_id: str
) -> str:
```

```py
via_device_id=dr.async_get_device_id_by_identifier(
    hass, (DOMAIN, hub_serial_number), config_entry_id=entry.entry_id
)
```

The lookup is unambiguous because identifiers are unique within a config entry. It raises `ValueError` if no matching device exists, so only call it once the via device has been created. When your integration creates the via device itself, skip the lookup and read `.id` from the `DeviceEntry` that `async_get_or_create` returned for it.

This helper was added in core [PR #177494](https://github.com/home-assistant/core/pull/177494), which also migrated a number of integrations from `via_device` to `via_device_id` as examples.

### `via_device` removed from the `DeviceInfo` type, and `ATTR_VIA_DEVICE` deprecated

Two typing-level follow-ups from core [PR #178465](https://github.com/home-assistant/core/pull/178465):

- `via_device` has been removed from the `DeviceInfo` `TypedDict`. A `DeviceInfo` literal that still sets `via_device` is now a typing error; use `via_device_id`.
- The constant `homeassistant.const.ATTR_VIA_DEVICE` is deprecated. Importing it logs a warning; use the string `"via_device_id"` instead. It is removed in Home Assistant Core 2027.8.

The same PR also escalates the enforcement of the deprecations announced in the previous post — `DeviceRegistry.async_get_device()`, passing `via_device` to `async_get_or_create()`, and the `add_config_entry_id` / `add_config_subentry_id` / `remove_config_entry_id` / `remove_config_subentry_id` parameters of `async_update_device()`. Core and core integrations now raise `RuntimeError` when calling these, while custom integrations continue to log a warning until Home Assistant Core 2027.8.

### A device can't be its own via device

A device may no longer set itself as its own via device (core [PR #178194](https://github.com/home-assistant/core/pull/178194)):

- Passing `via_device_id` equal to the device's own id to `async_get_or_create()` or `async_update_device()` raises `HomeAssistantError`.
- Passing the deprecated `via_device` referencing the device itself is ignored and logged now, and will raise from Home Assistant Core 2027.8.

The device registry storage is bumped to version 3.3 (introduced in Home Assistant Core 2026.8), which clears any existing `via_device_id` self-references on load. Integrations which previously worked around this by clearing the self-reference themselves can drop that code.

## `async_update_device()`: `merge_connections` and `merge_identifiers` deprecated

Passing `merge_connections` or `merge_identifiers` to `DeviceRegistry.async_update_device()` is deprecated in core [PR #178888](https://github.com/home-assistant/core/pull/178888). These parameters only add to the device's existing connections or identifiers; compute the full desired set yourself and pass it as `new_connections` or `new_identifiers` instead.

Core and core integrations raise `RuntimeError` when passing the merge parameters; custom integrations log a warning until Home Assistant Core 2027.9 (note this removal is one release later than the others).

## Finding a device's config entry for a domain: `async_get_device_and_config_entry_for_domain()`

A common pattern was to fetch a device and loop over its `config_entries` to find the config entry belonging to a given integration. Since `DeviceEntry.config_entries` is deprecated, core [PR #178991](https://github.com/home-assistant/core/pull/178991) adds a helper that does this directly:

```py
@callback
def async_get_device_and_config_entry_for_domain(
    hass: HomeAssistant, device_id: str, *, domain: str
) -> tuple[DeviceEntry | None, ConfigEntry | None]:
```

```py
device, config_entry = dr.async_get_device_and_config_entry_for_domain(
    hass, device_id, domain=DOMAIN
)
```

It returns `(None, None)` for an unknown or child-device id, and `(device, None)` when a main device exists but no config entry of `domain` owns it. For a pre-migration composite id it returns a matching split device and its config entry, or the restored composite device and `None` when no split matches. The helper does not check whether the config entry is loaded, so keep your own `ConfigEntryState.LOADED` check if you need one.

## The `devices`, `deleted_devices` and `child_devices` containers are protected

The `DeviceRegistry.devices`, `DeviceRegistry.deleted_devices` and `DeviceRegistry.child_devices` attributes used to be dictionaries keyed by device id, and integrations sometimes read them directly — `registry.devices.get(device_id)`, `registry.devices.values()`, or `device_id in registry.devices`. The backing containers are now protected, and the public attributes are narrowed to what an integration legitimately needs.

`devices` (core [PR #179578](https://github.com/home-assistant/core/pull/179578)) is now a read-only collection of the registered devices. Iterating it yields the `DeviceEntry` values directly, and `len()` and value membership (`device_entry in registry.devices`) work as expected. Using it as a mapping — subscription, `.get()`, `.values()`, `.keys()`, or membership by device id (`device_id in registry.devices`) — is deprecated. The mapping surface keeps working as a backwards compatibility shim: core and core integrations raise `RuntimeError`, while custom integrations only log a warning. It is removed in Home Assistant Core 2027.9.

In practice, iterate with `for device in registry.devices` instead of `registry.devices.values()`, and look a device up by id with `registry.async_get(device_id)` instead of `registry.devices.get(device_id)`.

`child_devices` (core [PR #179713](https://github.com/home-assistant/core/pull/179713)) is now a read-only collection of the child devices. It follows the container protocol — you can iterate it (it yields the child device entries), take its `len()`, and test value membership — and offers no dictionary-style access at all: there is no `.get()` or `.values()` and no lookup by device id. There is no backwards compatibility shim.

`deleted_devices` (core [PR #179720](https://github.com/home-assistant/core/pull/179720)) is an internal implementation detail of the device registry, and the whole attribute is now deprecated — there is no supported public use. Accessing it in any way is deprecated: core and core integrations raise `RuntimeError`, while custom integrations only log a warning. It is removed in Home Assistant Core 2027.9.

### Testing what kind of device an id refers to

With direct container access going away, `DeviceRegistry.async_get` gains an `include_composite_devices` parameter to test what an id refers to (core [PR #179594](https://github.com/home-assistant/core/pull/179594)). With `include_composite_devices=False`, a pre-migration composite device id resolves to `None`:

```py
is_composite = (
    registry.async_get(device_id) is not None
    and registry.async_get(device_id, include_composite_devices=False) is None
)
```

This complements the existing `include_child_devices` and `include_main_devices` parameters, which similarly resolve — or exclude — child and main devices. `DeviceRegistry.async_is_composite_device_id`, introduced in the previous post, is now redundant and deprecated in the same PR; use `async_get` with `include_composite_devices=False` instead. It keeps working — core and core integrations raise `RuntimeError`, while custom integrations only log a warning — until Home Assistant Core 2027.9.

## Attaching a device to an entity requires a config entry and a unique id

An entity may only attach a device if it has a unique id and belongs to a config entry. Attempting to attach a device from an entity without a config entry, or without a unique id, is now caught in `entity_platform` (core [PR #177459](https://github.com/home-assistant/core/pull/177459)): the device link is dropped and a warning is logged. This is only a warning for now, and will raise from Home Assistant Core 2027.8.

Note that the device link is already dropped today, even though the raise only lands in 2027.8 — an affected entity ends up with no device until it is given a unique id and a config entry.

## Device info types are removed

The device registry used to classify each `DeviceInfo` as one of a fixed set of "device info types" (link, primary, secondary) based on which keys it contained. This existed to guess the primary integration for a device shared across several config entries, which is obsolete now that a device is owned by a single config entry. The classification is removed and replaced by lighter validation in core [PR #179397](https://github.com/home-assistant/core/pull/179397), with the following developer-visible consequences:

- `DeviceInfo` shapes that previously didn't match any type are now accepted. The old error *"device info needs to either describe a device, link to existing device or provide extra information"* is gone; a `DeviceInfo` still needs at least one of `identifiers` or `connections`.
- Passing both a field and its `default_` counterpart — for example both `name` and `default_name`, or `model` and `default_model` — now raises `DeviceInfoError`.
- When a new device is created without a name, it now defaults to the config entry title for **all** device infos, not just those that were previously classified as primary. This can change the composed name of entities on devices that previously had no name.

## `default_manufacturer`, `default_model` and `default_name` are deprecated

The `default_manufacturer`, `default_model` and `default_name` members of `DeviceInfo` are deprecated in core [PR #179549](https://github.com/home-assistant/core/pull/179549). Pass the plain `manufacturer`, `model` and `name` fields instead.

These `default_` fields let an integration that wasn't considered the primary one for a shared device suggest a name, manufacturer or model without overwriting the value set by the primary integration. A device now belongs to a single config entry, so there is no longer a primary integration to defer to, and the plain fields can be set directly.

The three fields have been removed from the `DeviceInfo` type, so setting them is a typing error, and passing any of them to `async_get_or_create` logs a warning. As with the other device registry deprecations, core and core integrations raise `RuntimeError`, while custom integrations keep working with a warning until Home Assistant Core 2027.9.

Entities which set these fields — device trackers, for example, set `default_name` — should pass the non-default variant instead:

```py
# Before
DeviceInfo(
    connections={(CONNECTION_NETWORK_MAC, mac)},
    default_name=f"Device {mac}",
)
# After
DeviceInfo(
    connections={(CONNECTION_NETWORK_MAC, mac)},
    name=f"Device {mac}",
)
```

## More examples

The changes above land alongside a large number of per-integration adaptations — migrating to `via_device_id`, using the new lookup helpers, and removing device self-references — which can serve as further examples. Search the core repository for pull requests referencing these APIs if you need a concrete migration to follow.
