---
author: Aidan Timson
authorURL: https://github.com/timmo001
title: Registering custom dashboard strategies
---

As of Home Assistant 2026.4, you can now register custom dashboard strategies, just as you can with [custom cards](/docs/frontend/custom-ui/custom-card), making them easier to discover and add using the **new dashboard** dialog under the **Community dashboards** section.

Before you could do this, but had to send users to create a blank dashboard, edit in YAML mode, and paste in your custom strategy. Now you can register a friendly name, description, documentation, and preview image.

To register your strategy, call `window.customStrategies.push()` with an object containing the following keys:

- `type`: The strategy type without the `custom:` prefix, for example `"my-demo"`.
- `strategyType`: The type of strategy, e.g. `"dashboard"`.
- `name` (`optional`): The friendly name of the strategy.
- `description` (`optional`): A short description of the strategy.
- `documentationURL` (`optional`): A URL to the documentation for the strategy. This is not shown in the strategy UI yet but may in future.
- `images` (`optional`): A preview image, either a single URL or a light/dark pair.

Example:

```js
window.customStrategies = window.customStrategies || [];

window.customStrategies.push({
  type: "my-demo",
  strategyType: "dashboard",
  name: "My demo dashboard",
  description: "A starter dashboard generated from JavaScript.",
  documentationURL: "https://example.com/my-demo-dashboard",
  images: {
    light: "/local/my-demo/preview-light.svg",
    dark: "/local/my-demo/preview-dark.svg",
  },
});
```

This metadata is separate from the custom element itself. Your strategy still needs to be registered with a tag like `ll-strategy-dashboard-my-demo`, and users still need the resource loaded before Home Assistant can discover it. You can use HACS for this as other resource can be added, like custom cards.

Take a look at the updated [custom strategies](/docs/frontend/custom-ui/custom-strategy) documentation with example code and further details.
