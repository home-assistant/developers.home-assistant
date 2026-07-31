---
author: Jan-Philipp Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "Frontend component updates in 2026.7"
---

## Component updates

### ha-split-panel

We added `ha-split-panel`, a Home Assistant wrapper around the Web Awesome split panel component.

Use it when a page, dialog, or tool needs a resizable two-pane layout.

```html
<ha-split-panel position="40" snap="50%">
  <div slot="start">Editor</div>
  <div slot="end">Preview</div>
</ha-split-panel>
```

New component-specific tokens:

```css
--ha-split-panel-divider-width
--ha-split-panel-divider-hit-area
--ha-split-panel-min
--ha-split-panel-max
--ha-split-panel-grip-display
```

### ha-tile-info updates

`ha-tile-info` gained more layout controls for custom cards and tile-like surfaces.

New component-specific tokens:

```css
--ha-tile-info-gap
--ha-tile-info-min-height
--ha-tile-info-primary-min-height
--ha-tile-info-primary-line-clamp
```

Use `--ha-tile-info-primary-line-clamp` when the primary text should wrap to more than one line, and use the min-height tokens to keep rows aligned when some tiles have secondary text and others do not.

## Form and selector updates

### Conditional ha-form fields

`ha-form` schemas now support conditional field visibility with `visible`.

```ts
[
  {
    name: "advanced",
    selector: { boolean: {} },
  },
  {
    name: "advanced_name",
    visible: { field: "advanced", value: true },
    selector: { text: {} },
  },
]
```

Supported operators are:

```ts
"eq"
"not_eq"
"in"
"not_in"
"exists"
"not_exists"
```

You can also combine conditions with `and`, `or`, and `not`.

Hidden fields are not rendered and are skipped during validation, so use `visible` instead of custom frontend-only hiding logic when a form field depends on another value.

### Selector additions

The text selector now supports HTML pattern validation:

```ts
{
  text: {
    pattern: "[a-z0-9_]+",
    validation_message: "Use lowercase letters, numbers, and underscores",
  },
}
```

This works for both single-value and multiple-value text selectors.

Entity selectors can now filter by properties of the entity's device:

```ts
{
  entity: {
    filter: {
      domain: "sensor",
      device: {
        manufacturer: "Home Assistant",
        model: "Connect ZBT-1",
      },
    },
  },
}
```

A new `ui_clock_date_format` selector was also added for the clock card date format editor.

## Lovelace updates

### state_color is moving to color

The `entities` and `glance` cards now support `color` as the replacement for `state_color`.

Before:

```yaml
type: entities
state_color: true
entities:
  - light.kitchen
```

After:

```yaml
type: entities
color: state
entities:
  - light.kitchen
```

Use `color: state` for the old `state_color: true` behavior, and `color: none` for `state_color: false`.

Existing `state_color` configs are migrated automatically. Custom card configs are not changed, because custom cards own their own config schema.

## Custom panels and apps

### Safe-area handling

Custom panels and add-on app iframes now get safe-area padding by default, so content stays clear of notches, status bars, and home indicators.

Custom panels that already handle safe areas themselves can opt out:

```yaml
panel_custom:
  - name: my-panel
    module_url: /local/my-panel.js
    handle_safe_area: true
```

For iframe-based custom panels, Home Assistant forwards the resolved safe-area values into the iframe document as CSS variables:

```css
--safe-area-inset-top
--safe-area-inset-right
--safe-area-inset-bottom
--safe-area-inset-left
```

Add-on app iframes can also opt into managing the safe area themselves when subscribing to Home Assistant properties:

```js
window.parent.postMessage(
  {
    type: "home-assistant/subscribe-properties",
    handleSafeArea: true,
  },
  "*"
);
```

The properties message then includes `safeAreaInsets`.

## Context and editor infrastructure

### Global dirty state

`DirtyStateProviderMixin` now also publishes a global dirty state.

When any connected dirty-state provider has unsaved changes, `window.isDirtyState` is set and Home Assistant fires a `dirty-state-changed` event.

```ts
window.addEventListener("dirty-state-changed", (ev) => {
  console.log(ev.detail.isDirty);
});
```

This is useful for shared infrastructure that needs to avoid disrupting active editors or dialogs with unsaved changes.