---
title: Authentication Providers
id: version-0.72-auth_auth_provider
original_id: auth_auth_provider
---

Authentication providers confirm the identity of users. The user proofs their identity by going through the login flow for an auth provider. The auth provider defines the login flow and can ask the user all information this needs. This will commonly be username and password but could also include a 2FA token or other challenges.

Once an authentication provider has confirmed the identity of a user, it will pass that on to Home Assistant in the form of a Credentials object.

## Defining an auth provider

> We currently only support built-in auth providers. Support for custom auth providers might arrive in the future.

Auth providers are defined in `homeassistant/auth_providers/<name of provider>.py`. The auth provider module will need to provide an implementation of the `AuthProvider` class and contain a credential flow. This flow is what asks user for information and validates it.

For an example of a fully implemented auth provider, please see [insecure_example.py](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/auth_providers/insecure_example.py).

Auth providers can extend the following methods.

| method | Required | Description
| ------ | -------- | -----------
| async def async_credential_flow(self) | Yes | Return an instance of the credential flow for a user to identify itself.
| async def async_get_or_create_credentials(self, flow_result) | Yes | Given the result of a credential flow, return a credentials object. This can either be an existing one or a new one.
| async def async_initialize(self) | No | Callback callled once before interacting with the auth provider for the first time.
| async def async_user_meta_for_credentials(credentials) | No | Callback called Home Assistant is going to create a user from a Credentials object. Can be used to populate extra fields for the user.
