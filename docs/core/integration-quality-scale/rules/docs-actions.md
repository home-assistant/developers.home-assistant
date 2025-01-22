---
title: "The documentation describes the provided service actions that can be used"
---

## Reasoning

Integrations can register service actions to provide functionality that is not possible with standard entities.
These service actions can be harder to use than the standard service actions, so we want to make sure that the documentation describes both what they do, and what the parameters are.

## Example implementation

```markdown showLineNumbers
## Actions

The integration provides the following actions.

### Action: Get schedule

The `my_integration.get_schedule` service is used to fetch a schedule from the integration.

| Data attribute         | Optional | Description                                          |
|------------------------|----------|------------------------------------------------------|
| `config_entry_id`      | No       | The ID of the config entry to get the schedule from. |
```

## Exceptions

There are no exceptions to this rule.
