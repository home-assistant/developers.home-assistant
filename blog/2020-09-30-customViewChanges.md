---
author: Zack Barett
authorURL: https://github.com/zsarnett
authorTwitter: zsarnett
title: "Lovelace: Custom View Layouts"
---

Custom Element developers can now create Custom View Layouts that users can load and use!

In 0.116, we will be changing the way that we create Views in Lovelace. In the past, we had 2 views, a default view and a panel view. When talking about adding Drag and Drop to Lovelace, we decided we could do even better and start allowing custom view types.

Custom Developers will now be able to create a view that receives the following properties:

```ts
interface LovelaceViewElement {
  hass?: HomeAssistant;
  lovelace?: Lovelace;
  index?: number;
  cards?: Array<LovelaceCard | HuiErrorCard>;
  badges?: LovelaceBadge[];
  setConfig(config: LovelaceViewConfig): void;
}
```

Cards and Badges will be created and maintained by the core code and given to the custom view. The custom views are meant to load the cards and badges and display them in a customized layout.

Here is an example below: (note: this example does not have all of the properties but the necessities to show the example)

```js
class MyNewView extends LitElement {
  setConfig(_config) {}

  static get properties() {
    return { 
      cards: {type: Array, attribute: false}
    };
  }

  render() {
    if(!this.cards) {
      return html``;
    }
    return html`${this.cards.map((card) => html`<div>${card}</div>`)}`;
  }
}
```

And you can define this element in the Custom Element Registry just as you would with a Custom Card:

```js
customElements.define("my-new-view", MyNewView);
```

You can find an example of this in our default view: `Masonry View` Located here: [frontend/src/panels/lovelace/views/hui-masonry-view.ts](https://github.com/home-assistant/frontend/blob/master/src/panels/lovelace/views/hui-masonry-view.ts)

A user who downloads and installs your new Custom View can then use it via editing the YAML configuration of their view to be:

```yaml
- title: Home View
  type: custom:my-new-view
  badges: [...]
  cards: [...]
```

Custom Developers can add a `layout` property to each card that can store a key, position info, width, height, etc:

```yaml
- type: weather-card
  layout:
    key: 1234
    width: 54px
  entity: weather.my_weather
```

### Breaking Change

For Custom Card developers that use something like this:

```js
const LitElement = Object.getPrototypeOf(customElements.get("hui-view"));
```

You will no longer be able to use the `hui-view` element to retrieve LitElement as it has been changed to be an `updatingElement`. Instead you can use:

```js
const LitElement = Object.getPrototypeOf(customElements.get("hui-masonry-view"));
```

But Note! This is not supported by HA. In the future, this may not work to import LitElement.
