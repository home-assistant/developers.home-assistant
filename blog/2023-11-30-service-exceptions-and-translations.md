---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Exception handling during service calls and translation support
---

## Exception handling during service calls

Currently service calls that raise exceptions will log full stack traces. Service calls that fail due to invalid user input don't need a stack trace but would benefit from a helpful error message in the users own language.

To be able to suppress the stack trace in these cases, we introduce `ServiceValidationError` as a new exception type. The `ServiceValidationError` exception can be raised instead of `HomeAssistantError` during the execution of a service call. The error message will show in the UI, and in the logs. The stack trace is printed at debug level, to support development. For other exceptions that are raised from a service call (including  `HomeAssistantError`) nothing changes and a full stack trace is printed.

Integrations should be updated and raise `ServiceValidationError` instead of `ValueError` when the user did something wrong, and `HomeAssistantError` when it's not the user's fault. [Read more](/docs/core/platform/raising_exceptions).

## Translation support for Exceptions

The `HomeAssistantError` exception and its subclasses, including `ServiceValidationError`, now accept a translation key to allow localization. [Read more](/docs/internationalization/core/#exceptions). The translation key will be used in cases where the frontend receives information about the exception.

### Background

- Background [discussion](https://github.com/home-assistant/architecture/discussions/992).
- Implementation [Core PR #102592](https://github.com/home-assistant/core/pull/102592).
