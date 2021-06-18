---
author: Bram Kragten
authorURL: https://github.com/bramkragten
authorTwitter: bramkragten
title: "Changes that can affect custom cards in 0.106"
---

We made some changes that can affect custom Lovelace cards in Home Assistant Core 0.106, if you are a custom card developer, please read the following.

### Freeze config

We used to give a copy of the configuration to every card because some cards altered the configuration Lovelace passed to them. In 0.105 we stopped doing this because it is not good for performance to create a deep copy for every card.
This resulted in some problems because cards were still altering the configuration. In 0.106 we freeze the configuration. This means that a custom card cannot alter the configuration. If it tries to do it anyway, it will throw an exception or fail silently, depending on if it is run in strict mode.

Please check if your custom card still works with 0.106 and make adjustments to not alter the configuration. You can create a copy of the configuration yourself if you need to.

### Helper functions

:::info
We decided to postpone this change until 0.107.
:::

A second change that was made, is that we no longer load all element types by default. We load them when they are needed. This will also help performance but might break your custom card.

We introduced a set of helpers that you can use to create a Lovelace element, these are the same functions Home Assistant uses internally and will always be up to date to the version the user is using.
You can use them as follows:

```js
const helpers = await loadCardHelpers();
const element = helpers.createRowElement(config);
element.hass = this.hass;
```

For more info see https://github.com/home-assistant/frontend/pull/4853
