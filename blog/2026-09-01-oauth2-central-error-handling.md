---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?v=4
title: "OAuth2 error handling moved into the helper"
---

As of Home Assistant Core 2026.10, the OAuth2 helper raises exceptions that config entry setup already understands, so integrations no longer translate OAuth2 failures themselves.

## What changed

The OAuth2 exceptions now inherit from the config entry exception that describes what should happen, and carry a translated message from the `homeassistant` integration:

| Uncaught exception | Result |
| --- | --- |
| `ImplementationUnavailableError`, `OAuth2TokenRequestError`, `OAuth2TokenRequestTransientError`, `OAuth2TokenRequestConnectionError` | Setup is retried |
| `UnknownImplementationError`, `OAuth2TokenRequestReauthError` | Reauth flow starts |

`async_refresh_token` now maps every `aiohttp.ClientError` an implementation raises, so implementations that override `_token_request` and end on a bare `raise_for_status()` no longer leak a raw `ClientResponseError`. A request that never gets a response raises the new `OAuth2TokenRequestConnectionError`, which has no HTTP status and is therefore not an `OAuth2TokenRequestError`.

## Migration

```diff
-    try:
-        implementation = await async_get_config_entry_implementation(hass, entry)
-    except ImplementationUnavailableError as err:
-        raise ConfigEntryNotReady(
-            translation_domain=DOMAIN,
-            translation_key="oauth2_implementation_unavailable",
-        ) from err
+    implementation = await async_get_config_entry_implementation(hass, entry)
```

Also remove the now-unused `oauth2_implementation_unavailable` entry from the `exceptions` section of `strings.json`.

Catching `ValueError` around this call can go as well. `UnknownImplementationError` subclasses `ValueError` for backwards compatibility, so a `ValueError` handler silently downgrades it and discards the translated message.

### Token requests

```diff
-    try:
-        await auth.async_get_access_token()
-    except OAuth2TokenRequestReauthError as err:
-        raise ConfigEntryAuthFailed from err
-    except OAuth2TokenRequestError as err:
-        raise ConfigEntryNotReady from err
+    await auth.async_get_access_token()
```

The same applies to `await session.async_ensure_token_valid()`.


## Quality scale

The [`test-before-setup`](/docs/core/integration-quality-scale/rules/test-before-setup) rule accepts `await session.async_ensure_token_valid()` in `async_setup_entry` as satisfying the rule, alongside `await coordinator.async_config_entry_first_refresh()`. Both raise the appropriate config entry exception on the integration's behalf.

## When to keep catching

Central handling is a default, not a restriction. Keep an explicit handler when the integration genuinely needs different behavior, for example:

- Treating a specific status as permanent with `ConfigEntryError` instead of retrying.
- Adding context to the message that only the integration knows.
- Cleaning up integration state before the exception propagates.

In those cases, catch the most specific exception that applies and let the rest propagate.
