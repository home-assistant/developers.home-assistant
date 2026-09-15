---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "`DeviceEntry.config_entries` deprecation is now enforced"
---

## Summary

The device registry's multi-config-entry compatibility properties — `DeviceEntry.config_entries`, `DeviceEntry.config_entries_subentries` and `DeviceEntry.primary_config_entry` — were announced as deprecated in [Devices are restricted to a single config entry and at most one subentry](/blog/2026/07/21/device-registry-single-config-entry), but reading them was still silent. They now report at runtime: core and core integrations raise `RuntimeError`, custom integrations log a warning.

Use `DeviceEntry.config_entry_id` and `DeviceEntry.config_subentry_id` instead. The properties remain available to custom integrations until Home Assistant Core 2027.10, two releases later than the 2027.8 given in the earlier post.

Reading the properties on a synthesized composite device is not deprecated and does not report, because such a device really does span several config entries.

**Most integrations don't read these properties and don't need any changes.** Read on if your integration inspects a device's config entries, or accesses them on a deleted or child device.

This is implemented in core [PR #181949](https://github.com/home-assistant/core/pull/181949) and lands in Home Assistant Core 2026.10.

<!--truncate-->

## What reports, and what to use instead

| Deprecated | Replacement |
| --- | --- |
| `DeviceEntry.config_entries` | `DeviceEntry.config_entry_id` |
| `DeviceEntry.config_entries_subentries` | `DeviceEntry.config_entry_id` and `DeviceEntry.config_subentry_id` |
| `DeviceEntry.primary_config_entry` | `DeviceEntry.config_entry_id` |

As with the other device registry deprecations, the enforcement is stricter inside core: a core or core integration caller raises `RuntimeError` immediately, while a custom integration keeps working with a logged warning until Home Assistant Core 2027.10.

## Migrating

A device belongs to exactly one config entry and at most one config subentry, so each of the shims collapses to a plain attribute read:

```py
# Before
entry_id = device.primary_config_entry
# After
entry_id = device.config_entry_id
```

```py
# Before
if config_entry.entry_id in device.config_entries:
    ...
# After
if device.config_entry_id == config_entry.entry_id:
    ...
```

```py
# Before
for entry_id, subentry_ids in device.config_entries_subentries.items():
    for subentry_id in subentry_ids:
        ...
# After
entry_id = device.config_entry_id
subentry_id = device.config_subentry_id
```

If you loop over a device's config entries to find the one belonging to your integration, use the `async_get_device_and_config_entry_for_domain()` helper introduced in [More device registry deprecations, new helpers and validation](/blog/2026/08/24/device-registry-follow-up-changes) instead:

```py
device, config_entry = dr.async_get_device_and_config_entry_for_domain(
    hass, device_id, domain=DOMAIN
)
```

Core's own test suite was migrated off the properties in core [PR #181945](https://github.com/home-assistant/core/pull/181945), which can serve as a set of examples.

## Composite devices are exempt

The properties are not deprecated for a synthesized composite device — the read-only device `DeviceRegistry.async_get()` returns for a pre-migration composite device id, as described in [Backwards compatibility](/blog/2026/07/21/device-registry-single-config-entry#backwards-compatibility). Such a device spans several config entries, which `config_entry_id` and `config_subentry_id` can't represent, so the three properties are the correct API for it and reading them does not report, for any caller.

The exemption is keyed on `DeviceEntry.is_composite_device`, which code handling both kinds of device can branch on. Core's `device_automation` integration is a genuine example: the device ids passed to `async_get_device_automations()` come from automations, scripts and the frontend, so they can still be pre-migration composite ids, and listing a device's automations needs the domain of every config entry owning it:

```py
# homeassistant/components/device_automation/__init__.py
if (device := device_registry.async_get(device_id)) is None:
    raise DeviceNotFound
if device.is_composite_device:
    entry_ids = device.config_entries
else:
    entry_ids = {device.config_entry_id}
for entry_id in entry_ids:
    if config_entry := hass.config_entries.async_get_entry(entry_id):
        domain_devices.setdefault(config_entry.domain, set()).add(device_id)
```

Note that this is only needed for code which deliberately accepts a stored device id that may predate the migration. Code that only ever handles devices it registered itself should read `config_entry_id` unconditionally.

## Deleted devices

`DeletedDeviceEntry.config_entries` and `DeletedDeviceEntry.config_entries_subentries` are deprecated and report on the same terms. A deleted device is never a composite, so there is no exemption — every read reports.

Use `DeletedDeviceEntry.config_entry_id` and `DeletedDeviceEntry.config_subentry_id`. Both are `None` for an orphaned deleted device, that is, one whose owning config entry has been removed; the deprecated properties represented that case as an empty set and an empty dict.

## Child devices

`ChildDeviceEntry` inherits the three properties, and a child device is never a composite either, so reading them on a child device always reports. A child device belongs to the same config entry and subentry as its parent, both available as `config_entry_id` and `config_subentry_id`.

## The WebSocket API and stored data are unaffected

This change only concerns the Python properties. A regular device is serialized as before — `config/device_registry/list`, the `EVENT_DEVICE_REGISTRY_UPDATED` payload and the device registry storage still carry the `config_entries`, `config_entries_subentries` and `primary_config_entry` fields, computed internally without reporting — so WebSocket clients are not affected and see no new warnings. Child devices never carried these fields in the first place.

Those fields are deprecated on their own schedule, described in [Device registry WebSocket API changes](/blog/2026/08/19/device-registry-websocket-api-changes#new-device-fields-config_entry_id-and-config_subentry_id).
