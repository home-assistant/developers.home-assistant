---
title: "Service actions raise exceptions when encountering failures (IQS017)"
related_rules:
  - exception-translations
  - action-setup
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Things can go wrong when a service action is performed.
When this happens, the integration should raise an exception to indicate that something went wrong.
The exception message will be shown to the user in the UI, and can be used to help diagnose the issue.
The message will either be generated from the attached translation string or from the exception argument.

## Example implementation

When the problem is caused by incorrect usage (for example incorrect input or referencing something that does not exist) we should raise a `ServiceValidationError`.
When the problem is caused by an error in the service action itself (for example, a network error or a bug in the service), we should raise a `HomeAssistantError`.

In this example, we show a function that is registered as a service action in Home Assistant.
If the input is incorrect (when the end date is before the start date), a `ServiceValidationError` is raised, and if we can't reach the service, we raise a `HomeAssistantError`.

```python {6,10} showLineNumbers
async def async_set_schedule(call: ServiceCall) -> ServiceResponse:
    """Set the schedule for a day."""
    start_date = call.data[ATTR_START_DATE]
    end_date = call.data[ATTR_END_DATE]
    if end_date < start_date:
        raise ServiceValidationError("End date must be after start date")
    try:
        await client.set_schedule(start_date, end_date)
    except MyConnectionError as err:
        raise HomeAssistantError("Could not connect to the schedule") from err
```

## Additional resources

For more info on raising exceptions, check the [documentation](../../platform/raising_exceptions).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>