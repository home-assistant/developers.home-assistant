---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend component updates 2026.4"
---

:::info
We do not officially support or encourage custom card developers to use our built in components. This component APIs can always change and you should build your card as independent component.
:::

## ha-input

We keep migrating our Material Design based components to Web Awesome based. This time we migrated the input components, which leads to an API change but the look and feel stays the same for now.

- `ha-input` is the successor of `ha-textfield`
  - `ha-textfield` API stays but the component is migrated to use `ha-input` internally and will be removed in 2026.5
  - Also replaces `ha-outlined-text-field`
- `ha-input-search` replaces `search-input` and `search-input-outlined`
- `ha-input-multi` replaces `ha-multi-textfield`
- `ha-input-copy` replaces `copy-textfield`

This component also introduces new semantic theme variables for form backgrounds:  

```css
--ha-color-form-background: var(--ha-color-neutral-95);
--ha-color-form-background-hover: var(--ha-color-neutral-90);
--ha-color-form-background-disabled: var(--ha-color-neutral-80);
```

## Date picker

We finally removed the Vue 2 dependency by replacing the date and date range picker with [Cally](https://wicky.nillia.ms/cally/).