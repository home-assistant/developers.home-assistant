---
title: "Integration quality scale"
---

The Integration Quality Scale scores each integration based on the code quality and user experience. Each level of the quality scale consists of a list of requirements. If an integration matches all requirements, it's considered to have reached that level.

:::info
Suggestions for changes can be done by creating an issue in the [architecture repo](https://github.com/home-assistant/architecture/discussions).
:::

## No score

This integration passes the bare minimum requirements to become part of the index.

- Satisfy all requirements for [creating components](creating_component_code_review.md) and [creating platforms](creating_platform_code_review.md).
- Configurable via `configuration.yaml`

## Silver 🥈

This integration can be set up via the user interface and is able to cope when things go wrong. It will not print any exceptions nor will it fill the log with retry attempts.

- Satisfying all No score level requirements.
- Configuration:
  - Configuration is done using config entries and data is stored in `config_entry.runtime_data`.
  - Raise [`ConfigEntryNotReady`](integration_setup_failures.md) if unable to connect during platform setup (if appropriate)
- Devices and entities:
  - Set an appropriate `SCAN_INTERVAL` (if a polling integration)
  - Handles internet unavailable. Log a warning once when unavailable, log once when reconnected.
  - Handles device/service unavailable. Log a warning once when unavailable, log once when reconnected.
  - Set `available` property to `False` if appropriate ([docs](core/entity.md#generic-properties))
  - Entities have unique ID (if available) ([docs](entity_registry_index.md#unique-id-requirements))
- Services:
  - Operations like service calls and entity methods (e.g. *Set HVAC Mode*) have proper exception handling. Raise `ServiceValidationError` on invalid user input and raise `HomeAssistantError` for other failures such as a problem communicating with a device. [Read more](/docs/core/platform/raising_exceptions) about raising exceptions.
- Tests:
  - Full test coverage for the config flow

## Gold 🥇

This is a solid integration that offers the best possible user experience that Home Assistant has to offer.

- Satisfying all Silver level requirements.
- Configuration:
  - Don't allow configuring already configured device/service (example: no 2 entries for same hub). If possible, set a unique ID on the config flow.
  - [Discoverable](config_entries_config_flow_handler.md#discovery-steps) (if available)
  - Support config entry [unloading](config_entries_index.md#unloading-entries) and [removal](config_entries_index.md#removal-of-entries)
  - Handles expiration of auth credentials. Refresh if possible or print correct error and fail setup. If based on a config entry, should trigger a new config entry flow to re-authorize.  ([docs](integration_setup_failures.md))
- Devices and entities:
  - Entities have [device info](device_registry_index.md#defining-devices) and uses [`has_entity_name = True`](./core/entity.md#has_entity_name-true-mandatory-for-new-integrations)
  - Entities have correct device classes where appropriate ([docs](core/entity.md#generic-properties))
  - Supports entities being disabled and leverages `Entity.entity_registry_enabled_default` to disable less popular entities ([docs](core/entity.md#advanced-properties))
  - If the device/service API can remove entities, the integration should make sure to clean up the entity and device registry.
  - Entities only subscribe to updates inside `async_added_to_hass` and unsubscribe via `self.async_on_remove` or inside `async_will_remove_from_hass` ([docs](core/entity.md#lifecycle-hooks))
  - Set appropriate `PARALLEL_UPDATES` constant ([docs](integration_fetching_data.md#request-parallelism))
- Tests
  - Above average test coverage for all integration modules
  - Tests for fetching data from the integration and controlling it ([docs](development_testing.md))
- Has a code owner ([docs](creating_integration_manifest.md#code-owners))
- Implement the diagnostics platform with sensitive information redacted (if appropriate)

## Platinum 🏆

Best of the best. The integration implements all the best Home Assistant performance best practices. Integrations that reach platinum level will require approval by the code owner for each PR.

- Satisfying all Gold level requirements.
- Integration + dependency are async ([docs](asyncio_working_with_async.md))
- Uses aiohttp or httpx and allows passing in websession (if making HTTP requests)

## Internal 🏠

Integrations which are part of Home Assistant are not rated but marked as **internal**.
