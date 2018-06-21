---
title: "Custom Cards"
---

You're not just limited to the cards that we decided to include in the Lovelace UI. You can build and use your own!

## API

- You define your custom card as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). It's up to you to decide how to render your DOM inside your element. You can use Polymer, Angular, Preact or any other popular framework (except for React – more info [here](https://custom-elements-everywhere.com/)).
- Home Assistant will set the `config` property when the configuration changes (rare).
- Home Assistant will set the `hass` property when the state of Home Assistant changes (frequent). Whenever the state changes, the component will have to update itself to represent the latest state.

## Defining your card

Create a new file in your Home Assistant config dir as `<config>/www/wired-cards.js` and put in the following contents:

```js
import 'https://unpkg.com/wired-card@0.6.5/wired-card.js?module';
import 'https://unpkg.com/wired-toggle@0.6.5/wired-toggle.js?module';
import {
  LitElement, html
} from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

function loadCSS(url) {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

loadCSS('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');

class WiredToggleCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    }
  }

  _render({ hass, config }) {
    return html`
      <style>
        :host {
          font-family: 'Gloria Hallelujah', cursive;
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
        wired-toggle {
          margin-left: 8px;
        }
      </style>
      <wired-card elevation="2">
        ${config.entities.map(ent => hass.states[ent]).map((state) =>
          html`
            <div class='state'>
              ${state.attributes.friendly_name}
              <wired-toggle
                checked="${state.state === 'on'}"
                on-change="${ev => this._toggle(state)}"
              ></wired-toggle>
            </div>
          `
        )}
      </wired-card>
    `;
  }

  _toggle(state) {
    this.hass.callService('homeassistant', 'toggle', {
      entity_id: state.entity_id
    });
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }
}
customElements.define('wired-toggle-card', WiredToggleCard);
```

## Referencing your new card

In our example card we defined a card with the tag `wired-toggle-card` (see last line), so our card type will be `custom:wired-toggle-card`. And because you created the file in your `<config>/www` directory, it will be accessible in your browser via the url `/local/`.

```yaml
# Example ui-lovelace.yaml
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
