---
title: "Raising Exceptions"
---

## Raising Exceptions in service handlers

Operations like service calls and entity methods (e.g. *Set HVAC Mode*) should raise exceptions properly.

Integrations should raise `ServiceValidationError` (instead of `ValueError`) in case when the user did something wrong. In this case a stack trace will only be printed at debug level.

For other failures such as a problem communicating with a device, `HomeAssistantError` should be raised. Note that the exception stack trace will be printed to the log in this case.

## Localizing Exceptions

Home Assistant [supports localization](/docs/internationalization/core/#exceptions) for `HomeAssistantError` and its subclasses like `ServiceValidationError`.
