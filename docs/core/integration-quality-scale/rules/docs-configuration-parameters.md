---
title: "The documentation describes all integration configuration options"
---

## Reasoning

Integrations can provide an options flow to allow users to change integration configuration.
This rule ensures that all configuration options are documented so that users can understand what each option does and how to use it.

## Example implementation

The following example is for an integration with multiple configuration options, using the `configuration_basic` tag.

```markdown showLineNumbers
{% include integrations/option_flow.md %}

{% configuration_basic %}
Country code:
  description: You can specify the country code (NL or BE) of the country to display on the camera.
Timeframe:
  description: Minutes to look ahead for precipitation forecast sensors (minimum 5, maximum 120).
{% end configuration_basic %}

```

## Exceptions

There are no exceptions to this rule.
