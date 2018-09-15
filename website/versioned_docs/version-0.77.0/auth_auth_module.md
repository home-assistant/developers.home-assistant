---
title: Multi-factor Authentication Modules
id: version-0.77.0-auth_auth_module
original_id: auth_auth_module
---

Multi-factor Authentication Modules are used in conjunction with [Authentication Provider](auth_auth_provider.html) to provide a fully configurable authentication framework. Each MFA module may provide one multi-factor authentication function. User can enable multiple mfa modules, but can only select one module in login process.

## Defining an mfa auth module

> We currently only support built-in mfa auth modules. Support for custom auth modules might arrive in the future.

Multi-facor Auth modules are defined in `homeassistant/auth/mfa_modules/<name of module>.py`. The auth module will need to provide an implementation of the `MultiFactorAuthModule` class.

For an example of a fully implemented auth module, please see [insecure_example.py](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/auth/mfa_modules/insecure_example.py).

Multi-factor Auth modules shall extend the following methods of `MultiFactorAuthModule` class.

| method | Required | Description
| ------ | -------- | -----------
| `@property def input_schema(self)` | Yes | Return a schema defined the user input form.
| `async def async_setup_flow(self, user_id)` | Yes | Return a SetupFlow to handle the setup workflow.
| `async def async_setup_user(self, user_id, setup_data)` | Yes | Set up user for use this auth module.
| `async def async_depose_user(self, user_id)` | Yes | Remove user information from this auth module.
| `async def async_is_user_setup(self, user_id)` | Yes | Return whether user is set up.
| `async def async_validation(self, user_id, user_input)` | Yes | Given a user_id and user input, return valiidation result.

## Setup Flow

Before user can use a multi-factor auth module, it has to be enabled or set up. All availaable modules will be listed in user profile page, user can enable the module he/she wants to use. A setup data entry flow will guide user finish the necessary steps.

Each MFA module need to implement a setup flow handler extends from `mfa_modules.SetupFlow` (if only one simple setup step need, `SetupFlow` can be used as well). For example for Google Authenticator (TOTP, Time-based One Time Password) module, the flow will need to be:
- Generate a secret and store it on instance of setup flow
- Return `async_show_form` with a QR code in the description (injected as base64 via `description_placeholders`)
- User scans code and enters a code to verify it scanned correctly and clock in synced
- TOTP module saved the secret along with user_id, module is enabled for user

## Workflow

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
