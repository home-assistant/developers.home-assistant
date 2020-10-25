---
title: "Lovelace: Custom Views"
---

Custom Element developers can now create Custom View Layouts that users can load and use! This allows you to build your own Lovelace View that lays the cards out exactly how you want them.

## API

You define your custom card as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). It's up to you to decide how to render your DOM inside your element. You can use Polymer, Angular, Preact or any other popular framework (except for React – [more info on React here](https://custom-elements-everywhere.com/#react)).

Custom Views receive the following:

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
