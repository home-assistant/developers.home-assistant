---
title: "OAuth 2.0 support"
---

Integrations that connect to cloud services often need to authenticate users via OAuth 2.0. Home Assistant provides a set of helpers in `homeassistant.helpers.config_entry_oauth2_flow` that handle the OAuth 2.0 flow, token storage, and token refresh lifecycle — so integrations don't have to implement this themselves.

This page covers how to implement OAuth 2.0 in an integration, how to handle errors and best practices.

Before reading this page, make sure you are familiar with [Application credentials](/docs/core/platform/application_credentials) and [Config entries](/docs/config_entries_index).

## Overview

Home Assistant's OAuth 2.0 helper provides:

- A built-in Authorization Code flow via `config_entry_oauth2_flow`.
- Automatic token refresh when an access token expires.
- A session helper (`OAuth2Session`) for making authenticated API requests.
- Error handling via a set of semantic exceptions

The helper supports two credential approaches, both of which require `application_credentials` support.

It's encouraged to use the built-in `config_entry_oauth2_flow` for standard Authorization Code flows, but the underlying `AbstractOAuth2Implementation` can be extended to support any OAuth 2.0 flow.

## Supported OAuth 2.0 flows

| Flow                         | Class                                               | When to use                     |
| ---------------------------- | --------------------------------------------------- | ------------------------------- |
| Client Credentials           | `LocalOAuth2Implementation`                         | Standard browser-based flow     |
| Client Credentials with PKCE | `LocalOAuth2ImplementationWithPkce`                 | When the provider requires PKCE |
| Device Authorization         | `AbstractOAuth2Implementation` (under construction) | For devices without a browser   |
| Custom                       | `AbstractOAuth2Implementation`                      | Any non-standard flow           |

_Note:_ If a service prodiver offers both a Client Credentials flow and Device Authorization flow, the Client Credentials flow is overpreferred and should be used. The Device Authorization flow is only intended for devices that cannot display a browser. Currently a QR code is not supported in the Device Authorization.

## Implementing the config flow

The integration's config flow must extend `AbstractOAuth2FlowHandler`:

```python
from homeassistant.helpers import config_entry_oauth2_flow


class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """Handle the OAuth2 config flow."""

    DOMAIN = DOMAIN

    @property
    def logger(self) -> logging.Logger:
        """Return the logger."""
        return logging.getLogger(__name__)

    @property
    def extra_authorize_data(self) -> dict[str, Any]:
        """Return extra authorization parameters."""
        return {
            "scope": "access:offline",
        }
```

The `extra_authorize_data` property is where you define the OAuth scopes and any other provider specific parameters required during the authorization request.

### Reauthentication

