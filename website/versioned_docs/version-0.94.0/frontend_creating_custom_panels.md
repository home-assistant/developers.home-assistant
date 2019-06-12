---
title: Creating custom panels
id: version-0.94.0-frontend_creating_custom_panels
original_id: frontend_creating_custom_panels
---

Panels are pages that show information within Home Assistant and can allow controlling it. Panels are linked from the sidebar and rendered full screen. They have real-time access to the Home Assistant object via JavaScript. Examples of panels in the app are Map, Logbook and History.

Besides components registering panels, users can also register panels using the `panel_custom` component. This allows users to quickly build their own custom interfaces for Home Assistant.

## Introduction

Panels are defined as custom elements. You can use any framework that you want, as long as you wrap it up as a custom element. To quickly get started with a panel, we've created a [React custom panel starter kit](https://github.com/home-assistant/custom-panel-starter-kit-react).

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

```js
window.loadES5Adapter().then(function() {
  customElements.define('my-panel', MyCustomPanel)
});
```
