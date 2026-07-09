# Developer Docs vs. Home Assistant Core — Audit Findings

Comparison of the developer documentation (`developers.home-assistant/docs/`) against the current Home Assistant Core source (`homeassistant/`). Each finding lists the doc location, what core actually does, and the nature of the mismatch. Line numbers refer to the state of the repos at audit time.

Scope covered: entity docs, core platform/integration docs, registries & config/data-entry flow, dev-101 & integration guides, manifest/discovery/Bluetooth, REST/WebSocket/auth/intent APIs, and the Supervisor & core dev-environment setup docs.

## Entity documentation (`docs/core/entity/`)

### text.md — `native_max` default is wrong (high)
- **Doc** (`docs/core/entity/text.md:17`): `native_max | int | 100 | The maximum number of characters...`
- **Core** (`homeassistant/components/text/__init__.py:111`): `native_max: int = MAX_LENGTH_STATE_STATE`, and `MAX_LENGTH_STATE_STATE = 255` (`homeassistant/const.py:61`).
- **Issue**: The documented default is `100`; the real default is `255`.

### todo.md — `TodoItemStatus` member misnamed (high)
- **Doc** (`docs/core/entity/todo.md:114`, also `:117`): describes the status as `NEEDS_ACTION` or `COMPLETE`.
- **Core** (`homeassistant/components/todo/const.py:54`): the enum member is `COMPLETED = "completed"`, not `COMPLETE`.
- **Issue**: The completed status is named `COMPLETED`.

