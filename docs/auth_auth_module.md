---
title: "Multi-factor Authentication Modules"
---

Multi-factor Authentication Modules are used in conjunction with [Authentication Provider](auth_auth_provider.html) to provide a fully configurable authentication framework. Each MFA module may provide one multi-factor authentication function. User can enable mulitple mfa module, but can only select one module in login process.

## Defining an mfa auth module

> We currently only support built-in mfa auth modules. Support for custom auth modules might arrive in the future.

Multi-facor Auth modules are defined in `homeassistant/auth/mfa_modules/<name of module>.py`. The auth module will need to provide an implementation of the `MultiFactorAuthModule` class.

For an example of a fully implemented auth module, please see [insecure_example.py](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/auth/mfa_modules/insecure_example.py).

Multi-factor Auth modules shall extend the following methods of `MultiFactorAuthModule` class.

| method | Required | Description
| ------ | -------- | -----------
| `@property def input_schema(self)` | Yes | Return a schema defined the user input form.
| `@property def setup_schema(self)` | No | Return a schema defined the setup input form.
| `async def async_setup_user(self, user_id, setup_data)` | Yes | Set up user for use this auth module.
| `async def async_depose_user(self, user_id)` | Yes | Remove user information from this auth module.
| `async def async_is_user_setup(self, user_id)` | Yes | Return whether user is set up.
| `async def async_validation(self, user_id, user_input)` | Yes | Given a user_id and user input, return valiidation result.

## Workflow

To use a MFA auth module, user has to be created first, then call `AuthManager.async_enable_user_mfa` to setup.

> TODO: draw a diagram

User == select auth provider ==> LoginFlow.init == input/validate username/password ==> LoginFlow.finish ==> if user enabled mfa ==> LoginFlow.select_mfa_module ==> LoginFlow.mfa == input/validate MFA code ==> LoginFlow.finish ==> Done

## Configuration example

```yaml
# configuration.xml
homeassistant:
  auth_providers:
    - type: homeassistant
    - type: legacy_api_password
  auth_mfa_modules:
    - type: totp
    - type: insecure_example
      users: [{'user_id': 'a_32_bytes_length_user_id', 'pin': '123456'}]
auth:        
```

In this example, user will first select from `homeassistant` or `legacy_api_password` auth provider. For `homeassistant` auth provider, user will first input username/password, if that user enabled both `totp` and `insecure_example`, then user need select one auth module, then input Google Authenticator code or input pin code base on the selection.

> insecure_example is only for demo purpose, please do not use it in production.

## Validation session

Not like auth provider, auth module use session to manage the validation. After auth provider validated, mfa module will create a validation session, include an experiation time and user_id from auth provider validate result. Mutli-factor auth moudle will not only verify the user input, and also verify the session is not experied. The validatoin session data storges in login flow instance.
