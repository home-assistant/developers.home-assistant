---
author: Aidan Timson
authorURL: https://github.com/timmo001
title: Registering custom dashboard strategies
---

As of Home Assistant 2026.5, you can now register custom dashboard strategies, just as you can with [custom cards](/docs/frontend/custom-ui/custom-card), making them easier to discover and add using the **new dashboard** dialog under the **Community dashboards** section.

Previously, you had to send users to create a blank dashboard, edit in YAML mode, and paste in your custom strategy. Now you can register a friendly name, description, and documentation.

To register your strategy, call `window.customStrategies.push()` with an object containing the following keys:

- `type`: The strategy type without the `custom:` prefix, for example `"my-demo"`.
- `strategyType`: Set to `"dashboard"` to register a dashboard strategy.
- `name`: The friendly name of the strategy.
- `description` (`optional`): A short description of the strategy.
- `documentationURL` (`optional`): A URL to the documentation for the strategy. This is not shown in the strategy UI yet but may in the future.

Example:

```js
if (window.customStrategies) {
  window.customStrategies.push({
    type: "my-demo",
    strategyType: "dashboard",
    name: "My demo dashboard",
    description: "A starter dashboard generated from JavaScript.",
    documentationURL: "https://example.com/my-demo-dashboard",
  });
}
```

This metadata is separate from the custom element itself. Your strategy still needs to be registered with a tag like `ll-strategy-dashboard-my-demo`, and users still need the resource loaded before Home Assistant can discover it. You can use HACS for this as other resources can be added, like custom cards.

Take a look at the updated [custom strategies](/docs/frontend/custom-ui/custom-strategy) documentation with example code and further details.
