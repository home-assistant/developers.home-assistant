# PR review guide

A practical guide for reviewing pull requests on `home-assistant/core`.

Items marked 👁️ require human judgment and are often the hardest to get right when relying on automated checks. The remaining items may be partially covered by linters, hassfest, CI, or automated reviewers, but are listed here as useful context for reviewers.

---

## 1. First pass: gate checks

Before reading any code, verify these. If any fail, comment and stop. Reviewing further wastes your time.

- **CLA is signed.** Check for the `cla-signed` label. If `cla-needed` is present, comment asking the contributor to sign and move on. Do not review code until CLA is resolved.
- **CI is green.** All checks must pass. If CI is red due to the contributor's changes, convert to draft and ask them to fix. Don't review broken code.
- 👁️ **PR has a single purpose.** One bugfix, one feature, one integration, or one refactor. If the PR mixes concerns (e.g., a dependency bump that also refactors tests), ask the author to split it.
- 👁️ **PR type checkbox matches content.** The PR template has type checkboxes: verify only one is checked and it matches what the code actually does.
- **Not dependent on another open PR.** Check for references to other unmerged PRs. Dependent PRs should not be submitted until their dependency merges.
- 👁️ **Description is useful.** The "Proposed change" section should explain *why*, not just *what*. For bugfixes, there should be a linked issue. For new integrations, context about the brand/device.
- **PR description has no unfilled placeholders.** Check for empty Breaking Change sections, unfilled `fixes #` placeholders.

### 1.1 Triage signals: is this PR likely to complete?

Recognizing early signals of at-risk PRs saves reviewer time.

**High-risk indicators** (consider deprioritizing review until resolved):

- 👁️ **First-time contributor with a large PR.** New-integration PRs from first-time contributors have the highest abandonment rate. If the PR is a new integration and the author has no prior merged PRs, consider waiting for CI to pass and initial bot feedback to be addressed before investing deep review time.
- 👁️ **AI-generated PR signals.** Watch for PRs that address theoretical rather than actual problems, have suspiciously well-formatted descriptions but code showing fundamental misunderstandings, modify test fixtures without corresponding behavior changes, or add defensive code for conditions that can't actually occur.

---

## 2. New integration PRs (`new-integration`)

These are very review-intensive. The quality scale bronze rules are the baseline: every new integration must satisfy them.

### 2.1 Scope

- **Single platform only.** The initial PR should expose one entity platform (e.g., just `sensor` or just `switch`). Check the `PLATFORMS` list in `__init__.py`—if it has more than one entry, ask the author to pick one and defer the rest.
- **No diagnostics.** `diagnostics.py` should not be present in an initial integration PR. It's a gold-level quality scale feature and belongs in a follow-up.
- **No reconfigure flow.** A reconfigure flow (`async_step_reconfigure`) in `config_flow.py` is gold-level. Ask the author to remove it and submit separately.
- **No options flow (usually).** Unless the integration genuinely needs user-configurable options from day one, the options flow belongs in a follow-up.
- 👁️ **No kitchen sink.** Watch for PRs that add every conceivable entity. The initial PR should be minimal and functional. Additional platforms, entities, and features come in follow-up PRs.

### 2.2 Manifest (`manifest.json`)

- **`iot_class` is correct.** Must match how the integration actually communicates: `local_polling`, `cloud_push`, etc.
- 👁️ **Library is open source.** The PyPI dependency must have its source code publicly available with an open-source license. Check the repo link.
- **License is Apache-2.0-compatible.** HA Core is Apache-2.0. Dependencies must use a compatible license (MIT, BSD, Apache-2.0, LGPL, MPL-2.0, ISC, Unlicense are fine). **GPL-2.0, GPL-3.0, and AGPL are NOT compatible.**
- **License metadata is present.** The library must have a license declared on PyPI. A library with no license is legally "all rights reserved."
- **License identifier matches LICENSE file.** Verify the `license` field in `pyproject.toml`/`setup.cfg` matches the actual LICENSE file text in the source repo. Mismatches indicate either a mistake or misrepresentation.
- **Transitive dependency licenses are compatible.** An MIT library pulling in a GPL-3.0 transitive dep creates the same incompatibility. Check the full dependency tree.
- 👁️ **Library is not abandoned or recently transferred.** Check commit history and PyPI maintainer. A library with no activity in 2+ years that suddenly gets a new maintainer warrants scrutiny.

