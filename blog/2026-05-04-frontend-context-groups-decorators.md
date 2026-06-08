---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend context groups, new context decorators and deprecated contexts"
---

Last release we introduced the lazy context and we wanted to use hass context and lazy context more in favor of passing the hass object.
We found that small tasks often required subscribing to many contexts, so we grouped Hass contexts into logical groups.

## Context groups

Following context groups have been added:

- registriesContext: contains all registries (device, entity, area, etc)
- internationalizationContext: contains all internationalization related data (locale, localize, etc)
- apiContext: contains all API related methods (callService, callWS, etc)
- connectionContext: contains all connection related data (connection, connected, hassUrl, etc)
- uiContext: contains all UI related data (themes, panels, dockedSidebar, etc)
- configContext: contains all config related data (auth, config, user, etc)

## Consume context entry decorators

In the last [blogpost](/blog/2026/03/25/frontend-lazy-context) I showed how to use context with `@transform`. `@transform` is powerful, but sometimes you only need a single context entry and do not want to define a transform function.
To support that, we added decorators that consume a single context entry directly.
You pass an array that defines where the entity ID comes from (usually a config property), and the decorator consumes the correct context and maps the entity ID to the correct registry entry.
It also watches the defined path and updates the entry when needed.

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

## Deprecate contexts

These contexts are still available, but they can be removed in a future release. Use the new context groups instead.

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
