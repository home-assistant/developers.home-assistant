---
title: "Handling Exceptions"
---




Operations like service calls and entity methods (e.g. *Set HVAC Mode*) should have proper exception handling. Raise `ValueError` on invalid user input and raise `HomeAssistantError` for other failures such as a problem communicating with a device. Note that the exception stack trace will be logged.

Raise `ServiceValidation` for validation error occurs during a service calls where printing a full stack trace to the logs is not warranted. This exceptions class will only log exception stack traces at debug level.

## Localizing Exceptions

Home Assistant [supports localization](/docs/internationalization/core/#exceptions) for `HomeAssistantError` and it's subclasses like `ServiceValidationError`.