### wake_word.md — multiple API mismatches (high)
- **`supported_wake_words` is a method, not a property**: Doc (`docs/core/entity/wake_word.md:16-18`) lists a required property `supported_wake_words | list[WakeWord]`. Core (`homeassistant/components/wake_word/__init__.py:93`) defines `async def get_supported_wake_words(self) -> list[WakeWord]`.
- **Audio tuple order reversed**: Doc (`:39`) says tuples are `(timestamp, audio_chunk)`. Core (`wake_word/__init__.py:98`) uses `AsyncIterable[tuple[bytes, int]]`, i.e. `(audio_chunk, timestamp)`. (The doc's own code sample at `:31` shows `tuple[bytes, int]`, contradicting its prose.)
- **`ww_id` field name wrong**: Doc (`:18`, `:45-46`) refers to `ww_id`. Core uses `WakeWord.id` and `DetectionResult.wake_word_id` (`wake_word/models.py`); there is no `ww_id`.
- **Process method signature missing `wake_word_id`** (medium): Doc (`:30-32`) shows `async_process_audio_stream(self, stream)`; core (`wake_word/__init__.py:105-106`) is `(self, stream, wake_word_id: str | None)`, and the method meant to be overridden is `_async_process_audio_stream`.

### ai-task.md — `GenDataTask` field/type wrong (high)
- **`task_name` should be `name`**: Doc (`docs/core/entity/ai-task.md:69`) lists `task_name` on the `GenDataTask` object. Core (`homeassistant/components/ai_task/task.py:247`) names the dataclass field `name` (the `GenImageTask` table at `:101` correctly uses `name`).
- **`attachments` type wrong**: Doc (`:72`) says `list[PlayMediaWithId]`. Core (`ai_task/task.py:256`) is `attachments: list[conversation.Attachment] | None`.

### conversation.md — `continue_conversation` on wrong object (high)
- **Doc** (`docs/core/entity/conversation.md:71`): lists `continue_conversation` as a field of `ConversationInput`.
- **Core** (`homeassistant/components/conversation/models.py:80`): `continue_conversation` is a field of `ConversationResult` (output), not `ConversationInput` (input).

### tts.md — `async_get_supported_voices` return type wrong (high)
- **Doc** (`docs/core/entity/tts.md:34`): `-> list[str] | None`.
- **Core** (`homeassistant/components/tts/entity.py:101`): `-> list[Voice] | None`.

### device-tracker.md — outdated import paths (high)
- **Doc** (`docs/core/entity/device-tracker.md:16`, `:39`, `:67`): tells integrations to derive from `homeassistant.components.device_tracker.config_entry.BaseScannerEntity` / `.ScannerEntity` / `.TrackerEntity`.
- **Core**: `homeassistant/components/device_tracker/config_entry.py` now defines only *deprecated aliases* (`_DEPRECATED_ScannerEntity`, `_DEPRECATED_TrackerEntity`, …, removal 2027.6) and does not export `BaseScannerEntity` at all; the current classes live at `homeassistant.components.device_tracker.<X>` (re-exported from `.entity`).

### stt.md — `async_process_audio_stream` signature/return wrong (medium)
- **Doc** (`docs/core/entity/stt.md:35`): `async def async_process_audio_stream(self) -> None:`.
- **Core** (`homeassistant/components/stt/__init__.py:233-236`): `async def async_process_audio_stream(self, metadata: SpeechMetadata, stream: AsyncIterable[bytes]) -> SpeechResult`.

### water-heater.md — `supported_features` default/type wrong (medium)
- **Doc** (`docs/core/entity/water-heater.md:26`): `supported_features | List[str] | NotImplementedError`.
- **Core** (`homeassistant/components/water_heater/__init__.py:176`): `_attr_supported_features: WaterHeaterEntityFeature = WaterHeaterEntityFeature(0)` — defaults to no features; the type is the `WaterHeaterEntityFeature` IntFlag, not `List[str]`, and it is not required.

### fan.md — `turn_on` signature includes removed `speed` param (medium)
- **Doc** (`docs/core/entity/fan.md:155`, `:158`): `turn_on(self, speed: Optional[str] = None, percentage=..., preset_mode=..., **kwargs)`.
- **Core** (`homeassistant/components/fan/__init__.py:296-301`): `turn_on(self, percentage=None, preset_mode=None, **kwargs)` — the `speed` argument was removed from the base class.

### update.md — `in_progress` default wrong (medium)
- **Doc** (`docs/core/entity/update.md:28`): default `None`.
- **Core** (`homeassistant/components/update/__init__.py:234`): `_attr_in_progress: bool = False` — default is `False`.

### datetime.md — "always be in UTC" is inaccurate (medium)
- **Doc** (`docs/core/entity/datetime.md:24`): "The input datetime will always be in UTC."
- **Core** (`homeassistant/components/datetime/__init__.py:33-38`): `_async_set_value` fills a naive datetime with `dt_util.get_default_time_zone()` (local) and passes tz-aware values through unchanged; the value handed to `async_set_value` is timezone-aware but not guaranteed UTC. (Only the state string at `:113` is converted to UTC.)

### time.md — `native_value` marked Required but has a default (medium)
- **Doc** (`docs/core/entity/time.md:16`): `native_value | time | **Required**`.
- **Core** (`homeassistant/components/time/__init__.py:73`): `_attr_native_value: time | None = None` — has a `None` default (unlike `date`/`datetime`, which declare the attribute with no default), and the type is `time | None`.

### Minor / non-code-mismatch defects
- **number.md** (`docs/core/entity/number.md:20`): the `native_step` table row is malformed — its description cell runs into a duplicated `native_unit_of_measurement` column, garbling the row (rendering defect).
- **number.md** (`:22`): the `native_unit_of_measurement` description is copy-pasted from the sensor page and refers to "the sensor's value"/"state" instead of the number's.
- **climate.md** (fan-modes table, `:92-102`): omits `FAN_TOP` (`homeassistant/components/climate/const.py:65`) — incomplete list, not a wrong statement.
- **infrared.md** (`:74`): example annotates `command: infrared_protocols.Command`; the class is at `infrared_protocols.commands.Command` (as the same page states correctly at `:225`).

## Core platform & integration documentation (`docs/core/`)

### platform/reproduce_state.md — outdated `async_reproduce_states` signature (high)
- **Doc** (`docs/core/platform/reproduce_state.md:21-23`): `async_reproduce_states(hass, states, context: Optional[Context] = None) -> None`.
- **Core** (`homeassistant/components/switch/reproduce_state.py:58-64`, and the scaffold template): `async_reproduce_states(hass, states, *, context: Context | None = None, reproduce_options: dict[str, Any] | None = None) -> None` — `context` is keyword-only and a new `reproduce_options` parameter exists. The scaffold the doc points users to generates the newer signature.

### integration/config_flow.md — examples call `async_set_unique_id` without `await` (medium)
- **Doc** (`docs/core/integration/config_flow.md:291`, `:369`): `self.async_set_unique_id(user_id)` with no `await`.
- **Core** (`homeassistant/config_entries.py:3172`): `async def async_set_unique_id(...)` is a coroutine; the same doc's prose (`:310`, `:412`) says to `await` it. As written, the examples create an un-awaited coroutine and would not set the unique ID.

### Pages verified accurate
`docs/core/entity.md`, `platform/raising_exceptions.md`, `platform/repairs.md`, `platform/significant_change.md`, `platform/application_credentials.md`, `platform/media_source.md`, `platform/backup.md`, `integration/options_flow.md`, `integration/diagnostics.md`, `integration/system_health.md`, and the remainder of `integration/config_flow.md`. Entity pages verified accurate: light, switch, sensor, binary-sensor, select, button, cover, valve, lock, humidifier, media-player, camera, vacuum, lawn-mower, weather, calendar, alarm-control-panel, siren, remote, event, date, scene, air-quality, notify, radio-frequency, assist-satellite (aside from the `preannounce_media_id` naming note below).

### assist-satellite.md — `preannounce_media_id` misnamed (medium)
- **Doc** (`docs/core/entity/assist-satellite.md:66`, `:75`): `preannouncement_media_id`.
- **Core** (`homeassistant/components/assist_satellite/entity.py:108`): the field/param is `preannounce_media_id`.

## Registries & config/data-entry flow

### device_registry_index.md — "Primary" category list incomplete (high)
- **Doc** (`docs/device_registry_index.md:185`): the Primary category is listed as `configuration_url`, `connections`, `entry_type`, `hw_version`, `identifiers`, `manufacturer`, `model`, `name`, `suggested_area`, `sw_version`, `via_device`.
- **Core** (`homeassistant/helpers/device_registry.py:116-130`, the `"primary"` set of `DEVICE_INFO_TYPES`): also contains `model_id` and `serial_number`.
- **Issue**: The Primary key list omits `model_id` and `serial_number`. This matters because a `DeviceInfo` is only categorized as Primary when it contains *all* keys of that type.

### area_registry_index.md — `AreaEntry` attribute table badly outdated (medium)
- **Doc** (`docs/area_registry_index.md:7-10`): lists only `id` and `name`.
- **Core** (`homeassistant/helpers/area_registry.py:74-84`): `AreaEntry` also has `aliases`, `floor_id`, `humidity_entity_id`, `icon`, `labels`, `picture`, `temperature_entity_id` (plus inherited `created_at`/`modified_at`).
- **Issue**: The attribute table is missing most current fields.

### Pages verified accurate
`entity_registry_index.md`, `entity_registry_disabled_by.md` (`RegistryEntryDisabler.USER/INTEGRATION/CONFIG_ENTRY` all present), `config_entries_index.md` (`ConfigEntryState` states, `async_forward_entry_setups`, `async_on_state_change`, `async_on_unload`), `data_entry_flow_index.md` (`FlowResultType` members and all `async_show_*`/`async_create_entry`/`async_abort`/`async_update_progress`/`async_show_menu` methods), `integration_setup_failures.md` (`ConfigEntryNotReady`/`ConfigEntryAuthFailed`/`ConfigEntryError`/`PlatformNotReady`).

## Dev-101 & integration guides

### integration_fetching_data.md — uses banned `async_timeout` library (medium)
- **Doc** (`docs/integration_fetching_data.md:38`, `:114`): `import async_timeout` and `async with async_timeout.timeout(10):`.
- **Core** (`pyproject.toml:854`): the `async_timeout` library is banned — `"async_timeout".msg = "use asyncio.timeout instead"`; no core file imports it anymore.
- **Issue**: The example should use the stdlib `async with asyncio.timeout(10):`.

### integration_listen_events.md — overbroad "sync versions" claim & undeprecated helper (medium/low)
- **Doc** (`docs/integration_listen_events.md:11`): "Sync versions of the below functions are also available without the `async_` prefix."
- **Core** (`homeassistant/helpers/event.py`): sync variants are only generated via `threaded_listener_factory` for a subset; there is no sync counterpart for `async_track_state_change_event`, `async_track_state_added_domain`, `async_track_state_removed_domain`, `async_track_state_change_filtered`, `async_track_template_result`, or `async_track_entity_registry_updated_event`. (medium)
- **Doc** (`docs/integration_listen_events.md:24`): lists `async_track_state_change` as a current helper with no deprecation note.
- **Core** (`homeassistant/helpers/event.py:219-227`): `async_track_state_change` is deprecated (reports usage, callers steered to `async_track_state_change_event`). (low)

### Pages verified accurate
`dev_101_hass.md`, `dev_101_states.md`, `dev_101_events.md`, `dev_101_services.md`, `dev_101_config.md`, `integration_events.md` all match `homeassistant/core.py` / `core_config.py` / `helpers/service.py`. (Note: `Config` now lives in `core_config.py` rather than `core.py`, but the docs don't state an import path, so no user-facing error.)

## Discovery & manifest (`network_discovery.md`, manifest, Bluetooth)

### network_discovery.md — documents a removed USB API (high)
- **Doc** (`docs/network_discovery.md:210-222`): example uses `usb.async_is_plugged_in(hass, {...})`.
- **Core**: `async_is_plugged_in` no longer exists anywhere in core (not in `homeassistant/components/usb/__init__.py` `__all__`, no definition in the repo).
- **Issue**: The entire "Checking if a specific adapter is plugged in" subsection describes a function that has been removed.

### network_discovery.md — wrong module in USB callback example (high)
- **Doc** (`docs/network_discovery.md:239`): snippet imports `from homeassistant.components import usb` but calls `bluetooth.async_register_scan_request_callback(...)`.
- **Core** (`homeassistant/components/usb/__init__.py:78`): the function is `usb.async_register_scan_request_callback`.
- **Issue**: The example calls it on `bluetooth` (never imported in the snippet); the "compatible bluetooth USB adapters" docstring is also a leftover copy-paste.

### network_discovery.md — SSDP callback registration not awaited (medium)
- **Doc** (`docs/network_discovery.md:116-120`, `:131-135`): `entry.async_on_unload(ssdp.async_register_callback(hass, ...))`.
- **Core** (`homeassistant/components/ssdp/__init__.py:46`): `async def async_register_callback(...)` is a coroutine returning the cancel callback.
- **Issue**: As written, an un-awaited coroutine is passed to `async_on_unload`; it should be `entry.async_on_unload(await ssdp.async_register_callback(...))`.

### Pages verified accurate
`creating_integration_manifest.md` (integration_type values, IoT classes, quality_scale tiers, and all zeroconf/ssdp/dhcp/usb/bluetooth/homekit/virtual matcher fields checked against `script/hassfest/manifest.py` & `model.py`), `creating_integration_file_structure.md`, `creating_component_generic_discovery.md`, `bluetooth.md` (`async_get_scanner`, `BluetoothServiceInfoBleak`, `BluetoothScanningMode`, `async_register_callback`).

## API docs (REST, WebSocket, auth, intent)

### auth_auth_provider.md — `async_login_flow` signature missing `context` (high)
- **Doc** (`docs/auth_auth_provider.md:23`): `async def async_login_flow(self)`.
- **Core** (`homeassistant/auth/providers/__init__.py:106`): `async def async_login_flow(self, context: AuthFlowContext | None) -> LoginFlow[Any]:` (the reference `insecure_example.py:38` also takes `context`).
- **Issue**: A provider implementing the documented signature would not match the base class.

### auth_api.md — documents deprecated token-revocation path (medium)
- **Doc** (`docs/auth_api.md:135-147`): revocation is documented only via `POST /auth/token` with `token=…&action=revoke`.
- **Core** (`homeassistant/components/auth/__init__.py:205-231`, `:258-261`): a dedicated `RevokeTokenView` is registered at `/auth/revoke`, and `action=revoke` on the token endpoint is explicitly marked deprecated (kept only for backwards compat).
- **Issue**: The docs describe the deprecated revocation path and omit the current `/auth/revoke` endpoint.

### auth_api.md — invalid `client_icon: null` in long-lived-token example (medium)
- **Doc** (`docs/auth_api.md:155-163`): the `auth/long_lived_access_token` example includes `"client_icon": null`.
- **Core** (`homeassistant/components/auth/__init__.py:519-525`): the schema is `vol.Optional("client_icon"): str`.
- **Issue**: `client_icon` must be a string; JSON `null` fails validation — the field should be omitted.

### intent_conversation_api.md — response `data.targets` no longer emitted (high)
- **Doc** (`docs/intent_conversation_api.md:52-72`, `:102-129`, `:171-177`): the `action_done`/`query_answer` examples and the "targets" table describe a `"targets"` array inside `response.data`.
- **Core** (`homeassistant/helpers/intent.py:1457-1472`): `IntentResponse.as_dict()` builds `data` with only `success` and `failed` (or `code` for errors); there is no `targets` key. `ConversationResult.as_dict()` (`components/conversation/models.py:82-88`) just wraps it. (`targets` exists only in the separate debug websocket `async_debug_recognize`.)
- **Issue**: The documented `response.data.targets` array is not produced; affected entities/areas appear in the `success`/`failed` lists.

### intent_conversation_api.md — target `type` list omits `floor` (medium)
- **Doc** (`docs/intent_conversation_api.md:106`): "One of `area`, `domain`, `device_class`, `device`, `entity`, or `custom`."
- **Core** (`homeassistant/helpers/intent.py:234-243`): `IntentResponseTargetType` also includes `FLOOR = "floor"`, and floor targets are produced in results.
- **Issue**: `floor` is a valid target type missing from the documented list.

### intent_builtin.md — `HassToggle` listed as deprecated but is active (medium)
- **Doc** (`docs/intent_builtin.md:25`, `:98-104`): lists `HassToggle` among deprecated intents "planned to be removed or replaced."
- **Core** (`homeassistant/helpers/intent.py:40`, `components/intent/__init__.py:137-146`): `INTENT_TOGGLE = "HassToggle"` is registered as a current `ServiceIntentHandler` ("Toggles a device or entity").
- **Issue**: `HassToggle` is a currently supported intent, contradicting its placement in the deprecated list.

### Pages verified accurate
`api/rest.md`, `api/websocket.md`, `intent_index.md`, `intent_handling.md`, `intent_firing.md`, `auth_index.md`, `auth_permissions.md` (`POLICY_READ/CONTROL/EDIT`, entities-only policy schema, subcategory lookup order, merge semantics, `require_admin`, `async_sign_path`).

## Developer environment setup

### supervisor/debugging.md — wrong container path in `launch.json` example (high)
- **Doc** (`docs/supervisor/debugging.md:40`): `"remoteRoot": "/usr/src/hassio"`.
- **Repo** (`supervisor/.vscode/launch.json:13`, `supervisor/Dockerfile:62`): the Supervisor now lives at `/usr/src/supervisor`; no `/usr/src/hassio` path exists in the repo.
- **Issue**: The remote debugger's `remoteRoot` points at the old path, so breakpoints won't map to source. (Debug port `33333` and the `--debug` enable steps are correct.)

### development_environment.mdx — wrong VS Code extension name (medium)
- **Doc** (`docs/development_environment.mdx:40`): "When Visual Studio Code asks if you want to install the **Remote - SSH** extension, click **Install**."
- **Repo**: the devcontainer flow uses the **Dev Containers** extension (`ms-vscode-remote.remote-containers`) — the same extension the page's own `cloneInVolume` link invokes — not **Remote - SSH**.
- **Issue**: The named extension is wrong for the devcontainer workflow.

### Pages verified accurate
`supervisor/development.md`, `supervisor.md`, `setup_devcontainer_environment.mdx`, `development_testing.md`, `development_typing.md`, `development_validation.md`, `development_checklist.md`, `creating_integration_tests_file_structure.md` — all referenced scripts (`script/setup`, `script/hassfest`, `script/gen_requirements_all.py`, `script/monkeytype`), `.vscode/tasks.json` task labels, `prek`/`ruff`/`pytest` commands, the `>=3.14.2` Python requirement, `.strict-typing`, and `cv.*` helpers were confirmed present.
