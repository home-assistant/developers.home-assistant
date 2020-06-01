---
author: Bram Kragten
authorURL: https://github.com/bramkragten
authorTwitter: bramkragten
title: "Lovelace: getCardSize can now be async"
---

Ever since we introduced lazy loading cards to Lovelace, getting the card size of a lazy loaded card was hard.

We used to send out an error element before the element was loaded, which would have a `getCardSize` function. But that would be the wrong size.
When the element would be defined we would, fire and rebuild the event so the right card would be recreated.

In 0.110 we stopped doing this, we would give back the correct element, but the element constructor would not be loaded yet, so it doesn't have the `getCardSize`.
When the constructor is loaded, the element will be upgraded and we set the config. From that moment we can call `getCardSize`.

In this version, we changed the logic for `getCardSize` so it will wait for this. This means some cards, like stacks, will return a promise because they have to wait for their children to be defined.

If you are a custom card developer and your custom card uses `getCardSize` to get the size of other cards, you have to adjust it to handle these promises.

Our function to get the card size, which you could copy, now looks like this:

```ts
export const computeCardSize = (
  card: LovelaceCard | LovelaceHeaderFooter
): number | Promise<number> => {
  if (typeof card.getCardSize === "function") {
    return card.getCardSize();
  }
  if (customElements.get(card.localName)) {
    return 1;
  }
  return customElements
    .whenDefined(card.localName)
    .then(() => computeCardSize(card));
};
```

We first have the same check as before, if the element has a `getCardSize` function we will return that value, this should be a `number` or `Promise` that resolves to a `number`.

If the function doesn't exist, we will check if the constructor of the element is registered, if it is, this means the element doesn't have a `getCardSize` and we will return `1` as we did before.

If the element isn't registered yet, we will wait until it is and then call the same function again of the now defined card to get the size.
