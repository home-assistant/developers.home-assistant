---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Device registry WebSocket API changes"
---

## Summary

This post describes changes to the device registry **WebSocket API** — the commands and device serialization consumed by the frontend, custom cards, and other WebSocket clients. They stem from two changes to the device registry:

- **Restricting each device to a single config entry** (Home Assistant Core 2026.8). The Python API side of this change is described in the companion post [Devices are restricted to a single config entry and at most one subentry](/blog/2026/07/21/device-registry-single-config-entry).
- **Introducing [child devices](#child-devices-in-the-device-list)** (Home Assistant Core 2026.9, [architecture proposal #1414](https://github.com/home-assistant/architecture/discussions/1414)).

Most clients only read devices through `config/device_registry/list`, and the new device fields are additive, so no changes are required to keep working — but clients that iterate the device list should be ready to encounter child devices, which are serialized differently. Clients that remove devices, or that inspect a device's config entries, should read on.

## New device fields: `config_entry_id` and `config_subentry_id`

Every device returned by `config/device_registry/list`, and every device in an `EVENT_DEVICE_REGISTRY_UPDATED` payload, now carries two new fields:

- `config_entry_id` — the id of the single config entry the device belongs to.
- `config_subentry_id` — the id of the single config subentry the device belongs to, or `null`.

They replace the previous fields, which modelled a device that could span several config entries and subentries:

- `config_entries` — a list of config entry ids.
- `config_entries_subentries` — a map of config entry id to a list of subentry ids.
- `primary_config_entry` — the id of the device's primary config entry.

The old fields are **kept for backwards compatibility and are deprecated**; they are scheduled for removal in Home Assistant Core 2027.8. During the deprecation period they are derived from the new values: a device reports `config_entries` as the single-element list `[config_entry_id]`, `config_entries_subentries` as `{config_entry_id: [config_subentry_id]}`, and `primary_config_entry` equal to `config_entry_id`.

Update your client to read `config_entry_id` and `config_subentry_id`.

## Child devices in the device list {#child-devices-in-the-device-list}

Home Assistant Core 2026.9 introduces **child devices** ([architecture proposal #1414](https://github.com/home-assistant/architecture/discussions/1414), core [PR #178666](https://github.com/home-assistant/core/pull/178666)). A child device is a lightweight logical part of a parent device: it has no hardware or firmware metadata of its own, and it references its parent through a `parent_device_id`. The parent must be registered by the same config entry and belong to the same config subentry.

`config/device_registry/list` now returns child devices alongside regular devices, so its result is a mix of two kinds of entry. A child device is serialized with a smaller set of fields:

```json
{
  "id": "child1234",
  "parent_device_id": "abcd1234",
  "config_entry_id": "wxyz5678",
  "config_subentry_id": null,
  "area_id": null,
  "name": "Left channel",
  "name_by_user": null,
  "labels": [],
  "identifiers": [["demo", "left"]],
  "disabled_by": null,
  "created_at": 1723987200.0,
  "modified_at": 1723987200.0
}
```

Compared to a regular device, a child device has **no** `connections`, `via_device_id`, `configuration_url`, `entry_type`, `manufacturer`, `model`, `model_id`, `hw_version`, `sw_version`, `serial_number`, `primary_config_entry`, `config_entries`, or `config_entries_subentries`. Clients that read the device list must not assume every entry carries these fields.

The reliable way to tell the two apart is the `parent_device_id` field: it is present and non-null only on child devices. A regular device carries `via_device_id` instead.

A child device with no `area_id` of its own inherits its parent's area, so a client resolving a child device's area should fall back to the parent device when the child's `area_id` is `null`.

Two related commands also understand child devices:

- `config/device_registry/update` accepts a child device id — setting `area_id`, `disabled_by`, `labels`, or `name_by_user` — and returns the updated child device in the reduced serialization shown above.
- `config/device_registry/list_linked_devices` always returns an empty `linked_devices` list for a child device, since a child shares its parent's per-config-entry identifier namespace and is never linked to devices of other config entries.

## New command: `config/device_registry/remove`

A new WebSocket command removes a device by id:

```json
{
  "type": "config/device_registry/remove",
  "device_id": "abcd1234"
}
```

Because a device now belongs to exactly one config entry, removing it from that config entry removes the device. The command requires admin, and it rejects a [composite device id](#composite-devices) with the error `Cannot remove a composite device`.

It replaces `config/device_registry/remove_config_entry`, which took both a `device_id` and a `config_entry_id`:

```json
{
  "type": "config/device_registry/remove_config_entry",
  "config_entry_id": "wxyz5678",
  "device_id": "abcd1234"
}
```

That command still works but is **deprecated**: it logs a warning and will be removed in Home Assistant Core 2027.9. Its `config_entry_id` parameter is now only used to check that it matches the device's config entry — a mismatch fails with `Config entry not in device` — and the device is removed regardless of which config entry was passed. Update clients to call `config/device_registry/remove` and drop the `config_entry_id`.

Implemented in core [PR #178319](https://github.com/home-assistant/core/pull/178319).

## New command: `config/device_registry/list_linked_devices`

Because connections and identifiers are now unique per config entry, a physical device supported by several integrations is represented by one device per config entry instead of a single shared device. This command returns the other devices that share a connection or identifier with a given device — the sibling devices representing the same physical hardware under different config entries:

```json
{
  "type": "config/device_registry/list_linked_devices",
  "device_id": "abcd1234"
}
```

Result:

```json
{
  "linked_devices": ["ef567890", "12ab34cd"]
}
```

The queried device itself is excluded from the result. This lets a client, for example, link from a device page to the other devices that represent the same hardware. Implemented in core [PR #177449](https://github.com/home-assistant/core/pull/177449).

## New command: `config/device_registry/list_composite_splits` {#composite-devices}

When the device registry is loaded, each pre-migration device that spanned several config entries is split into one device per config entry, and the original ("composite") device id no longer refers to a registered device. Composite device ids are still referenced by automations, scripts, dashboards, and target pickers, so this command maps every composite device id to the devices it was split into:

```json
{
  "type": "config/device_registry/list_composite_splits"
}
```

Result:

```json
{
  "old_composite_id": {
    "split_ids": ["ef567890", "12ab34cd"],
    "primary_id": "ef567890"
  }
}
```

For each composite device id, `split_ids` lists the replacement device ids and `primary_id` is the split that inherited the composite's former primary config entry, or `null`. Use it to resolve a stored composite device id to a current device — for example, to keep a device picker working when the stored id is a composite id. Implemented in core [PR #176693](https://github.com/home-assistant/core/pull/176693).

The [Backwards compatibility](/blog/2026/07/21/device-registry-single-config-entry#backwards-compatibility) section of the companion post describes the rest of the deprecation-period behavior, such as actions targeting a composite device id trickling down to the split devices.

## Device registry events

Clients that subscribe to `device_registry_updated` events (`EVENT_DEVICE_REGISTRY_UPDATED`) see two changes, mirroring the Python API:

- The `changes` map of an `update` event reports a device move with the keys `config_entry_id` and `config_subentry_id`, replacing the previous `config_entries` and `config_entries_subentries`.
- A device now belongs to a single config entry, so it can no longer lose one config entry while remaining for another. A device losing its config entry is now a `remove` event rather than an `update`.

See [Device registry events](/blog/2026/07/21/device-registry-single-config-entry#device-registry-events) in the companion post for details.
