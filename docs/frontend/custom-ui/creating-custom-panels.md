---
title: "Creating custom panels"
---

Panels are pages that show information within Home Assistant and can allow controlling it. Panels are linked from the sidebar and rendered full screen. They have real-time access to the Home Assistant object via JavaScript. Examples of panels in the app are dashboards, Map, Logbook and History.

Besides components registering panels, users can also register panels using the `panel_custom` component. This allows users to quickly build their own custom interfaces for Home Assistant.

## Introduction

Panels are defined as custom elements. You can use any framework that you want, as long as you wrap it up as a custom element. To quickly get started with a panel, create a new file `<config>/www/example-panel.js` with this content

```js
import "https://unpkg.com/wired-card@2.1.0/lib/wired-card.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class ExamplePanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
    };
  }

  render() {
    return html`
      <wired-card elevation="2">
        <p>There are ${Object.keys(this.hass.states).length} entities.</p>
        <p>The screen is${this.narrow ? "" : " not"} narrow.</p>
        Configured panel config
        <pre>${JSON.stringify(this.panel.config, undefined, 2)}</pre>
        Current route
        <pre>${JSON.stringify(this.route, undefined, 2)}</pre>
      </wired-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        background-color: #fafafa;
        padding: 16px;
        display: block;
      }
      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }
    `;
  }
}
customElements.define("example-panel", ExamplePanel);
```

Then add to your `configuration.yaml`:

```yaml
panel_custom:
  - name: example-panel
    # url_path needs to be unique for each panel_custom config
    url_path: redirect-server-controls
    sidebar_title: Example Panel
    sidebar_icon: mdi:server
    module_url: /local/example-panel.js
    config:
      # Data you want to make available to panel
      hello: world
```

## API reference

The Home Assistant frontend will pass information to your panel by setting properties on your custom element. The following properties are set:

| Property | Type | Description
| -------- | ---- | -----------
| hass     | object | Current state of Home Assistant
| narrow   | boolean | if the panel should render in narrow mode
| panel    | object | Panel information. Config is available as `panel.config`.

## JavaScript versions

The Home Assistant user interface is currently served to browsers in modern JavaScript and older JavaScript (ES5). The older version has a wider browser support but that comes at a cost of size and performance.

If you do need to run with ES5 support, you will need to load the ES5 custom elements adapter before defining your element:

```javascript
window.loadES5Adapter().then(function() {
  customElements.define('my-panel', MyCustomPanel)
});
```
