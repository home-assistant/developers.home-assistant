# Developer Docs vs. Home Assistant Core — Audit Findings

Comparison of the developer documentation (`developers.home-assistant/docs/`) against the current Home Assistant Core source (`homeassistant/`). Each finding lists the doc location, what core actually does, and the nature of the mismatch. Line numbers refer to the state of the repos at audit time.

> Status: in progress. Entity docs, core platform/integration docs verified. Registries, dev-101, integration guides, API, and Supervisor docs pending.

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
