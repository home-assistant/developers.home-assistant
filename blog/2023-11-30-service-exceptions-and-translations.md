---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Exception handling during service calls and translation support
---

## Exception handling during service calls

Service calls which raise exceptions have until now logged stack traces. Service calls that fail due to incorrect usage, for example invalid input, don't need a stack trace and would benefit from a helpful error message in the user's own language.

To be able to suppress the stack trace in these cases, the new exception type `ServiceValidationError`, which is derived from `HomeAssistantError`, has been introduced. `ServiceValidationError` should now be raised instead of `ValueError` when the service fails because it's used incorrectly. 

If the service is used correctly but unexpectedly fails, `HomeAssistantError`, or a subclass of `HomeAssistantError` other than `ServiceValidationError`, should still be raised.

When a service raises `ServiceValidationError`, the error message will show in the UI, and in the logs, but the stack trace is logged at debug level. For other exceptions that are raised from a service call (including  `HomeAssistantError`) nothing changes and a full stack trace is still printed at exception severity.

Integrations should be updated and raise `ServiceValidationError` instead of `ValueError` when the the service fails due to incorrect usage, and `HomeAssistantError` when it fails unexpectedly. [Read more](/docs/core/platform/raising_exceptions).

## Translation support for Exceptions

The `HomeAssistantError` exception and its subclasses, including `ServiceValidationError`, now accept a translation key to allow localization. [Read more](/docs/internationalization/core/#exceptions). The translation key will be used in cases where the frontend receives information about the exception.

### Background

- Background [discussion](https://github.com/home-assistant/architecture/discussions/992).
- Implementation [Core PR #102592](https://github.com/home-assistant/core/pull/102592).
