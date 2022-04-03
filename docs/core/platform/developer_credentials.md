---
title: "Developer Credentials"
---

Integrations support [Configuration via OAuth2](https://developers.home-assistant.io/docs/config_entries_config_flow_handler#configuration-via-oauth2) and the preferred approach is to use the Home Assistant Clount Account Linking service. Integrations may also allow users to provide their own developer credentials by adding a `developer_credentials.py` and implementing the right functions.

:::note
Developer Credentials is under active development and integrations should still prefer using
`LocalOAuth2Implementation`.
:::

## Adding support

Integrations support developer credentials with a file in the integration folder called `developer_credentails.py` and implement the following:

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.developer_credentials.AuthorizationServer
from homeassistant.components.developer_credentials.DeveloperCredential


async def async_get_authorization_server(
    self, hass: HomeAssistant
) -> AuthorizationServer:
    """Return authorization server."""
    return AuthorizationServer(
        authorize_url="https://example.com/auth",
        token_url="https://example.com/oauth2/v4/token"
    )


# Optional and provided only for backwards compatibility if integration used to
# accept YAML credentials. Return YAML client ID and secret.
async def async_get_developer_credential(
    self, hass: HomeAssistant
) -> DeveloperCredential:
    """Return a developer credential from configuration.yaml."""
```

## AuthorizationServer

A `AuthorizationServer` represents the [OAuth2 Authorization server](https://datatracker.ietf.org/doc/html/rfc6749) used for an integration.

| Name          | Type |                                                                                                    | Description |
| ------------- | ---- | -------------------------------------------------------------------------------------------------- | ----------- |
| authorize_url | str  | **Required** | The OAuth authorize URL that the user is redirected to during the configuration flow. |
| token_url     | str  | **Required** | The URL used for obtaining an access token.                                           |

## DeveloperCredential

A `DeveloperCredential` represents the a developer credential provided by the user. This is only provided for backward compatibility by integrations that allowed users to specify developer credentials via `configuration.yaml`.

| Name          | Type |                                                                           | Description |
| ------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| client_id     | str  | **Required** | The developer credential client ID provided by the user.     |
| client_secret | str  | **Required** | The developer credential client secret provided by the user. |
