---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Exception handling during and translation support
---

## Exception handling during service calls

When an exception is raised during a service call and the printing of stack traces is not warranted, then this can cause that the logs are being spammed. This happens when validation violations cause a service call to fail and we can print a clear error message but do not need a stack trace to make thing clear.

To be able to suppress the stack trace in these cases , we introduce `ServiceValidationError` as a new exception type. The `ServiceValidationError` exception can be raised instead of `HomeAssistantError` during the execution of a service call. The error message is to be shown to through the UI, and in the logs. The stack trace is printed at debug level, so it is still possible to print it to support development. In case an other exception is raised during a service (including  `HomeAssistantError`) nothing changes and a full stack trace will be printed. [Read more](/docs/integration_handling_exceptions).

## Translation support for Exceptions

When we know about the exception we raise for, and we are showing the error message through the UI, we now can add a translation key to `HomeAssistantError` and it's sub classes like the new `ServiceValidationError` Exception to allow localization. [Read more](/docs/internationalization/core/#exceptions).

### Background

- Background [discussion](https://github.com/home-assistant/architecture/discussions/992).
- Implementation [Core PR #102592](https://github.com/home-assistant/core/pull/102592).
