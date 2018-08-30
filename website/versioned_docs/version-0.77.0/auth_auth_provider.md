---
title: Authentication Providers
id: version-0.77.0-auth_auth_provider
original_id: auth_auth_provider
---

Authentication providers confirm the identity of users. The user proofs their identity by going through the login flow for an auth provider. The auth provider defines the login flow and can ask the user all information this needs. This will commonly be username and password but could also include a 2FA token or other challenges.

Once an authentication provider has confirmed the identity of a user, it will pass that on to Home Assistant in the form of a Credentials object.

## Defining an auth provider

> We currently only support built-in auth providers. Support for custom auth providers might arrive in the future.

Auth providers are defined in `homeassistant/auth/providers/<name of provider>.py`. The auth provider module will need to provide an implementation of the `AuthProvider` class and `LoginFlow` class, it is what asks user for information and validates it base on `data_entry_flow`.

For an example of a fully implemented auth provider, please see [insecure_example.py](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/auth/providers/insecure_example.py).

Auth providers shall extend the following methods of `AuthProvider` class.

| method | Required | Description
| ------ | -------- | -----------
| async def async_login_flow(self) | Yes | Return an instance of the login flow for a user to identify itself.
| async def async_get_or_create_credentials(self, flow_result) | Yes | Given the result of a login flow, return a credentials object. This can either be an existing one or a new one.
| async def async_user_meta_for_credentials(credentials) | No | Callback called Home Assistant is going to create a user from a Credentials object. Can be used to populate extra fields for the user.

Auth providers shall extend the following methods of `LoginFlow` class.

| method | Required | Description
| ------ | -------- | -----------
| async def async_step_init(self, user_input=None) | Yes | Handle the login form, see more detail in below.

## async_step_init of LoginFlow

> We may change this inteface in near future.

`LoginFlow` extends `data_entry_flow.FlowHandler`. The first step of data entry flow is hard coded as `init`, so each flow has to implement `async_step_init` method. The pattern of `async_step_init` likes following pseudo-code:

```python
async def async_step_init(self, user_input=None):
    return self.async_show_form(step_id='init', data_schema='some schema to construct ui form') if user_input is None
    return self.async_show_form(step_id='init', errors) if user_input is invalid
    return await self.async_finish(username) if user_input is valid
```
