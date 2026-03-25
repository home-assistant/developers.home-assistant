---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend lazy context"
---

## What is a Context?

In the Home Assistant frontend, a [Context](https://lit.dev/docs/data/context/) is a way to share data across the component tree without explicitly passing it through every level as a property. Instead of threading the `hass` object down through multiple layers of components, you can provide specific pieces of data via context and consume them only where needed.

The key benefits of using context over passing the entire `hass` object are:

- **Easier usage**: Components can directly consume the data they need without requiring parent components to pass it down. This reduces prop drilling and makes components more self-contained and reusable.
- **Reducing unnecessary component re-renders**: When a component receives `hass` as a property, any change to `hass` triggers a re-render of that component and all its children—even if the component only cares about a small subset of the data. By using context to provide only the specific data a component needs, you ensure that components only re-render when their actual dependencies change, leading to better performance and a more responsive UI.

## Introducing LazyContext

We've introduced a new `LazyContext` pattern that should replace the traditional subscription-based approach and the usage of the `SubscribeMixin`. Previously, components would subscribe to data sources and manage subscription lifecycles manually, often leading to boilerplate code and potential memory leaks if subscriptions weren't properly cleaned up.

`LazyContext` simplifies this by:

- **Lazy loading**: Data is only fetched when a component actually consumes the context
- **Automatic cleanup**: Subscriptions are managed automatically
- **Shared state**: Multiple components consuming the same context share a single subscription
- **Optimized re-renders**: Only components that consume the context re-render when data changes

This approach centralizes data fetching logic and makes it easier to reason about when and how data flows through your application.

## Examples

### Defining a LazyContext

To define a lazy context, use `createLazyContext` and provide a fetch function:

```ts
new LazyContextProvider(this, {
  context: labelsContext,
  subscribeFn: (connection, setValue) => subscribeLabelRegistry(connection, setValue),
})
```

### Consuming a Context

To consume a context in a component, use the `@consume` decorator:

```ts
@state()
@consume({ context: labelsContext, subscribe: true })
private _labels?: LabelRegistryEntry[];
```

### Using @transform for Derived Data

The `@transform` decorator allows you to derive data from a context value, ensuring your component only re-renders when the transformed value actually changes:

```ts
@state()
@consume({ context: statesContext, subscribe: true })
@transform({
  transformer: function (this: HuiButtonCard, entityStates: HassEntities) {
    return this._config?.entity ? entityStates?.[this._config?.entity] : undefined;
  },
  watch: ["_config"],
})
private _stateObj?: HassEntity;
```

With `@transform`, even if the full states object updates, your component will only re-render if the transformed result (`_stateObj`) actually changes. The `watch` option allows you to specify additional properties that should trigger re-evaluation of the transformer function—in this case, when `_config` changes, the transformer runs again to extract the correct entity state.