### 2.3 Quality scale (`quality_scale.yaml`)

- **All bronze rules are addressed.** Each bronze rule should be marked `done` or `exempt` (with a reason). None should be `todo`.
- 👁️ **Exempt reasons are valid.** If any rule is marked `exempt`, the reason should be legitimate (e.g., "this integration has no actions" for `action-setup`).
- 👁️ **Claimed `done` rules are actually done.** Spot-check a few: the quality-scale-rule-verifier agent can help here.

### 2.4 Config flow

- 👁️ **`test-before-configure` is implemented.** The config flow must attempt to connect to the device/service and fail gracefully with a user-friendly error if it can't.
- 👁️ **`unique-config-entry` prevents duplicates.** The flow should call `self._abort_if_unique_id_configured()` or equivalent to prevent adding the same device twice.
- 👁️ **Suggested values on reconfigure.** If a reconfigure flow exists (it shouldn't in initial PRs, but for follow-ups): input fields should pre-populate with current values using `suggested_value`.

### 2.5 Discovery flows (Zeroconf / DHCP / SSDP)

Discovery configuration is a frequent source of back-and-forth.

- 👁️ **Discovery patterns are specific enough.** Zeroconf service types, DHCP hostnames, and SSDP manufacturers should match only the intended devices. Overly broad patterns (e.g., matching `duco` when you mean `duco [`) will accidentally claim unrelated devices. Ask: "Could this pattern match something it shouldn't?"
- **`raise_on_progress=False` where appropriate.** Flows that call `async_set_unique_id` from multiple steps need to pass the `raise_on_progress=False` parameter in the steps where the flow source should take priority over the discovery flow. For example, a flow that is started by a user should always take precedence over a discovery flow for the same device unique id.
- 👁️ **DHCP as fallback.** If the integration supports Zeroconf, consider whether DHCP discovery should also be added as a fallback for networks where mDNS doesn't work well.
- 👁️ **`registered_devices` support considered.** For integrations where devices might change hostname/IP, `registered_devices` allows re-discovery of already-configured devices.
- **Manifest discovery entries match implementation.** If `manifest.json` declares `zeroconf`, `dhcp`, or `ssdp`, verify the config flow actually implements the corresponding `async_step_*` method.

### 2.6 Coordinator & data fetching

- 👁️ **Uses `DataUpdateCoordinator` for polling.** Polling integrations should not implement their own polling loops. An exception is when the integration uses [separate polling for each individual entity](/docs/integration_fetching_data/#separate-polling-for-each-individual-entity).
- **`_async_setup` for one-time work, `_async_update_data` for polling.** One-time setup work (auth, connection setup, initial device info fetch) belongs in `_async_setup`. The `_async_update_data` method runs on every poll cycle—don't put setup logic here.
- **`ConfigEntryAuthFailed` for authentication errors.** When the API returns an auth error during data update, the coordinator must raise `ConfigEntryAuthFailed` (not `UpdateFailed`). This triggers a reauth flow instead of just logging errors and retrying forever. Note that this requires the config flow to have implemented an `async_step_reauth` method.
- 👁️ **Coordinator data is properly typed.** The coordinator should use generics (`DataUpdateCoordinator[MyDataType]`) so entity code gets type-checked access to coordinator data.
- 👁️ **Polling frequency is reasonable.** Check the `update_interval`: is it appropriate for the device/service? A weather API doesn't need 10-second polling. A local device might need faster updates.

### 2.7 Entities

- **Stable `unique_id`.** Entity unique IDs must not use IP addresses, hostnames, or anything that can change. Prefer MAC addresses (normalized with `format_mac()`), serial numbers, or device-assigned IDs.
- **MAC addresses are normalized.** If a MAC address is used as unique ID or in device info, it must go through `format_mac()` from `homeassistant.helpers.device_registry`.
- **Entity description is used.** New entities should be defined using a dataclass-based [entity description](/docs/core/entity#entity-description) (e.g., `SensorEntityDescription`). Other patterns described in the linked docs are also accepted, but the entity description pattern is preferred in new code.
- **`PARALLEL_UPDATES` is set.** For coordinator-based integrations, set `PARALLEL_UPDATES = 0` in each platform module (since the coordinator handles synchronization).
- 👁️ **Entity categories are correct.** See Section 8 for detailed `EntityCategory` guidance: this is one of the most common review patterns.
- 👁️ **Debug/diagnostic entities disabled by default.** Entities for debugging purposes (signal strength, rate limits, firmware version) should set `entity_registry_enabled_default=False` in addition to `EntityCategory.DIAGNOSTIC`.

### 2.8 Strings & translations

- **All user-facing strings in `strings.json`.** No hardcoded English strings in Python code.
- **Sentence case.** All string values in `strings.json` must use sentence case (not Title Case, not ALL CAPS).
- **Common translation keys used where applicable.** If a string matches an existing common key (e.g., generic names like "Temperature", "Humidity"), reference the common key instead of defining a new one.
- **Backticks around untranslated terms.** Technical identifiers (model names, protocol names) in translatable strings should be either be wrapped in backticks or Capitalized so translators know not to translate them.
- **Integration name not in log messages.** The integration domain is already part of the logger name—don't repeat it in the message text.

---

## 3. New feature PRs (`new-feature`)

Adding functionality to an existing integration.

### 3.1 Scope & compatibility

- 👁️ **Scope is appropriate.** The feature should be a single, coherent addition. Adding three new entity platforms at once is too much—split them.
- 👁️ **Consistent with existing integration style.** New code should follow the conventions already established in the integration (naming, structure, patterns).
- 👁️ **Quality scale level maintained.** If the integration has a quality scale level, the new code must not regress it. Check that new entities follow all applicable rules.
- **New strings follow translation rules.** Same rules as new integrations: sentence case, common keys, backticks.
- 👁️ **Breaking changes documented.** If the feature changes existing behavior (renames entities, changes state value formats, modifies service schemas), the PR description must include a "Breaking change" section written for end users. Whether something is "breaking" requires understanding the user-facing contract: this is a human judgment call that AI reviewers consistently get wrong.

### 3.2 Config entry lifecycle

- 👁️ **Config entry migration if schema changes.** If the feature changes what's stored in a config entry, there must be a migration: bump `VERSION` in the config flow class, implement `async_migrate_entry`, and add tests covering migration from old to new format.
- **VERSION bump matches schema change.** If config entry data fields are added, removed, or restructured, and the config flow `VERSION` hasn't been bumped, flag it. Conversely, if `VERSION` is bumped, there should be corresponding migration code.
- 👁️ **`async_unload_entry` cleans up all resources.** When a config entry is unloaded, all event listeners, polling tasks, and connections should be cleaned up. Missing cleanup causes resource leaks and stale state.
- 👁️ **No access to `runtime_data` after failed setup.** If `async_setup_entry` fails partway through, code in error handlers should not try to access `entry.runtime_data`: it may not have been set yet.

### 3.3 Discovery & device registration

- 👁️ **Discovery patterns updated if needed.** If the feature adds support for new device models, check whether `manifest.json` discovery entries (Zeroconf, DHCP, SSDP) need to be expanded.
- 👁️ **Device info is complete.** New entities should include proper `DeviceInfo` with manufacturer, model, serial number, and firmware version where available.

---

## 4. Bugfix PRs (`bugfix`)

Bugfixes generate many comments per reviewed PR despite being conceptually simpler than other changes—because reviewers scrutinize whether the fix is actually correct and complete.

- 👁️ **Linked issue exists.** Bugfix PRs should reference the issue they fix (`fixes #XXXX`). If there's no issue, ask why: the bug should be confirmed to exist.
- 👁️ **Fix is minimal.** The change should fix the reported bug and nothing else. No drive-by refactoring, no "while I'm here" improvements.
- 👁️ **Root cause is addressed.** The fix should address the actual cause, not paper over symptoms. If a `TypeError` crashes because `value` is `None`, the fix should handle `None` at the appropriate level—not just wrap everything in `try/except`.
- 👁️ **Regression test included.** There should preferably be a test that would have caught this bug. The test should fail without the fix and pass with it. Not all integrations require tests, but test coverage should always be maintained in existing integrations that have tests.
- **No unrelated test changes.** Test refactoring (snapshot updates, parametrize rewrites) should not be mixed into bugfix PRs.

### 4.1 Error handling in bugfixes

- **`HomeAssistantError` propagated from service/action handlers.** When a service handler catches an exception from the underlying library, it should re-raise as `HomeAssistantError` (or a subclass like `ServiceValidationError`) so the error reaches the user through the UI. Silently swallowing exceptions in service handlers is a common bug pattern.
- 👁️ **Error specificity.** Bugfixes that add error handling should catch specific exception types, not broad `except Exception`. See Section 10 for details.
- **`ConfigEntryAuthFailed` for auth-related bugfixes.** If the bugfix addresses an authentication issue in a coordinator, verify it raises `ConfigEntryAuthFailed` (not `UpdateFailed`) to trigger the reauth flow.

---

## 5. Code quality PRs (`code-quality`)

Often driven by quality-scale improvements.

- 👁️ **Improvement is real.** The change should make the code measurably better (more readable, faster, more maintainable), not just different.
- 👁️ **No behavioral changes.** Code quality PRs should not change functionality. If they do, they need to be labeled differently.
- **Tests updated to match.** If code structure changes, tests should be updated accordingly—but test refactoring should match the code changes, not go beyond them.
- 👁️ **Breaking changes noted.** Even code-quality PRs can be breaking (e.g., removing a deprecated constant). The "Breaking change" section must be filled out if applicable.
- 👁️ **Quality scale claims verified.** Verify that all claimed rules are actually satisfied: the quality-scale-rule-verifier agent can automate this.

---

## 6. Dependency PRs (`dependency`)

Dependency PRs generate few review comments compared to new-integration PRs, but the patterns that do appear are specific, and the bigger concern is the security risk when updating dependencies.

### 6.1 Scope & structure

- **Only the dependency is updated.** The PR should touch `manifest.json` (version bump), and the requirements files that track the dependency, such as `requirements_all.txt` (regenerated), and minimal code changes required by the new version. Nothing else.
- **No opportunistic refactoring.** If the contributor also refactored tests, cleaned up imports, or made stylistic changes—ask them to split that into a separate PR.
- **`quality_scale` not accidentally removed.** Check that `manifest.json` didn't lose the `quality_scale` or `loggers` field: this happens surprisingly often in dependency bumps.

### 6.2 Upstream change review

- 👁️ **Changelog/release notes linked.** The PR description should include a link to the library's changelog or a diff between versions so reviewers can see what changed upstream.
- 👁️ **Breaking library changes handled.** If the upstream library made breaking changes, verify the integration code adapts correctly.
- **Upstream diff reviewed for security concerns.** Check what actually changed in the library between the old and new version. Look for: new network calls, new imports of `requests`/`aiohttp`/`socket`/`subprocess`/`os.system`, new environment variable access, new file I/O outside expected paths.
- **No new transitive dependencies.** If the library version adds new transitive dependencies, they should be called out explicitly. New transitive deps are the most common supply chain attack vector.
- **PyPI maintainer hasn't changed.** If the library's PyPI maintainer changed between versions, this is a significant trust event (possible account takeover). Flag it for closer inspection.
- **Source repo hasn't moved or been archived.** Verify the library still has the same public source repository. A repo transfer, archival, or deletion between versions is a red flag.

### 6.3 License compliance

- **License hasn't changed between versions.** A license change (e.g., MIT → GPL-3.0) between the old and new version would be a critical issue. Compare the `license` field on PyPI for both versions.
- **License is still Apache-2.0-compatible.** Same rules as new integrations: GPL-2.0/3.0/AGPL are incompatible with HA Core's Apache-2.0 license.
- **License identifier still matches LICENSE file.** Verify the declared license identifier matches the actual LICENSE text: this should be re-verified on every bump, not just initial introduction.

---

## 7. Testing review (all PR types)

### 7.1 Structure

- **Tests are in the right location.** Integration tests belong in `tests/components/<domain>/`.
- **All test function parameters have type annotations.** Use concrete types (`HomeAssistant`, `MockConfigEntry`) not `Any`.
- 👁️ **Tests exercise HA's public interfaces.** Tests should set up integrations via `async_setup_component()` or `hass.config_entries.async_setup()`, assert state via `hass.states`, and trigger actions via `hass.services`. They should NOT directly instantiate integration classes or call internal methods.

### 7.2 Patterns

- **Snapshot testing for entity platforms.** Platform tests (sensor, switch, etc.) should use `snapshot_platform` to validate entity state rather than manually asserting individual attributes.
- **`@pytest.mark.parametrize` for repetitive cases.** If multiple test functions test the same behavior with different inputs, they should be parametrized into one function. But don't over-parametrize: a single test for one scenario doesn't need parametrize.
- **`freezer` for time-based tests.** Tests involving time must use the `freezer` fixture—never mock `datetime`, `time`, or `utcnow` directly.
- **No `mock.patch` on `sys.modules`.** This is fragile and breaks other tests. Use proper mocking patterns instead.
- 👁️ **Config flow tests have full coverage.** Every branch in the config flow should be tested: happy path, error handling, user abort, each step. Reviewing the config flow tests early is often a fast way to spot bugs in the rest of the code.
- 👁️ **Error/recovery scenarios tested.** Tests should cover what happens when the device/service is unavailable, returns errors, or requires reauthentication. This is the most commonly requested missing test type.
- 👁️ **Test brittleness minimized.** Avoid hard-coding values that depend on upstream data (e.g., specific holiday dates). Use mocking or select stable test data that won't change when a dependency is bumped.

### 7.3 Mocking

- 👁️ **Mock the library, not HA internals.** Mocks should target the third-party library's API calls, not Home Assistant's internal mechanisms.
- **Fixtures are in `conftest.py`.** Shared test fixtures (mock client, config entry setup) belong in the integration's `conftest.py`, not duplicated across test files.

---

## 8. Entity patterns (all PR types)

Entity-related feedback dominates reviewer attention. This section applies to all PRs that add or modify entities.

### 8.1 `EntityCategory` classification

Contributors frequently misclassify entities. The rule:

**Decision tree:**

1. Is this entity something the user would want on their main dashboard? → **No category** (default)
2. Is it a setting that controls integration behavior? (modes, thresholds, toggles) → **`EntityCategory.CONFIG`**
3. Is it debug/diagnostic info? (firmware version, signal strength, rate limits, IP address, MAC address) or specifically button entities with device class IDENTIFY → **`EntityCategory.DIAGNOSTIC`**

Entities marked `CONFIG` or `DIAGNOSTIC` are hidden from default dashboards and excluded from voice assistants.

- 👁️ **Diagnostic entities are marked `EntityCategory.DIAGNOSTIC`.** Entities for debugging—signal strength, rate limits, firmware version, connection stats, error counts—must be `EntityCategory.DIAGNOSTIC`.
- 👁️ **Config entities are marked `EntityCategory.CONFIG`.** Reset buttons, mode selectors, configuration toggles, threshold settings—anything that controls how the integration or device behaves—must be `EntityCategory.CONFIG`.
- **Debug/diagnostic entities are disabled by default.** In addition to `EntityCategory.DIAGNOSTIC`, entities that exist purely for debugging should set `entity_registry_enabled_default=False`.
- 👁️ **Primary-function entities have no category.** The main entities users interact with (the thermostat temperature, the switch state, the light brightness) should have **no** `EntityCategory`. Don't over-classify.

### 8.2 Availability & `None` handling

This is one of the most important patterns for reviewers to understand—and one of the hardest for AI to get right.

**The core distinction:**

- **`native_value` returns `None`** = the entity is available, but the current value is unknown → entity shows "unknown" in UI
- **`_attr_available = False`** = the device/service is unreachable → entity shows "unavailable" in UI

These are very different user experiences. Getting it wrong means either showing incorrect data or hiding real failures.

- 👁️ **`None` is not masked by type casting.** `bool(None)` returns `False`, which hides the fact that data is missing. `int(None)` raises `TypeError`. When a value from the API could be `None`, the entity property should return `None` (or `bool | None`), not cast it to a concrete value.
- 👁️ **Unavailability is signaled correctly.** When the device doesn't respond or the API fails, entities should go unavailable (`_attr_available = False`), not show stale data. Check coordinator error handling: does a failed update mark entities as unavailable?
- 👁️ **`None` returns are intentional, not accidental.** If `native_value` can return `None`, verify this is the intended behavior. Sometimes `None` means "the API didn't include this field" and the entity should be unavailable instead.

### 8.3 Extra state attributes vs separate entities

The HA project is actively migrating away from `extra_state_attributes`. Reviewers consistently push to split attributes into individual entities.

- 👁️ **Extra state attributes are justified.** If the PR uses `extra_state_attributes`, ask whether each attribute should be its own entity instead. The question: "Is this data independently useful? Could a user want to automate on it specifically?" If yes, it should be a separate entity.
- 👁️ **New `extra_state_attributes` are not being added.** In new code, prefer separate entities over extra attributes. The only exceptions are truly supplementary data that only makes sense in the context of the parent entity.

### 8.4 Optimistic state updates

- 👁️ **Optimistic updates are appropriate.** When an entity sends a command (turns on a switch, sets a temperature), should it immediately update its state (optimistic) or wait for the next poll/push to confirm? This depends on:
  - Does the device reliably echo state back?
  - How fast is the poll cycle?
  - Is delayed UI feedback acceptable?

  There's no universal right answer. Local devices with fast push updates usually don't need optimistic updates. Cloud-controlled devices with slow polling often do.

### 8.5 Device class & state class

- 👁️ **Device class is set and correct.** Sensors, binary sensors, and other typed entities should have an appropriate `device_class`. This determines the UI icon, unit handling, and graph rendering.
- 👁️ **State class is set for numeric sensors.** Sensors that report continuous values need `state_class` set (`MEASUREMENT`, `TOTAL`, `TOTAL_INCREASING`) for long-term statistics to work.

---

## 9. Code style & patterns (all PR types)

### 9.1 Architecture

- **Constants in `const.py`, imported from there.** Integration constants (`CONF_*`, `DOMAIN`, entity keys) that are shared between more than one module belong in `const.py` and should be imported from there—not from `__init__.py` or other re-exporting modules. If a constant is only used in a single module, it should remain there. Magic strings that should be constants should be extracted.
- 👁️ **Early exit / guard clauses.** Prefer `if not condition: return` over wrapping the entire function body in `if condition:`. Avoid deep nesting.
- **Direct dict access when validated.** When validation guarantees a key exists, use `data["key"]` not `data.get("key")`. Contract violations should be surfaced, not silently masked.
- 👁️ **No unnecessary defensive checks on service actions.** HA's service/action schemas already validate input. Don't add redundant checks for fields that are validated by the schema.
- **No `.gitignore` files in integration directories.** These occasionally sneak in from contributor's local repos.
- **Use dataclasses for structured data.** When passing multiple related values around, use a dataclass instead of tuples, dicts, or separate variables.

### 9.2 Error handling

- **`HomeAssistantError` in service/action handlers.** Service handlers that catch library exceptions must re-raise as `HomeAssistantError` (or `ServiceValidationError`) so the error propagates to the user through the UI. Silently swallowing exceptions means the user sees no feedback when an action fails.
- **Narrow exception handling.** `except Exception:` catches everything including programming errors. Catch only the expected connection/API exceptions.
- **Narrow try blocks.** Only keep statements in the `try` block that can actually raise the exception you're catching. Wide try blocks make debugging harder because the wrong line can be caught.
- 👁️ **`async_unload_entry` is complete.** When a config entry is unloaded, all event listeners, timers, and connections must be cleaned up. Check that everything created in `async_setup_entry` has a corresponding teardown.
- 👁️ **Close connections on shutdown.** When Home Assistant stops connections should be closed. Listen for the `EVENT_HOMEASSISTANT_STOP` event to schedule the cleanup. Memory is automatically released when the Home Assistant process terminates.

### 9.3 Strings & logging

- **No integration domain in log messages.** The logger already includes the domain.
- **Sentence case in all user-facing strings.** Including entity names, config flow labels, error messages.
- **Correct log levels.** `_LOGGER.error` for things the user should act on, `_LOGGER.warning` for degraded but functional states, `_LOGGER.debug` for developer diagnostics. Don't use `error` for expected conditions like "device offline."

### 9.4 Properties & state

- 👁️ **`@property` vs attributes for values.** Consider if a property or an instance attribute is the right choice. If a value needs to be computed from other data on every access, use `@property` instead of storing it as an instance variable. But check if the value is expensive to compute—if so, consider caching it. If no computation is needed or we can compute it in a single method and the need for computation is driven by the method and not by our access to the value, use an instance attribute. There are `_attr_` prefixed attributes for most `Entity` state properties that are recommended over implementing the properties directly. Don't store the same value in two places.
- 👁️ **Entity `native_value` returns the right type.** Return `None` when the value is genuinely unknown. Don't return default values (0, `False`, `""`) that mask an unknown state. See Section 8.2.

---

## 10. Common pitfalls & confusing APIs

These patterns represent areas where contributors (and automated reviewers) consistently make mistakes.

### 10.1 Type casting traps

Python's truthiness rules are a common source of bugs in HA integrations:

| Expression | Result | Problem |
| ---------- | ------ | ------- |
| `bool(None)` | `False` | Hides missing data: entity shows "off" instead of "unknown/unavailable" |
| `bool("0")` | `True` | Non-empty string is truthy: entity shows "on" when value is "0" |
| `bool(0)` | `False` | Correct, but fragile if API changes to return `"0"` |
| `int(None)` | `TypeError` | Crashes instead of returning `None` |
| `float("nan")` | `nan` | `nan != nan` is `True`, breaks comparisons silently |

- **No `bool(value)` where value can be `None`.** Use explicit comparison: `value is not None`, `value == "1"`, or return `bool | None` and let the entity framework handle it.
- **No `int(value)` or `float(value)` where value can be `None`.** Return `None` instead, or check before casting.
- 👁️ **String-to-bool conversions are explicit.** If the API returns `"0"`/`"1"` or `"true"`/`"false"`, convert explicitly (`value == "1"`) rather than relying on Python truthiness.

### 10.2 `assert` in production code

Python's `assert` statements are stripped when Python runs with `-O` (optimize). Use `if not condition: raise ValueError(...)` or similar for runtime validation. `assert` is only for tests or type hints.

- **`assert` in test files.** Tests use `assert` statements to validate the state of the test at that time.
- **`assert` for type hints.** Sometimes an `assert` statement may be needed to explain a type to the type checker. It should only be used when it's cumbersome or impossible to adjust the type annotations to achieve the same result. ALWAYS wrap such statements in an `if TYPE_CHECKING:` condition.

### 10.3 Coordinator lifecycle confusion

The `DataUpdateCoordinator` has two methods that look similar but serve different purposes:

| Method | When it runs | Use for |
| ------ | ------------ | ------- |
| `_async_setup` | **Once**, at coordinator initialization | Auth, connection setup, fetching device info, initial state |
| `_async_update_data` | **Every poll cycle** (e.g., every 30 seconds) | Fetching current state/data from the device/API |

Putting setup logic in `_async_update_data` means it runs on every poll—wasting resources and potentially causing auth token refreshes or connection re-establishment on every cycle.

- **One-time setup is in `_async_setup`.** If you see connection establishment, auth token acquisition, or device info fetching in `_async_update_data`, it should be moved to `_async_setup`.

### 10.4 `ConfigEntryAuthFailed` vs `UpdateFailed`

The most consistently confused error type in coordinators:

| Exception | Effect | When to use |
|-----------|--------|-------------|
| `ConfigEntryAuthFailed` | Triggers **reauth flow**: user gets prompted to re-authenticate | API returns 401/403, token expired, credentials invalid |
| `UpdateFailed` | Logs error, **retries on next poll** | Temporary network failure, API timeout, rate limiting |

Using `UpdateFailed` for auth errors means the integration retries forever with bad credentials instead of prompting the user to fix them.

- **Auth errors raise `ConfigEntryAuthFailed`.** In `_async_update_data`, any `except` block catching authentication-related exceptions (401, 403, `InvalidToken`, `AuthenticationError`) should raise `ConfigEntryAuthFailed`, not `UpdateFailed`. To allow the user to re-authenticate, the integration also needs to have implemented an `async_step_reauth` method.

### 10.5 `HomeAssistantError` propagation

Service/action handlers in integrations must propagate errors to the user. If a service call (`turn_on`, `set_temperature`, custom actions) catches a library exception, it should re-raise as `HomeAssistantError` so the error appears in the UI.

```python
# WRONG — user sees no feedback
async def async_turn_on(self, **kwargs):
    try:
        await self.device.turn_on()
    except DeviceError:
        _LOGGER.error("Failed to turn on")  # Only in logs, user sees nothing

# RIGHT — error reaches the user
async def async_turn_on(self, **kwargs):
    try:
        await self.device.turn_on()
    except DeviceError as err:
        raise HomeAssistantError(f"Failed to turn on: {err}") from err
```

- **Service handlers propagate `HomeAssistantError`.** Check that service/action handlers don't silently swallow exceptions. Errors should reach the user. Make sure to avoid double error logging. The argument passed to the raised `HomeAssistantError` should include the error message which will be logged by default. Don't log this error message separately.

---

## 11. Git & PR hygiene

- 👁️ **Commits tell a story.** Each commit should be a logical unit. The reviewer should be able to follow the progression.
- **No amend/squash/rebase after opening.** Per repo policy: "Do NOT amend, squash, or rebase commits that have already been pushed to the PR branch after the PR review has started." Merge commits that pull in the latest changes from `dev` are fine.
- **No unrelated commits after an unclean merge or rebase from base branch.** If the PR contains unrelated commits from `dev` the git history is corrupted. Ask the author to create a clean branch and open a fresh PR.
- 👁️ **No commented-out code.** Dead code should be removed, not commented.

---

## 12. Reviewer workflow

A suggested order for reviewing a PR efficiently:

1. **Gate checks** (Section 1): Stop here if CLA is missing, CI is red, or the PR shows high-risk triage signals.
2. **Scope check** (Section 2.1 / type-specific section): Is this PR doing one thing?
3. **Manifest & metadata** (Sections 2.2-2.3): Quick structural checks.
4. **Config flow tests** (Section 7.2): Reviewing the config flow tests early often surfaces issues in the rest of the code quickly.
5. **Entity patterns** (Section 8): Entity categories correct? Availability handled properly? No type casting traps?
6. **Remaining test review** (Section 7): Do the tests actually test what matters? Snapshots used? Error scenarios covered?
7. **Code review** (Sections 9-10): Architecture, patterns, style, common pitfalls.
8. **Strings & translations** (Section 2.8): Quick pass on `strings.json`.
9. **Overall assessment**: Approve, request changes, or comment.

**When requesting changes:** Be specific about what needs to change and why. Link to docs when possible. If the PR needs major rework, say so clearly rather than leaving many inline comments that add up to "start over."

---

*This guide is based on analysis of 1,100+ PRs and 8,200+ review comments from home-assistant/core, plus official developer documentation and repo conventions. Data collected April 2026. It has been manually curated after AI generation.*
