---
title: "The documentation provides automation examples the user can use."
sidebar_label: 🥇 docs-examples
---

## Reasoning

To show how the integration can be used, provide a limited set of common or useful automation examples.
This helps users get started with the integration faster and more easily.

Examples can be provided as inline YAML automations or as reusable blueprints.
Use a blueprint when the example is a reusable, configurable automation that is useful to import as a complete workflow.
Use inline YAML when a concise example better demonstrates how to combine the integration's entities, triggers, or actions.
Don't create a blueprint solely to satisfy this rule, and don't package a workaround for an integration limitation as a blueprint.

Blueprints can be uploaded either to the blueprints folder under [`https://github.com/home-assistant/home-assistant.io/tree/current/source/blueprints/integrations`](https://github.com/home-assistant/home-assistant.io/tree/current/source/blueprints/integrations), or to the [blueprint exchange on the forums](https://community.home-assistant.io/c/blueprints-exchange). On the integration page, add a link to the blueprint.

Don't use the documentation pages as a collection or as a replacement for the blueprint folder or the blueprint exchange.

## Example implementation

```markdown showLineNumbers
## Examples

### Turning off the LEDs during the night
The status LEDs on the device can be quite bright.
To tackle this, you can use this blueprint to easily automate the LEDs turning off when the sun goes down.

link to blueprint
```

## Exceptions

There are no exceptions to this rule.
