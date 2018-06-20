---
title: "Custom Cards"
---

You're not just limited to the cards that we decided to include in the Lovelace UI. You can build and use your own!

## API

- You define your custom card as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). It's up to you to decide how to render your DOM inside your element. You can use Polymer, Angular, Preact or any other popular framework (except for React – more info [here](https://custom-elements-everywhere.com/)).
- Home Assistant will set the `config` property when the configuration changes (rare).
- Home Assistant will set the `hass` property when the state of Home Assistant changes (frequent). Whenever the state changes, the component will have to update itself to represent the latest state.

## Defining your card

```html
<!-- custom-card.html -->
<script>
class CustomCard extends HTMLElement {
  constructor() {
    super();
    this.config = null;
    this._hass = null;
    this._connected = false;
  }

  // Called when the element is connected to the DOM.
  // We assume that both hass and config properties have been set.
  connectedCallback() {
    this._connected = true;
    this.innerHTML = `
      <div style='background-color: lightsalmon; padding: 8px;'>
        ${this.config.entity_id}
        <input type='checkbox'>
      </div>
    `;
    this._checkbox = this.querySelector('input');
    this._checkbox.addEventListener('change', () =>
      this._hass.callService('homeassistant', 'toggle',
                             { entity_id: this.config.entity_id }));
    this._render();
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 1;
  }

  set hass(value) {
    this._hass = value;

    if (this._connected) {
      this._render();
    }
  }

  _render() {
    const state = this._hass.states[this.config.entity_id];
    this._checkbox.checked = state.state === 'on';
  }
}

customElements.define('example-card', CustomCard);
</script>
```

## Loading your card in the frontend

Home Assistant is currently transitioning away from HTML imports but have not finished yet. To include your custom card, you will have to create an HTML file that will be imported by the frontend. Instructions on how to configure the frontend are [here](https://www.home-assistant.io/components/frontend/#extra_html_url). Create a new HTML file in `<hass config dir>/www/custom-card.html`. You will be able to load it by referencing it as `/local/custom-card.html`.

## Referencing your new card

To use a custom card, set the card type in `ui-lovelace.yaml` to `custom:<YOUR CUSTOM ELEMENT TAG>`. In the following example we're going to use a custom card which is registered as custom element `example-card`. Any other config defined with your card will be made available as the `config` property to your card.

```yaml
# ui-lovelace.yaml example
title: Example Main title
views:
- name: Example
  cards:
  - type: 'custom:example-card'
    entity_id: input_boolean.switch_ac_kitchen
```
