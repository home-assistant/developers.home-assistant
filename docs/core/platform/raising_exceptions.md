---
title: "Raising Exceptions"
---

Operations like service calls and entity methods (e.g. *Set HVAC Mode*) should raise exceptions properly. Raise `ServiceValidationError` on an invalid user input and raise `HomeAssistantError` for other failures such as a problem communicating with a device. Note that the exception stack trace will be logged.

Raise `ServiceValidationError` for validation errors that occur during service calls where printing a full stack trace to the logs is not warranted. This exception class will only log exception stack traces at debug level.

## Localizing Exceptions

Home Assistant [supports localization](/docs/internationalization/core/#exceptions) for `HomeAssistantError` and it's subclasses like `ServiceValidationError`.
