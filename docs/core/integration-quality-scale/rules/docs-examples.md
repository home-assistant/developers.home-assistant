---
title: "The documentation provides automation examples the user can use."
sidebar_label: 🥇 docs-examples
---

## Reasoning

To show how the integration can be used, provide a limited set of common or useful automation examples.
These can be provided as blueprints or YAML automation examples.
This helps users get started with the integration faster and more easily.

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

Integrations that do not create entities or provide actions, or that only extend core functionality (for example, backup-only integrations), are exempt from this rule.
