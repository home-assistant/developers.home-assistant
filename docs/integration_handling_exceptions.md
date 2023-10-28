---
title: "Handling exceptions"
---




Operations like service calls and entity methods (e.g. *Set HVAC Mode*) should have proper exception handling. Raise `ValueError` on invalid user input and raise `HomeAssistantError` for other failures such as a problem communicating with a device. Note that the exception stack trace will be logged.

Raise `ServiceValidation` for validation error occurs during a service calls. This will only log exception stack traces at debug level.

Home Assistant [support localization](/docs/internationalization/core/#exceptions) for `HomeAssistantError` and it's subclasses like `ServiceValidationError`.
