---
title: "Exception messages are translatable (IQS030)"
related_rules:
  - entity-translations
  - action-exceptions
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Sometimes something goes wrong and we want to show an error message to the user.
Since Home Assistant is used by people all over the world, it is important that these error messages are translatable.
This increases the usability of Home Assistant for people who do not use the application in English.

Home Assistant has builtin support for translating messages coming from the `HomeAssistantError` exception.

## Example implementation

In this example, we show a function registered as a Home Assistant service action.
The integration domain and the key to the translation are passed along when raising the exception.
The exception should inherit `HomeAssistantError` to support translations.
The error message is then defined in the integration `strings.json` file.

```python {6-9,13-16} showLineNumbers
async def async_set_schedule(call: ServiceCall) -> ServiceResponse:
    """Set the schedule for a day."""
    start_date = call.data[ATTR_START_DATE]
    end_date = call.data[ATTR_END_DATE]
    if end_date < start_date:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="end_date_before_start_date",
        )
    try:
        await client.set_schedule(start_date, end_date)
    except MyConnectionError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="cannot_connect_to_schedule",
        ) from err
```

`strings.json`:
```json
{
    "exceptions": {
        "end_date_before_start_date": "The end date cannot be before the start date.",
        "cannot_connect_to_schedule": "Cannot connect to the schedule."
    }
}
```

## Additional resources

For more info on raising exceptions, check the [documentation](../../platform/raising_exceptions).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
