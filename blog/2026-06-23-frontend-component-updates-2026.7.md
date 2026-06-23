---
author: Jan-Philipp Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "Frontend component updates in 2026.7"
---

## Component updates

### Component sizes use Web Awesome names

`ha-button`, `ha-button-toggle-group`, and `ha-slider` now use the short Web Awesome size names.

For `ha-button`, use:

```html
<ha-button size="s">Save</ha-button>
```

Supported values are `xs`, `s`, `m`, `l`, and `xl`.

For `ha-button-toggle-group`, use `s` or `m`:

```html
<ha-button-toggle-group size="s" .buttons=${buttons}></ha-button-toggle-group>
```

`ha-slider` uses `s` or `m`.

If your custom card or editor still uses `small`, `medium`, or `large` on these components, migrate them to short values like `s`, `m`, or `l`.

### Virtualized lists

We added two list components for large data sets:

- `ha-list-virtualized`
- `ha-list-selectable-virtualized`

Use these when a picker or dialog can render enough rows to affect scrolling or initial render time. The virtualized list renders only the visible rows while keeping the roving-tabindex keyboard navigation from `ha-list-base`.

Rows expose accessibility metadata with `aria-setsize` and `aria-posinset`, so assistive technologies still get the full list position even though only part of the list is in the DOM.

```ts
import "../../../components/list/ha-list-virtualized";
import type { HaListVirtualizedItem } from "../../../components/list/ha-list-virtualized";
```

For selectable lists, render `ha-list-item-option` rows and keep selection state in the consumer. This keeps filtering and off-screen selections predictable.

## Context and editor infrastructure

### Dirty state tracking

Dialogs and editors now have shared dirty-state infrastructure:

- `DirtyStateProviderMixin`
- `dirtyStateContext`
- `isDirtyState`
- `isEffectiveDirtyState`

Use `DirtyStateProviderMixin` for new dialogs or editors that need to block scrim close, enable Save only after edits, or coordinate dirty state with child components.

```ts
class MyDialog extends DirtyStateProviderMixin<MyState>()(LitElement) {
  public openDialog() {
    this._initDirtyTracking({ type: "shallow" }, this._state);
  }

  private _stateChanged(state: MyState) {
    this._updateDirtyState(state);
  }
}
```

`isDirtyState` is the raw comparison and is usually right for enabling Save. `isEffectiveDirtyState` can ignore equivalent config output, for example when an editor normalizes an explicit default back to the same effective config.

### Related context

Pages and editors can now publish related context for nearby pickers:

- `relatedContext`
- `fireRelatedContext`
- `fireEntityRelatedContext`

When a card editor, badge editor, automation trace page, or similar surface knows the current entity, device, or area, it can provide that context. Entity pickers and add-element searches can then prioritize related entities, devices, and areas.

```ts
fireEntityRelatedContext(this, "light.kitchen");
```

Clear the context with `undefined` when the editor no longer has a related item.

### Narrow viewport context

`narrowViewportContext` exposes whether the main Home Assistant viewport is in the narrow layout.

Components that only need narrow-layout state can consume this context instead of receiving `narrow` through several layers of properties.

```ts
@consume({ context: narrowViewportContext, subscribe: true })
private _narrow!: boolean;
```

## Lovelace updates

### Strategy regeneration control

Lovelace strategies can now avoid unnecessary regeneration.

Strategies may declare `registryDependencies` to use the default reference-change check for only the registries they depend on:

```ts
static registryDependencies = ["entities", "areas"] as const;
```

For custom logic, implement `shouldRegenerate()`:

```ts
static shouldRegenerate(config, oldHomeAssistant, newHomeAssistant) {
  return oldHomeAssistant.entities !== newHomeAssistant.entities;
}
```

If neither is provided, strategies keep the previous default behavior and regenerate on changes to entities, devices, areas, or floors.
