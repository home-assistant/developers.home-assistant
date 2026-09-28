---
title: "Dashboard menu actions"
---

:::note Proposed API
This page accompanies a frontend change under review. Feature-detect the API before using it. Released frontends without the API continue to use their existing dashboard controls.
:::

A loaded integration resource can contribute an action to the dashboard overflow menu. The same menu appears in a desktop browser and in the Companion app. The resource owns its action; the frontend owns the menu and dialog presentation.

Load the module through the existing dashboard resource mechanism. An integration whose action must appear without a custom card can register the module using `homeassistant.components.frontend.add_extra_js_url`. Remove that registration when it is no longer needed.

## Register an action

```js
const labels = { en: { tools: "Example tools" } };
await customElements.whenDefined("home-assistant");

const unregister = window.customDashboardActions?.register({
  id: "example:tools",
  icon: "mdi:tools",
  label: ({ hass }) => labels[hass.language]?.tools || labels.en.tools,
  visible: ({ hass }) => hass.user?.is_admin === true,
  execute: ({ hass }) => hass.callService("persistent_notification", "create", {
    title: "Example dashboard action",
    message: "The action was invoked from the dashboard menu.",
  }),
});
```

This example works as a module resource without installing a custom integration. It adds an administrator-visible action that creates a persistent notification. Replace the callback with your integration's operation and supply its translated messages.

To open an integration-owned dialog, use the supplied helper:

```js
execute: ({ showDialog }) => showDialog({
  dialogTag: "example-tools-dialog",
  dialogImport: () => import("./example-tools-dialog.js"),
  dialogParams: {},
})
```

That variant requires the resource to provide `example-tools-dialog.js`, implementing the normal Home Assistant dialog contract.


`labels` belongs to the resource's translations. Labels are rendered as text. The frontend does not need an integration-specific translation key or condition.

The context supplies the current `hass`, dashboard `host`, route `path`, and `showDialog`. Resolve state when an action runs, rather than capturing a previous Home Assistant connection. `showDialog` loads the standard dialog component and delegates to Home Assistant's dialog manager, including its history and focus behavior. The custom dialog implements the normal Home Assistant dialog contract.

Actions remain in the overflow menu on wide and narrow displays. They are hidden while editing the dashboard and in kiosk mode. A visibility predicate controls presentation only: backend operations must still enforce their own authorization.

## Update and remove

Registering the same namespaced ID replaces that action without duplicating it. Call the returned `unregister` function on disposal. Disposing an older registration does not remove a newer registration with the same ID.

The frontend subscribes while the dashboard is connected and releases its listener on disconnect. Exceptions from a resource's visibility or label callback are reported without preventing the other menu entries from rendering. Failed actions use the frontend error dialog.

No manipulation of the dashboard's shadow DOM or replacement of its menu is required.
