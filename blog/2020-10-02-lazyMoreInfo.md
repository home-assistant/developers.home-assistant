---
author: Bram Kragten
authorURL: https://github.com/bramkragten
authorTwitter: bramkragten
title: "Lazy-loading more-info controls"
---

In 0.115 we converted our more info controls to be lazy-loaded. This was done because the more info dialog is always loaded in an early stage of the page load. Every domain can have its own controls and they can be pretty heavy. We don't need all these elements on page load, so we decided to only load them when they are needed.

We got feedback from Lovelace custom card developers that this broke their cards, as not all the elements would be available anymore. While we don't support using our internal elements in custom cards, for the reasons mentioned below, we decided to revert this change for 0.115.
In 0.116 we will re-add the lazy loading of the more info dialog controls. To help our Lovelace custom card developers, we have made the function that we use to lazy-load the more info controls available for custom card developers.
This means you can load the controls of the domain of choice if your card needs them.

:::info
Please be aware that we do not support this in any way. We won't promise the same elements will be available in a future update, and breaking changes will happen when you rely on our elements.
:::

An example loading the more info controls of the `light` domain:
```js
const helpers = await loadCardHelpers();
helpers.importMoreInfoControl("light");
```

## Why do we do this?

We always try to make our frontend as fast as possible. Not only on your super fast desktop PC with fiber internet but also on a slow and cheap phone that only has 3G.

One of the things we try to optimize is loading our code. The less code we load the faster it is loaded, the faster we can start rendering the page. We also use less memory if we don't load everything.
There is however a tradeoff, if we always want to only load the parts we need, we would have to be able to load every element separately. This would mean a lot of small network requests, which eventually is slower than loading a little more but in fewer requests, because of the overhead of a network request.

So it is always a search for the right balance between chunk sizes and the number of chunks needed. The splitting of our code into chunks is done with a bundler. At the moment, we use Webpack for this.

Some custom Lovelace developers have asked us why we can't expose all the elements we use internally to custom cards. This is simply because the element you need, might not be loaded yet as it was not needed yet.

What makes this extra difficult, is that we use custom elements. Custom elements can only be defined once, if you try to define it again it will error. This means we can't have a mix of bigger chunks and separate elements, as it would error if it would be loaded a second time.

If we would want to make this happen, we would either have to load every component on the first load, which would make the first load very slow, or we would have to split every component into its own chunk, what would cause a lot of small network requests and thus will also result in a slower experience.

Besides that, the elements we use internally are not supposed to be used by external developers, the API is not documented or supported and could break at any time. We could at any release decide to replace an element as there is a better element or a new use case. Or change the API, like we recently did for the `chart` element. We could not develop at the pace we do now if we would have to support all our elements, we develop an application, the elements are just our building blocks.

## What about external elements?

We use external custom elements in our frontend, like the [Material Web Components](https://github.com/material-components/material-components-web-components) from Google. While we would love you to use the same elements to provide a uniform experience, we can not advise this.

Just like our own elements the external elements are part of our code splitted chunks, and they will probably be lazy-loaded. That means they will not be available at all times but could be loaded later.
This means that if a custom card would load and define an `mwc` element because it was not available at the time it needed it, and we try to do it later when it is lazy-loaded, the Home Assistant frontend will run into an error.

Unfortunately, there is no technical solution for this at the moment. There are some solutions, like [scoped elements](https://open-wc.org/docs/development/scoped-elements/) from open-wc, but they will not work in most cases as the imported element will either self-register or it defines sub-elements, that can not be scoped.
There is a discussion about a proposal for [Scoped Custom Element Definitions](https://github.com/w3c/webcomponents/issues/716) that could potentially fix this problem, but it may take a long time before this would be available in all our supported browsers, if the proposal is accepted at all.

## Is there a solution?

Is there a solution to all these problems? So custom cards can provide the same uniform user experience, without the risk of having breaking changes every release?

The best solution we see is a set of elements created by the custom card community. This set would have its own namespace that would not collide with that of the elements that Home Assistant uses. All custom cards could use these elements, without the risk of breaking changes.
