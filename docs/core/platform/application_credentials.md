---
title: "Application Credentials"
---

Integrations may support [Configuration via OAuth2](/docs/config_entries_config_flow_handler#configuration-via-oauth2) allowing
users to link their accounts. Integrations may add a `application_credentials.py` file and implement the functions described below.

OAuth2 requires credentials that are shared between an application and provider. In Home Assistant, integration specific OAuth2 credentials are  provided using one or more approaches:

- *Local OAuth with Application Credentials Component*: Users create their own credentials with the cloud provider, often acting as an application developer, and register the credentials with Home Assistant and the integration. This approach is *required* by all integrations that support OAuth2.
- *Cloud Account Linking with Cloud Component*: Nabu Casa registers credentials with the cloud provider, providing a seamless user experience. This approach provides a seamless user experience and is *recommended* ([more info](/docs/config_entries_config_flow_handler#configuration-via-oauth2)).

## Adding support

Integrations support application credentials with a file in the integration folder called `application_credentials.py` and implement the following:

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.application_credentials import AuthorizationServer


async def async_get_authorization_server(hass: HomeAssistant) -> AuthorizationServer:
    """Return authorization server."""
    return AuthorizationServer(
        authorize_url="https://example.com/auth",
        token_url="https://example.com/oauth2/v4/token"
    )
```

### AuthorizationServer

An `AuthorizationServer` represents the [OAuth2 Authorization server](https://datatracker.ietf.org/doc/html/rfc6749) used for an integration.

| Name          | Type |                                                                                                    | Description |
| ------------- | ---- | -------------------------------------------------------------------------------------------------- | ----------- |
| authorize_url | str  | **Required** | The OAuth authorize URL that the user is redirected to during the configuration flow. |
| token_url     | str  | **Required** | The URL used for obtaining an access token.                                           |

### Custom OAuth2 Implementations

Integrations may alternatively provide a custom `AbstractOAuth2Implementation` in `application_credentials.py` like the following:

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_entry_oauth2_flow
from homeassistant.components.application_credentials import AuthImplementation, AuthorizationServer, ClientCredential


class OAuth2Impl(AuthImplementation):
    """Custom OAuth2 implementation."""
    # ... Override AbstractOAuth2Implementation details

async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> config_entry_oauth2_flow.AbstractOAuth2Implementation:
    """Return auth implementation for a custom auth implementation."""
    return OAuth2Impl(
        hass,
        auth_domain,
        credential,
        AuthorizationServer(
            authorize_url="https://example.com/auth",
            token_url="https://example.com/oauth2/v4/token"
        )
    )
```

## Import YAML credentials

Credentials may be imported by integrations that used to accept YAML credentials using the import API `async_import_client_credential` provided by the application credentials integration.

### ClientCredential

A `ClientCredential` represents a client credential provided by the user.

| Name          | Type |                                                                           | Description |
| ------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| client_id     | str  | **Required** | The OAuth Client ID provided by the user.     |
| client_secret | str  | **Required** | The OAuth Client Secret provided by the user. |
