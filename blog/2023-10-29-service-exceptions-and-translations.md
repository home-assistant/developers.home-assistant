---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Exception handling during and translation support
---

## Exception handling during service calls

Currently service calls that raise exceptions will log full stack traces. Service calls that fail due to invalid user input don't need a stack trace but would benefit from a helpful error message in the users own language.

To be able to suppress the stack trace in these cases, we introduce `ServiceValidationError` as a new exception type. The `ServiceValidationError` exception can be raised instead of `HomeAssistantError` during the execution of a service call. The error message is to be shown to through the UI, and in the logs. The stack trace is printed at debug level, so it is still possible to print it to support development. In case an other exception is raised during a service (including  `HomeAssistantError`) nothing changes and a full stack trace will be printed. [Read more](/docs/core/platform/handling_exceptions).

## Translation support for Exceptions

The `HomeAssistantError` exception and it's sub classes, including `ServiceValidationError`, now accept a translation key to allow localization. [Read more](/docs/internationalization/core/#exceptions). The translation key will be used in cases where the frontend receives information about the exception.

### Background

- Background [discussion](https://github.com/home-assistant/architecture/discussions/992).
- Implementation [Core PR #102592](https://github.com/home-assistant/core/pull/102592).
