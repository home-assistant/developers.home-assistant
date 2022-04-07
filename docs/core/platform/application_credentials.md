---
title: "Application Credentials"
---

Integrations support [Configuration via OAuth2](https://developers.home-assistant.io/docs/config_entries_config_flow_handler#configuration-via-oauth2) and the preferred approach is to use the Home Assistant Cloud Account Linking service. Integrations may also allow users to provide their own OAuth client credentials by adding a `application_credentials.py` and implementing the right functions.

:::note
Application Credentials is under active development and integrations should still prefer using `LocalOAuth2Implementation`.
:::

## Adding support

Integrations support application credentials with a file in the integration folder called `application_credentials.py` and implement the following:

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.application_credentials import AuthorizationServer


async def async_get_authorization_server(
    self, hass: HomeAssistant
) -> AuthorizationServer:
    """Return authorization server."""
    return AuthorizationServer(
        authorize_url="https://example.com/auth",
        token_url="https://example.com/oauth2/v4/token"
    )
```

See below for details on backwards compatibility with YAML credentials.

## AuthorizationServer

An `AuthorizationServer` represents the [OAuth2 Authorization server](https://datatracker.ietf.org/doc/html/rfc6749) used for an integration.

| Name          | Type |                                                                                                    | Description |
| ------------- | ---- | -------------------------------------------------------------------------------------------------- | ----------- |
| authorize_url | str  | **Required** | The OAuth authorize URL that the user is redirected to during the configuration flow. |
| token_url     | str  | **Required** | The URL used for obtaining an access token.                                           |

## Import YAML credentials

Credentials may be imported by integrations that used to accept YAML credentials using the import API `async_import_client_credential` provided by the application credentials integration.

The `auth_domain` is the domain for the auth implementation in in the config entry, which is typically the domain specified in  an existing `LocalOAuth2Implementation`.

## ClientCredential

A `ClientCredential` represents the a client credential provided by the user.

| Name          | Type |                                                                           | Description |
| ------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| client_id     | str  | **Required** | The OAuth Client ID provided by the user.     |
| client_secret | str  | **Required** | The OAuth Client Secret provided by the user. |