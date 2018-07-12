---
title: "Multi-factor Authentication Modules"
---

Multi-factor Authentication Modules are used in conjunction with [Authentication Provider](auth_auth_provider.html) to provide a fully configurable authentication framework. Each MFA module may provide one multi-factor authentication function. User can enable mulitple mfa module, but can only select one module in login process.

## Defining an mfa auth module

> We currently only support built-in mfa auth modules. Support for custom auth modules might arrive in the future.

Multi-facor Auth modules are defined in `homeassistant/auth/modules/<name of module>.py`. The auth module will need to provide an implementation of the `AuthModule` class.

For an example of a fully implemented auth module, please see [insecure_example.py](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/auth/modules/insecure_example.py).

Auth modules shall extend the following methods of `AuthModule` class.

| method | Required | Description
| ------ | -------- | -----------
| `@property def input_schema(self)` | Yes | Return a schema defined the user input form.
| `async def async_setup_user(self, user_id, **kwargs)` | Yes | Setup user for use this auth module
| `async def async_validation_flow(self, user_id, user_input)` | Yes | Given a user_id and user input, return valid user_id or raise InvalidAuth exception.
| `async def async_initialize(self)` | No | Optional intialization callback.

## Workflow

> TODO: draw a diagram

User == select auth provider ==> LoginFlow.init == input/validate username/password ==> LoginFlow.select_mfa_module ==> LoginFlow.mfa == input/validate MFA code ==> LoginFlow.finish ==> AuthProvider.get_or_create_credentials

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

Not like auth provider, auth module use session to manage the validation. After auth provider validated, auth module will create a validation session, include an experiation time and user_id from auth provider validate result. Auth moudle will not only verify the user input, and also verify the session is not experied. The validatoin session data storges in login flow instance.
