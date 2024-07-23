---
title: "Custom badge"
---

[Badges](https://www.home-assistant.io/dashboards/badges/) are small widgets that sit at the top of a view, above all cards. We offer a built-in badge, the [entity badge](https://next.home-assistant.io/dashboards/badges/#entity-badge), but you're not just limited that one. You can build and use your own!

## Defining your badge

Defining a badge is done in a very similar way to defining a [custom card](/docs/frontend/custom-ui/custom-card).

Let's create a basic badge that displays custom text at the top of the screen.
Create a new file in your Home Assistant config dir as `<config>/www/text-badge.js` and put in the following contents:

```js
import { LitElement } from "lit";

class TextBadge extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    this._hass = hass;
    this.updateContent();
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error badge.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
    this.updateContent();
  }

  updateContent() {
    if (!this.config || !this._hass) return;

    const entityId = this.config.entity;
    const state = this._hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.innerHTML = `<p>${stateStr}</p>`;
  }
}

customElements.define("text-badge", TextBadge);
```

## Referencing your new badge

In our example badge, we defined a badge with the tag `text-badge` (see last line), so our badge type will be `custom:text-badge`. And because you created the file in your `<config>/www` directory, it will be accessible in your browser via the url `/local/` (if you have recently added the www folder you will need to re-start Home Assistant for files to be picked up).

Add a resource to your dashboard configuration with URL `/local/text-badge.js` and type `module` ([resource docs](/docs/frontend/custom-ui/registering-resources)).

You can then use your badge in your dashboard configuration:

```yaml
# Example dashboard configuration
views:
  - name: Example
    badges:
      - type: "custom:text-badge"
        entity: light.bedside_lamp
```

## API

Custom badges are defined as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). It's up to you to decide how to render your DOM inside your element. You can use Polymer, Angular, Preact or any other popular framework (except for React – [more info on React here](https://custom-elements-everywhere.com/#react)).

Home Assistant will call `setConfig(config)` when the configuration changes (rare). If you throw an exception if the configuration is invalid, Home Assistant will render an error badge to notify the user.

Home Assistant will set [the `hass` property](/docs/frontend/data/) when the state of Home Assistant changes (frequent). Whenever the state changes, the component will have to update itself to represent the latest state.

## Graphical badge configuration

Your badge can define a `getConfigElement` method that returns a custom element for editing the user configuration. Home Assistant will display this element in the badge editor in the dashboard.

Your badge can also define a `getStubConfig` method that returns a default badge configuration (without the `type:` parameter) in json form for use by the badge type picker in the dashboard.

Home Assistant will call the `setConfig` method of the config element on setup.
Home Assistant will update the `hass` property of the config element on state changes, and the `lovelace` element, which contains information about the dashboard configuration.

Changes to the configuration are communicated back to the dashboard by dispatching a `config-changed` event with the new configuration in its detail.

To have your badge displayed in the badge picker dialog in the dashboard, add an object describing it to the array `window.customBadges`. Required properties of the object are `type` and `name` (see example below).

```js
import { LitElement } from "lit";

class TextBadge extends HTMLElement {
  
  ...

  static getConfigElement() {
    return document.createElement("text-badge-editor");
  }

  static getStubConfig() {
    return { entity: "sun.sun" };
  }
}

customElements.define("text-badge", TextBadge);
```

```js
class TextBadgeEditor extends LitElement {
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

customElements.define("text-badge-editor", TextBadgeEditor);
window.customBadges = window.customBadges || [];
window.customBadges.push({
  type: "text-badge",
  name: "Text badge",
  preview: false, // Optional - defaults to false
  description: "A custom badge made by me!", // Optional
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-badge", // Adds a help link in the frontend badge editor
});
```
