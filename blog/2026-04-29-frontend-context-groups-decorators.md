---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend context groups, new context decorators and deprecated contexts"
---

Last release we introduced the lazy context and we wanted to use hass context and lazy context more in favor of passing the hass object.
We found out that sometimes you have to register to a lot of contextes just for small tasks. So we decided to group hass context together in logical groups.

## Context groups

Following context groups have been added:

- registriesContext: contains all registries (device, entity, area, etc)
- internationalizationContext: contains all internationalization related data (locale, localize, etc)
- apiContext: contains all API related methods (callService, callWS, etc)
- connectionContext: contains all connection related data (connection, connected, hassUrl, etc)
- uiContext: contains all UI related data (themes, panels, dockedSidebar, etc)
- configContext: contains all config related data (auth, config, user, etc)

## Consume context entry decorators

In the last [blogpost](./2026-03-25-frontend-lazy-context) I showed how to use context with `@transform`. This is a powerful decorator but sometimes you just want to consume a single entry of a context without having to define a transform function. For this we added more decorators that allow you to directly consume a single entry of a context. Via an array you define where the entity id comes from (most of the time from some config property) and the decorator will take care of consuming the right context and transforming the entity id to the right registry entry. Moreover it will watch the defined path to update the entry if needed.

New decorators:

- @consumeEntityState
- @consumeEntityStates
- @consumeEntityRegistryEntry

sample usage:

```ts
@state()
@consumeEntityRegistryEntry({ entityIdPath: ["_config", "entity"] })
_entity?: EntityRegistryDisplayEntry;
```

We may add more of these decorators in the future, e.g. for areas, devices, etc.

## Deprecate context

We still provide this context but it may be removed in the future and we recommend to use the new context groups instead.

- connectionSingleContext
- localizeContext
- localeContext
- configSingleContext
- themesContext
- selectedThemeContext
- userContext
- userDataContext
- panelsContext
- authContext