By default, Home Assistant will handle the token refresh lifecycle and automatically attempt to refresh tokens when they expire. However, if a token becomes permanently invalid (for example, if the user revokes access from the provider's website), Home Assistant will trigger a reauthentication flow. To support this, add `async_step_reauth` in your config flow:

```python
async def async_step_reauth(
    self, entry_data: Mapping[str, Any]
) -> ConfigFlowResult:
    """Handle reauthentication."""
    return await self.async_step_reauth_confirm()

async def async_step_reauth_confirm(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Confirm reauthentication."""
    if user_input is None:
        return self.async_show_form(step_id="reauth_confirm")
    return await self.async_step_user()
```

## Making authenticated API requests

Use `OAuth2Session` to make authenticated requests. It automatically injects a valid access token into each request and handles token refresh transparently.

```python
from homeassistant.helpers import config_entry_oauth2_flow

session = config_entry_oauth2_flow.OAuth2Session(hass, entry, implementation)

# The session handles token refresh automatically
response = await session.async_request("GET", "https://api.example.com/data")
```

For integrations that use an external API client library, pass the token directly:

```python
access_token = await session.async_get_access_token()
client = ExternalApiClient(token=access_token)
```

### `async_get_access_token` vs `async_ensure_token_valid`

Both methods ensure a valid token is available, but behave differently:

- `async_get_access_token()` — refreshes the token if needed and **returns** the access token string. Use this when you need to pass the token to an external client.
- `async_ensure_token_valid()` — refreshes the token if needed but does **not** return the token. Use this when the session handles injection automatically and you just need to guarantee validity before proceeding.

Both methods raise the same exceptions on failure (see [Error handling](#error-handling) below).

## Error handling

When a token request or refresh fails, the OAuth 2.0 helper raises one of three exceptions defined in `homeassistant.helpers.config_entry_oauth2_flow`:

| Exception                          | HTTP status          | Meaning                                                                          |
| ---------------------------------- | -------------------- | -------------------------------------------------------------------------------- |
| `OAuth2TokenRequestReauthError`    | 400–499 (except 429) | Non-recoverable. The token is invalid and the user must reauthenticate.          |
| `OAuth2TokenRequestTransientError` | 500+ and 429         | Transient. The server is temporarily unavailable or rate-limited. Safe to retry. |
| `OAuth2TokenRequestError`          | Base class           | Catch-all for token request failures not covered by the above two.               |

All three exceptions inherit from `aiohttp.ClientResponseError` for backwards compatibility, but integrations should migrate to catching the new exceptions directly.

### Integrations using the Data Update Coordinator

If your integration uses the [Data Update Coordinator](/docs/integration_fetching_data/#coordinated-single-api-poll-for-data-for-all-entities), no special error handling is required. The coordinator automatically maps the new exceptions to the correct behavior:

- `OAuth2TokenRequestReauthError` raises `ConfigEntryAuthFailed`, triggering a reauthentication flow
- `OAuth2TokenRequestTransientError` treated as `UpdateFailed`, triggering the coordinator's retry mechanism

### Integrations without a Data Update Coordinator

If your integration does **not** use a coordinator, you must handle the exceptions explicitly wherever you call `async_get_access_token()` or `async_ensure_token_valid()`:

```python
from homeassistant.helpers.config_entry_oauth2_flow import (
    OAuth2TokenRequestError,
    OAuth2TokenRequestReauthError,
    OAuth2TokenRequestTransientError,
)
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady

try:
    await session.async_get_access_token()
except OAuth2TokenRequestReauthError as err:
    raise ConfigEntryAuthFailed(
        translation_domain=DOMAIN,
        translation_key="reauth_required",
    ) from err
except (OAuth2TokenRequestTransientError, OAuth2TokenRequestError) as err:
    raise ConfigEntryNotReady(
        translation_domain=DOMAIN,
        translation_key="auth_server_error",
    ) from err
```

### Migration from `aiohttp.ClientResponseError`

Prior to `2026.3`, integrations were expected to catch `aiohttp.ClientResponseError` directly. A compatibility shim means existing code will continue to work, but integrations should be updated to use the new exceptions:

```python
# Before, still works but discouraged
try:
    await session.async_get_access_token()
except aiohttp.ClientResponseError as err:
    if err.status in (401, 403):
        raise ConfigEntryAuthFailed(...) from err
    raise ConfigEntryNotReady(...) from err

# Preferred
try:
    await session.async_get_access_token()
except OAuth2TokenRequestReauthError as err:
    raise ConfigEntryAuthFailed(...) from err
except (OAuth2TokenRequestTransientError, OAuth2TokenRequestError) as err:
    raise ConfigEntryNotReady(...) from err
```

## Complete examples

### With Data Update Coordinator

```python
from homeassistant.helpers import config_entry_oauth2_flow
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed


class ExampleCoordinator(DataUpdateCoordinator[MyData]):
    """Coordinator for the Example integration."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        session: config_entry_oauth2_flow.OAuth2Session,
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            logger=logging.getLogger(__name__),
            name=DOMAIN,
            update_interval=timedelta(minutes=30),
        )
        self.session = session

    async def _async_update_data(self) -> MyData:
        """Fetch data from the API."""
        # Token refresh and OAuth exceptions are handled automatically
        # by the coordinator; no explicit try/except needed here
        access_token = await self.session.async_get_access_token()
        client = ExampleApiClient(token=access_token)
        try:
            return await client.async_get_data()
        except ApiClientError as err:
            raise UpdateFailed(f"Error communicating with API: {err}") from err
```

### Without Data Update Coordinator

```python
from homeassistant.helpers.config_entry_oauth2_flow import (
    OAuth2Session,
    OAuth2TokenRequestError,
    OAuth2TokenRequestReauthError,
    OAuth2TokenRequestTransientError,
)
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Example from a config entry."""
    implementation = await config_entry_oauth2_flow.async_get_config_entry_implementation(
        hass, entry
    )
    session = OAuth2Session(hass, entry, implementation)

    try:
        await session.async_ensure_token_valid()
    except OAuth2TokenRequestReauthError as err:
        raise ConfigEntryAuthFailed(
            translation_domain=DOMAIN,
            translation_key="reauth_required",
        ) from err
    except (OAuth2TokenRequestTransientError, OAuth2TokenRequestError) as err:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN,
            translation_key="auth_server_error",
        ) from err

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = session
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True
```

## Best practices

- Never catch `aiohttp.ClientResponseError` directly. Use the new OAuth exception hierarchy instead. The compatibility shim will eventually be removed.
- Use the Data Update Coordinator where possible. It handles token refresh errors automatically and reduces the amount of boilerplate in each integration.
- Don't put token logic in entity classes. Token management belongs in `async_setup_entry` or the coordinator, not in individual entity `async_update` methods.
- Always handle `OAuth2TokenRequestReauthError` explicitly in integrations that don't use a coordinator. Failing to do so means the user will never be prompted to reauthenticate.
- Raise `ConfigEntryNotReady` for transient errors. Transient errors are temporary and should be retried. Raise `ConfgEntryError` for non-recoverable errors. {MIGHT NEED TO EXPAND THIS WITH DUC METHODS}
- Always implement reauthentication (`async_step_reauth`) in your config flow so Home Assistant can prompt the user to re-link their account.
- Use `extra_authorize_data` to specify scopes and parameters required by the provider during authorization. This keeps your implementation clean and focused on the provider's requirements.
- Enfore JSON output from the token endpoint by setting `token_request_headers={"Accept": "application/json"}` in your implementation. This ensures consistent error handling across providers, as some return non-JSON responses on error by default. {WE STILL NEED TO BUILD THIS IN, THOUGH. CHECK THE PR UNDER REVIEW BY ALLENPORTER.}

## Reference

- [Blog post: Changes in OAuth 2.0 helper error handling](https://developers.home-assistant.io/blog/2026/02/19/oauth-token-request-error-handling)
