---
title: "Integration Quality Scale"
---

The Integration Quality Scale scores each integration based on the code quality and user experience. Each level of the quality scale consists of a list of requirements. If an integration matches all requirements, it's considered to have reached that level.

:::info
Suggestions for changes can be done by creating an issue in the [architecture repo](https://github.com/home-assistant/architecture/issues/).
:::

## No score

This integration passes the bare minimum requirements to become part of the index.

- Satisfy all requirements for [creating components](creating_component_code_review.md) and [creating platforms](creating_platform_code_review.md).
- Configurable via `configuration.yaml`

## Silver 🥈

This integration is able to cope when things go wrong. It will not print any exceptions nor will it fill the log with retry attempts.

- Connection/configuration is handled via a component.
- Set an appropriate `SCAN_INTERVAL` (if a polling integration)
- Raise `PlatformNotReady` if unable to connect during platform setup (if appropriate)
- Handles expiration of auth credentials. Refresh if possible or print correct error and fail setup. If based on a config entry, should trigger a new config entry flow to re-authorize.
- Handles internet unavailable. Log a warning once when unavailable, log once when reconnected.
- Handles device/service unavailable. Log a warning once when unavailable, log once when reconnected.
- Set `available` property to `False` if appropriate ([docs](core/entity.md#generic-properties))
- Entities have unique ID (if available) ([docs](entity_registry_index.md#unique-id-requirements))

## Gold 🥇

This is a solid integration that is able to survive poor conditions and can be configured via the user interface.

- Configurable via config entries.
  - Don't allow configuring already configured device/service (example: no 2 entries for same hub)
  - Tests for the config flow
  - Discoverable (if available)
  - Set unique ID in config flow (if available)
- Entities have device info (if available) ([docs](device_registry_index.md#defining-devices))
- Tests for fetching data from the integration and controlling it ([docs](development_testing.md))
- Has a code owner ([docs](creating_integration_manifest.md#code-owners))
- Entities only subscribe to updates inside `async_added_to_hass` and unsubscribe inside `async_will_remove_from_hass` ([docs](core/entity.md#lifecycle-hooks))
- Entities have correct device classes where appropriate ([docs](core/entity.md#generic-properties))
- Supports entities being disabled and leverages `Entity.entity_registry_enabled_default` to disable less popular entities ([docs](core/entity.md#advanced-properties))
- If the device/service API can remove entities, the integration should make sure to clean up the entity and device registry.

## Platinum 🏆

Best of the best. The integration is completely async, meaning it's super fast. Integrations that reach platinum level will require approval by the code owner for each PR.

- Set appropriate `PARALLEL_UPDATES` constant
- Support config entry unloading (called when config entry is removed)
- Integration + dependency are async
- Uses aiohttp and allows passing in websession (if making HTTP requests)

## Internal 🏠

Integrations which are part of Home Assistant are not rated but marked as **internal**.
