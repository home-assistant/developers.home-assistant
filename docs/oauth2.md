---
title: "OAuth 2.0 support"
---

Integrations that connect to cloud services often need to authenticate users via OAuth 2.0. Home Assistant provides a set of helpers in `homeassistant.helpers.config_entry_oauth2_flow` that handle the OAuth 2.0 flow, token storage, and token refresh lifecycle — so integrations don't have to implement this themselves.

This page covers how to implement OAuth 2.0 in an integration, how to handle errors and best practices. If you are building a third-party library that will be used by an integration, see the [library authentication](/docs/api_lib_auth#oauth2) guide instead.

Before reading this page, make sure you are familiar with [Application credentials](/docs/core/platform/application_credentials) and [Config entries](/docs/config_entries_index).

## Overview

Home Assistant's OAuth 2.0 helper provides:

- A built-in Authorization Code flow via `config_entry_oauth2_flow`.
- Automatic token refresh when an access token expires.
- A session helper (`OAuth2Session`) for making authenticated API requests.
- Error handling via a set of semantic exceptions

The helper supports two credential approaches, both of which require `application_credentials` support: application provided credentials (where the integration ships its own client ID and  client secret) and user-provided credentials (where the user supplies their own OAuth 2.0 client credentials via the UI).

Use the built-in `config_entry_oauth2_flow` helper for Authorization Code flows. In the helper there are existing template flows that inherit from `AbstractOAuth2FlowHandler`. Only build own child flows of `AbstractOAuth2FlowHandler` if it's needed.

## Supported OAuth 2.0 flows

| Flow                         | Class                               | When to use                     |
| ---------------------------- | ----------------------------------- | ------------------------------- |
| Authorization code           | `LocalOAuth2Implementation`         | Standard browser-based flow     |
| Authorization code with PKCE | `LocalOAuth2ImplementationWithPkce` | When the provider requires PKCE |

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

Home Assistant will refresh the access token when `async_ensure_token_valid` is called. However, if a token becomes permanently invalid (for example, if the user revokes access from the provider's website), Home Assistant will trigger a reauthentication flow. To support this, add `async_step_reauth` in your config flow:

```python
class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """Config flow to handle OAuth2 authentication."""

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """Perform reauth upon an API authentication error."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Dialog that informs the user that reauth is required."""
        if user_input is None:
            return self.async_show_form(
                step_id="reauth_confirm",
                data_schema=probatio.Schema({}),
            )
        return await self.async_step_user()

    async def async_oauth_create_entry(self, data: dict) -> dict:
        """Create an oauth config entry or update existing entry for reauth."""
        await self.async_set_unique_id(user_id)
        if self.source == SOURCE_REAUTH:
            self._abort_if_unique_id_mismatch()
            return self.async_update_reload_and_abort(
                self._get_reauth_entry(),
                data_updates=data,
            )
        self._abort_if_unique_id_configured()
        return await super().async_oauth_create_entry(data)
```

## Making authenticated API requests

Use `OAuth2Session` to make authenticated requests. It automatically injects a valid access token into each request and handles token refresh transparently.

```python
from homeassistant.helpers import config_entry_oauth2_flow

session = config_entry_oauth2_flow.OAuth2Session(hass, entry, implementation)
```

In the library, use the session to make requests. The library calls `async_ensure_token_valid()` before each request to guarantee a fresh token, then reads the token from `session.token`:

```python
# Inside the library; called before every API request
await session.async_ensure_token_valid()
access_token = session.token["access_token"]
```


- `async_ensure_token_valid` - refreshes the token if needed. This needs to be done before every request to ensure there's a valid token. The token can be obtained from the `OAuth2Session.token` property.

See [Error handling](#error-handling) below for how to handle errors during token requests.

## Error handling

When a token request fails, the OAuth 2.0 helper raises one of the following exceptions from `homeassistant.exceptions`. Each one is also a config entry exception that describes what should happen, and carries a translated message, so integrations don't need to map them or add them to `strings.json`.

| Exception                           | Cause                                                             | Also a                  |
| ----------------------------------- | ----------------------------------------------------------------- | ----------------------- |
| `OAuth2TokenRequestReauthError`     | HTTP status 400–499, except 429                                   | `ConfigEntryAuthFailed` |
| `OAuth2TokenRequestTransientError`  | HTTP status 429 or 500–599                                        | `ConfigEntryNotReady`   |
| `OAuth2TokenRequestError`           | Any other HTTP status. Base class of the two exceptions above.    | `ConfigEntryNotReady`   |
| `OAuth2TokenRequestConnectionError` | No response, or a response without a usable token                 | `ConfigEntryNotReady`   |

`async_get_config_entry_implementation` works the same way: it raises `ImplementationUnavailableError` (a `ConfigEntryNotReady`) or `UnknownImplementationError` (a `ConfigEntryAuthFailed`).

For backwards compatibility, the token request exceptions also inherit from `aiohttp.ClientResponseError` (`OAuth2TokenRequestConnectionError` from `aiohttp.ClientError`).

When `async_ensure_token_valid` raises `OAuth2TokenRequestReauthError`, it has already started the reauthentication flow.

### Integrations using the Data Update Coordinator

If your integration uses the [Data Update Coordinator](/docs/integration_fetching_data/#coordinated-single-api-poll-for-data-for-all-entities), no special error handling is required. The coordinator handles the exceptions:

- `OAuth2TokenRequestReauthError` starts a reauthentication flow
- The other token request exceptions are treated as `UpdateFailed`, triggering the coordinator's retry mechanism

Make sure to do a first coordinator refresh during config entry setup, to ensure the access token is refreshed before entities are set up:

```python
await coordinator.async_config_entry_first_refresh()
```

### Integrations without a Data Update Coordinator

If your integration does **not** use a coordinator, call `async_ensure_token_valid()` in `async_setup_entry` and let the exceptions propagate. Home Assistant then retries the setup or starts a reauthentication flow:

```python
await session.async_ensure_token_valid()
```

Only catch an exception when your integration needs different behavior, for example to raise `ConfigEntryError` for a status that is permanent for this provider. Catch the most specific exception and let the others propagate.

## Complete examples

### With Data Update Coordinator

Look at the [library guide](/docs/api_lib_auth) on authentication for more information on building a 3rd party library with OAuth 2.0 for an integration. The following examples act merely as an example how to interlink a library with OAuth2.0 in the Data Update Coordinator.

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
            config_entry=entry,
            update_interval=timedelta(minutes=30),
        )
        self._client = ExampleApiClient(session=session)

    async def _async_update_data(self) -> MyData:
        """Fetch data from the API."""       
        try:
            return await self._client.async_get_data()
        except ApiClientError as err:
            raise UpdateFailed(f"Error communicating with API: {err}") from err
```

### Without Data Update Coordinator

```python
from homeassistant.helpers import config_entry_oauth2_flow
from homeassistant.helpers.config_entry_oauth2_flow import OAuth2Session


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Example from a config entry."""
    implementation = await config_entry_oauth2_flow.async_get_config_entry_implementation(
        hass, entry
    )
    session = OAuth2Session(hass, entry, implementation)
    await session.async_ensure_token_valid()

    entry.runtime_data = ExampleApiClient(session=session)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True
```

## Best practices

- Let the OAuth 2.0 exceptions propagate. The helper and config entry setup already handle them, so don't map them to `ConfigEntryNotReady` or `ConfigEntryAuthFailed` yourself.
- Use the Data Update Coordinator where possible. It handles token refresh errors automatically and reduces the amount of boilerplate in each integration.
- Don't put token logic in entity classes. Token management belongs in `async_setup_entry` or the coordinator, not in individual entity `async_update` methods.
- Always implement reauthentication (`async_step_reauth`) in your config flow so Home Assistant can prompt the user to re-link their account.
- Use `extra_authorize_data` to specify scopes and parameters required by the provider during authorization. This keeps your implementation clean and focused on the provider's requirements.

## Reference

- [Blog post: Changes in OAuth 2.0 helper error handling](https://developers.home-assistant.io/blog/2026/02/19/oauth-token-request-error-handling)
- [Blog post: OAuth2 error handling moved into the helper](https://developers.home-assistant.io/blog/2026/09/07/oauth2-central-error-handling)
