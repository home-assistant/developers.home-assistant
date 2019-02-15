---
title: "Lovelace: Custom Cards"
---

[Lovelace](https://www.home-assistant.io/lovelace/) is our new approach to defining your user interface for Home Assistant. We offer a lot of built-in cards, but you're not just limited to the ones that we decided to include in the Lovelace UI. You can build and use your own!

## API

You define your custom card as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). It's up to you to decide how to render your DOM inside your element. You can use Polymer, Angular, Preact or any other popular framework (except for React – [more info on React here](https://custom-elements-everywhere.com/#react)).

```js
const element = document.createElement('some-custom-card');
```

Home Assistant will call `setConfig(config)` when the configuration changes (rare). If you throw an exception if the configuration is invalid, Lovelace will render an error card to notify the user.

```js
try {
  element.setConfig(config);
} catch (err) {
  showErrorCard(err.message, config);
}
```

Home Assistant will set the `hass` property when the state of Home Assistant changes (frequent). Whenever the state changes, the component will have to update itself to represent the latest state.

```js
element.hass = hass;
```

Your card can define a `getCardSize` method that returns the size of your card as a number. A height of 1 is equivalent to 50 pixels. This will help Home Assistant distribute the cards evenly over the columns. A card size of `1` will be assumed if the method is not defined.

```js
if ('getCardSize' in element) {
  return element.getCardSize();
} else {
  return 1;
}
```

## Defining your card

Create a new file in your Home Assistant config dir as `<config>/www/content-card-example.js` and put in the following contents:

```js
class ContentCardExample extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = 'Example card';
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : 'unavailable';

    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
      <img src="http://via.placeholder.com/350x150">
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('content-card-example', ContentCardExample);
```

## Referencing your new card

In our example card we defined a card with the tag `content-card-example` (see last line), so our card type will be `custom:content-card-example`. And because you created the file in your `<config>/www` directory, it will be accessible in your browser via the url `/local/` (if you have recently added the www folder you will need to re-start home assistant for files to be picked up).

```yaml
# Example Lovelace configuration
resources:
  - url: /local/content-card-example.js
    type: js
views:
- name: Example
  cards:
  - type: "custom:content-card-example"
    entity: input_boolean.switch_tv
```

## Advanced example

Resources to load in Lovelace can be imported as a JS script, an HTML import or as a JS module import. Below is an example of a custom card using JS modules that does all the fancy things.

![Screenshot of the wired card](/img/en/frontend/lovelace-ui-custom-card-screenshot.png)

Create a new file in your Home Assistant config dir as `<config>/www/wired-cards.js` and put in the following contents:

```js
import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");

class WiredToggleCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  render() {
    return html`
      <wired-card elevation="2">
        ${this.config.entities.map(ent => {
          const stateObj = this.hass.states[ent];
          return stateObj
            ? html`
                <div class="state">
                  ${stateObj.attributes.friendly_name}
                  <wired-toggle
                    .checked="${stateObj.state === "on"}"
                    @change="${ev => this._toggle(stateObj)}"
                  ></wired-toggle>
                </div>
              `
            : html`
                <div class="not-found">Entity ${ent} not found.</div>
              `;
        })}
      </wired-card>
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }

  _toggle(state) {
    this.hass.callService("homeassistant", "toggle", {
      entity_id: state.entity_id
    });
  }

  static get styles() {
    return css`
      :host {
        font-family: "Gloria Hallelujah", cursive;
      }
      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
      }
      .state {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        align-items: center;
      }
      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }
      wired-toggle {
        margin-left: 8px;
      }
    `;
  }
}
customElements.define("wired-toggle-card", WiredToggleCard);
```

And for your configuration:

```yaml
# Example Lovelace configuration
resources:
  - url: /local/wired-cards.js
    type: module
views:
- name: Example
  cards:
  - type: "custom:wired-toggle-card"
    entities:
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_livingroom
      - input_boolean.switch_tv
```
