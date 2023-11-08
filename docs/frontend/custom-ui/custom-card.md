---
title: "Custom Cards"
---

[Dashboards](https://www.home-assistant.io/dashboards/) are our approach to defining your user interface for Home Assistant. We offer a lot of built-in cards, but you're not just limited to the ones that we decided to include in Home Assistant. You can build and use your own!

## Defining your card

This is a basic example to show what's possible.

Create a new file in your Home Assistant config dir as `<config>/www/content-card-example.js` and put in the following contents:

```js
class ContentCardExample extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Example-card">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
      <img src="http://via.placeholder.com/350x150">
    `;
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define("content-card-example", ContentCardExample);
```

## Referencing your new card

In our example card we defined a card with the tag `content-card-example` (see last line), so our card type will be `custom:content-card-example`. And because you created the file in your `<config>/www` directory, it will be accessible in your browser via the url `/local/` (if you have recently added the www folder you will need to re-start Home Assistant for files to be picked up).

Add a resource to your dashboard configuration with URL `/local/content-card-example.js` and type `module` ([resource docs](/docs/frontend/custom-ui/registering-resources)).

You can then use your card in your dashboard configuration:

```yaml
# Example dashboard configuration
views:
  - name: Example
    cards:
      - type: "custom:content-card-example"
        entity: input_boolean.switch_tv
```

## API

Custom cards are defined as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). It's up to you to decide how to render your DOM inside your element. You can use Polymer, Angular, Preact or any other popular framework (except for React – [more info on React here](https://custom-elements-everywhere.com/#react)).

Home Assistant will call `setConfig(config)` when the configuration changes (rare). If you throw an exception if the configuration is invalid, Home Assistant will render an error card to notify the user.

Home Assistant will set [the `hass` property](/docs/frontend/data/) when the state of Home Assistant changes (frequent). Whenever the state changes, the component will have to update itself to represent the latest state.

Your card can define a `getCardSize` method that returns the size of your card as a number or a promise that will resolve to a number. A height of 1 is equivalent to 50 pixels. This will help Home Assistant distribute the cards evenly over the columns. A card size of `1` will be assumed if the method is not defined.

Since some elements can be lazy loaded, if you want to get the card size of another element, you should first check it is defined.

```js
return customElements
  .whenDefined(element.localName)
  .then(() => element.getCardSize());
```

Your card can define a `getConfigElement` method that returns a custom element for editing the user configuration. Home Assistant will display this element in the card editor in the dashboard.

## Advanced example

Resources to load in dashboards are imported as a JS module import. Below is an example of a custom card using JS modules that does all the fancy things.

![Screenshot of the wired card](/img/en/frontend/dashboard-custom-card-screenshot.png)

Create a new file in your Home Assistant config dir as `<config>/www/wired-cards.js` and put in the following contents:

```js
import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
import {
  LitElement,
  html,
  css,
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
      config: {},
    };
  }

  render() {
    return html`
      <wired-card elevation="2">
        ${this.config.entities.map((ent) => {
          const stateObj = this.hass.states[ent];
          return stateObj
            ? html`
                <div class="state">
                  ${stateObj.attributes.friendly_name}
                  <wired-toggle
                    .checked="${stateObj.state === "on"}"
                    @change="${(ev) => this._toggle(stateObj)}"
                  ></wired-toggle>
                </div>
              `
            : html` <div class="not-found">Entity ${ent} not found.</div> `;
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
      entity_id: state.entity_id,
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

Add a resource to your dashboard config with URL `/local/wired-cards.js` and type `module`.

And for your configuration:

```yaml
# Example dashboard configuration
views:
  - name: Example
    cards:
      - type: "custom:wired-toggle-card"
        entities:
          - input_boolean.switch_ac_kitchen
          - input_boolean.switch_ac_livingroom
          - input_boolean.switch_tv
```

## Graphical card configuration

Your card can define a `getConfigElement` method that returns a custom element for editing the user configuration. Home Assistant will display this element in the card editor in the dashboard.

Your card can also define a `getStubConfig` method that returns a default card configuration (without the `type:` parameter) in json form for use by the card type picker in the dashboard.

Home Assistant will call the `setConfig` method of the config element on setup.
Home Assistant will update the `hass` property of the config element on state changes, and the `lovelace` element, which contains information about the dashboard configuration.

Changes to the configuration are communicated back to the dashboard by dispatching a `config-changed` event with the new configuration in its detail.

To have your card displayed in the card picker dialog in the dashboard, add an object describing it to the array `window.customCards`. Required properties of the object are `type` and `name` (see example below).

```js
class ContentCardExample extends HTMLElement {
  static getConfigElement() {
    return document.createElement("content-card-editor");
  }

  static getStubConfig() {
    return { entity: "sun.sun" }
  }

  ...
}

customElements.define('content-card-example', ContentCardExample);
```

```js
class ContentCardEditor extends LitElement {
  setConfig(config) {
    this._config = config;
  }

  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }
}

customElements.define("content-card-editor", ContentCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "content-card-example",
  name: "Content Card",
  preview: false, // Optional - defaults to false
  description: "A custom card made by me!", // Optional
});
```

## Tile features

The tile card has support for "features" to add quick actions to control the entity. We offer some built-in features, but you can build and use your own using similar way than defining custom cards.

Below is an example of a custom tile feature for [button entity](/docs/core/entity/button/).

![Screenshot of the custom tile feature example](/img/en/frontend/dashboard-custom-tile-feature-screenshot.png)

```js
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const supportsButtonPressTileFeature = (stateObj) => {
  const domain = stateObj.entity_id.split(".")[0];
  return domain === "button";
};

class ButtonPressTileFeature extends LitElement {
  static get properties() {
    return {
      hass: undefined,
      config: undefined,
      stateObj: undefined,
    };
  }

  static getStubConfig() {
    return {
      type: "custom:button-press-tile-feature",
      label: "Press",
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this.config = config;
  }

  _press(ev) {
    ev.stopPropagation();
    this.hass.callService("button", "press", {
      entity_id: this.stateObj.entity_id,
    });
  }

  render() {
    if (
      !this.config ||
      !this.hass ||
      !this.stateObj ||
      !supportsButtonPressTileFeature(this.stateObj)
    ) {
      return null;
    }

    return html`
      <div class="container">
        <button class="button" @click=${this._press}>
          ${this.config.label || "Press"}
        </button>
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: row;
        padding: 0 12px 12px 12px;
        width: auto;
      }
      .button {
        display: block;
        width: 100%;
        height: 40px;
        border-radius: 6px;
        border: none;
        background-color: #eeeeee;
        cursor: pointer;
        transition: background-color 180ms ease-in-out;
      }
      .button:hover {
        background-color: #dddddd;
      }
      .button:focus {
        background-color: #cdcdcd;
      }
    `;
  }
}

customElements.define("button-press-tile-feature", ButtonPressTileFeature);

window.customTileFeatures = window.customTileFeatures || [];
window.customTileFeatures.push({
  type: "button-press-tile-feature",
  name: "Button press",
  supported: supportsButtonPressTileFeature, // Optional
  configurable: true, // Optional - defaults to false
});
```

The only difference with custom cards is the graphical configuration option.
To have it displayed in the tile card editor, you must add an object describing it to the array `window.customTileFeatures`.

Required properties of the object are `type` and `name`. It is recommended to define the `supported` option with a function so the editor can only propose the feature if it is compatible with the selected entity in the tile card. Set `configurable` to `true` if your entity has additional configuration (e.g. `label` option in the example above) so the editor.

Also, the static functions `getConfigElement` and `getStubConfig` work the same as with normal custom maps.
