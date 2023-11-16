---
title: "Integration Quality Scale"
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

This integration is able to cope when things go wrong. It will not print any exceptions nor will it fill the log with retry attempts.

- Satisfying all No score level requirements.
- Connection/configuration is handled via a component.
- Set an appropriate `SCAN_INTERVAL` (if a polling integration)
- Raise [`PlatformNotReady`](integration_setup_failures.md/#integrations-using-async_setup_platform) if unable to connect during platform setup (if appropriate)
- Handles expiration of auth credentials. Refresh if possible or print correct error and fail setup. If based on a config entry, should trigger a new config entry flow to re-authorize.  ([docs](config_entries_config_flow_handler.md#reauthentication))
- Handles internet unavailable. Log a warning once when unavailable, log once when reconnected.
- Handles device/service unavailable. Log a warning once when unavailable, log once when reconnected.
- Operations like service calls and entity methods (e.g. *Set HVAC Mode*) have proper exception handling. Raise `ServiceValidationError` on invalid user input and raise `HomeAssistantError` for other failures such as a problem communicating with a device. [Read more](/docs/core/platform/raising_exceptions) about handling exceptions.
- Set `available` property to `False` if appropriate ([docs](core/entity.md#generic-properties))
- Entities have unique ID (if available) ([docs](entity_registry_index.md#unique-id-requirements))

## Gold 🥇

This is a solid integration that is able to survive poor conditions and can be configured via the user interface.

- Satisfying all Silver level requirements.
- Configurable via config entries.
  - Don't allow configuring already configured device/service (example: no 2 entries for same hub)
  - Discoverable (if available)
  - Set unique ID in config flow (if available)
  - Raise [`ConfigEntryNotReady`](integration_setup_failures.md/#integrations-using-async_setup_entry) if unable to connect during entry setup (if appropriate)
- Entities have device info (if available) ([docs](device_registry_index.md#defining-devices))
- Tests
  - Full test coverage for the config flow
  - Above average test coverage for all integration modules
  - Tests for fetching data from the integration and controlling it ([docs](development_testing.md))
- Has a code owner ([docs](creating_integration_manifest.md#code-owners))
- Entities only subscribe to updates inside `async_added_to_hass` and unsubscribe inside `async_will_remove_from_hass` ([docs](core/entity.md#lifecycle-hooks))
- Entities have correct device classes where appropriate ([docs](core/entity.md#generic-properties))
- Supports entities being disabled and leverages `Entity.entity_registry_enabled_default` to disable less popular entities ([docs](core/entity.md#advanced-properties))
- If the device/service API can remove entities, the integration should make sure to clean up the entity and device registry.
- When communicating with a device or service, the integration implements the diagnostics platform which redacts sensitive information.

## Platinum 🏆

Best of the best. The integration is completely async, meaning it's super fast. Integrations that reach platinum level will require approval by the code owner for each PR.

- Satisfying all Gold level requirements.
- Set appropriate `PARALLEL_UPDATES` constant ([docs](integration_fetching_data.md#request-parallelism))
- Support config entry unloading (called when config entry is removed)
- Integration + dependency are async ([docs](asyncio_working_with_async.md))
- Uses aiohttp or httpx and allows passing in websession (if making HTTP requests)
- [Handles expired credentials](integration_setup_failures.md/#handling-expired-credentials) (if appropriate)

## Internal 🏠

Integrations which are part of Home Assistant are not rated but marked as **internal**.
