---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend component updates in 2026.6"
---

## Component updates

### ha-radio updates

`ha-radio` was removed from our codebase, we use the webawesome based `ha-radio-group` with `ha-radio-option` now. No need for a `ha-formfield` around a `ha-radio` anymore and you can use the new CSS properties to customize the radio group and options.

New component specific tokens:

```css
--ha-radio-group-required-marker
--ha-radio-group-required-marker-offset

--ha-radio-option-active-color
--ha-radio-option-heigh
--ha-radio-option-toggle-size
--ha-radio-option-border-width
--ha-radio-option-border-color
--ha-radio-option-border-color-hover
--ha-radio-option-background-color
--ha-radio-option-background-color-hover
--ha-radio-option-checked-background-color
--ha-radio-option-checked-icon-color
--ha-radio-option-checked-icon-scale
--ha-radio-option-control-margin
```

### ha-drawer updates

`ha-drawer` was updated to use the webawesome drawer component. The API is mostly the same it just uses now `--ha-sidebar-width` instead of `--mdc-drawer-width`

## New decorators

### @consumeLocalize

Following up on the [context entry decorators](/blog/2026/05/04/frontend-context-groups-decorators) introduced last release, we added a shortcut for the most common single-field read off `internationalizationContext`: the `localize` function.

Before:

```ts
@state()
@consume({ context: internationalizationContext, subscribe: true })
@transform<HomeAssistantInternationalization, LocalizeFunc>({
  transformer: ({ localize }) => localize,
})
private _localize!: LocalizeFunc;
```

After:

```ts
@state()
@consumeLocalize()
private _localize!: LocalizeFunc;
```

Use `@consumeLocalize()` whenever a component only needs the `localize` function. For other single-field reads off `internationalizationContext` (e.g. `locale`, `language`), keep using `@consume` + `@transform`.
