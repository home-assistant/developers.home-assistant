---
author: Erwin Douna
authorURL: https://github.com/erwindouna
authorImageURL: https://avatars.githubusercontent.com/u/5011203?s=96&v=4
title: "OAuth 2.0 device authorization grant"
---

## Summary

The OAuth 2.0 helper now supports the device authorization grant ([RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628)), next to the authorization code grant it already supported. With the device flow, Home Assistant requests a device code, shows the user a short code and a verification URL, and polls the provider until the user approves the request on another device.

Use it only for providers that don't offer the authorization code grant. When a provider supports both, the authorization code grant is preferred, and an integration implements one grant, never both. This follows [architecture discussion #1299](https://github.com/home-assistant/architecture/discussions/1299).

Existing integrations don't need any changes. This is implemented in core [PR #161715](https://github.com/home-assistant/core/pull/161715).

## Implementing the device flow

### Application credentials platform

A device flow integration ships its own public client ID, so users never add application credentials for it, and it doesn't appear in the application credentials dialog. Instead of `async_get_authorization_server`, the platform implements two methods:

```python
"""Application credentials platform for Example."""

from homeassistant.components.application_credentials import (
    DeviceFlowAuthorizationServer,
    DeviceFlowClientCredential,
)
from homeassistant.core import HomeAssistant


async def async_get_device_flow_authorization_server(
    hass: HomeAssistant,
) -> DeviceFlowAuthorizationServer:
    """Return the device authorization server."""
    return DeviceFlowAuthorizationServer(
        authorize_url="https://example.com/oauth/device/code",
        token_url="https://example.com/oauth/token",
    )


async def async_get_device_flow_client_credential(
    hass: HomeAssistant,
) -> DeviceFlowClientCredential:
    """Return the public client of the integration."""
    return DeviceFlowClientCredential(client_id="example-public-client-id")
```

`authorize_url` is the device authorization endpoint. A platform must implement both methods, and it can't also implement `async_get_authorization_server` or `async_get_auth_implementation`.

### Config flow

The config flow extends `AbstractOAuth2DeviceFlowHandler`. Scopes and other parameters for the device authorization request go in `extra_authorize_data`:

```python
"""Config flow for Example."""

import logging

from homeassistant.helpers import config_entry_oauth2_flow

from .const import DOMAIN


class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2DeviceFlowHandler, domain=DOMAIN
):
    """Config flow to handle Example OAuth2 authentication."""

    DOMAIN = DOMAIN

    @property
    def logger(self) -> logging.Logger:
        """Return logger."""
        return logging.getLogger(__name__)

    @property
    def extra_authorize_data(self) -> dict:
        """Extra data for the device authorization request."""
        return {"scope": "offline_access"}
```

While Home Assistant waits for the user, the flow shows the `wait_for_device` progress step. The integration provides its text in `strings.json`, with the `url`, `url_complete` and `code` placeholders. `url_complete` is the verification URL with the code included, when the provider sends one:

```json
{
  "config": {
    "progress": {
      "wait_for_device": "Open {url} and enter the code {code} to link your account."
    }
  }
}
```

The created config entry stores the token like the authorization code grant does, so `OAuth2Session` and token refresh work the same. Tokens without `expires_in`, which some providers issue, are treated as non-expiring.

## Changes to the OAuth 2.0 helper classes

`AbstractOAuth2Implementation` used to describe the authorization code grant only. It's now split:

- `AbstractOAuth2BaseImplementation` holds what every grant shares: `name`, `domain` and token refresh.
- `AbstractAuthorizationCodeImplementation` adds `async_generate_authorize_url` and `async_resolve_external_data`.
- `DeviceFlowImplementation` implements the device authorization grant on top of the base class.

`AbstractOAuth2Implementation` stays available as an alias of `AbstractAuthorizationCodeImplementation`, so implementations that subclass it keep working unchanged.

The functions that hold implementations of any grant are now typed with `AbstractOAuth2BaseImplementation`: `async_register_implementation`, `async_get_implementations`, `async_add_implementation_provider` and `OAuth2Session`. `async_get_config_entry_implementation` keeps returning `AbstractOAuth2Implementation`. Custom integrations that annotate the result of `async_get_implementations` with the old type may need to update their annotations to pass type checking; nothing changes at runtime.

More details are in the [OAuth 2.0](/docs/oauth2) and [application credentials](/docs/core/platform/application_credentials) documentation.
