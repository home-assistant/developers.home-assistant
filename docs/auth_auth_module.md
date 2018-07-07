---
title: "Authentication Modules"
---

Authentication Modules are used in conjunction with [Authentication Provider](auth_auth_provider.html) to provide a fully configurable authentication framework. Each auth module may provide one 2FA authentication function, auth provider can work with one or many auth modules.

## Defining an auth module

> We currently only support built-in auth modules. Support for custom auth modules might arrive in the future.

Auth modules are defined in `homeassistant/auth_providers/modules/<name of module>.py`. The auth module will need to provide an implementation of the `AuthModule` class.

For an example of a fully implemented auth module, please see [insecure_example.py](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/auth_providers/modules/insecure_example.py).

Auth modules shall extend the following methods of `AuthModule` class.

| method | Required | Description
| ------ | -------- | -----------
| @property def input_schema(self)| Yes | Return a schema defined the user input form.
| async def async_validation_flow(self, session_data, user_input) | Yes | Given a validation session data and user input, return valid username or raise InvalidAuth exception.
| async def async_initialize(self)| No | Optional intialization callback.

## Workflow

> TODO: draw a diagram

User == select auth provider ==> LoginFlow.init == input/validate username/password ==> LoginFlow.finish == if auth module configed ==> LoginFlow.auth_module step == input/validate 2FA code ==> if no more auth module ==> AuthProvider.get_or_create_credentials

## Configuration example

```yaml
# configuration.xml
homeassistant:
  auth_providers:
    - type: homeassistant
      modules:
        - type: totp
    - type: legacy_api_password
      modules:
        - type: insecure_example
          users: [{'username': 'homeassistant', 'pin': '123456'}]
        - type: totp
auth:        
```

In this example, user will first select from homeassistant or legacy_api_password auth provider. For `homeassistant` auth provider, user will first input username/password, then input Google Authenticator code for the username. For 'legacy_api_password` auth provider, user will first input api password, then verify the pin, then input Google Authenticator code for 'homeassistant' user.

> insecure_example is only for demo purpose, please do not use it in production.

## Validation session

Not like auth provider, auth module use session to manage the validation. After auth provider validated, auth module will create a validation session, include an experiation time and username from auth provider validate result. Auth moudle will not only verify the user input, and also verify the session is not experied. The validatoin session data will be storaged in memory only.

Session related functions fully implementated in `AuthModule` class.

