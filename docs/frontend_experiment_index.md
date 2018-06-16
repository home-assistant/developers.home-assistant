---
title: "Experimental UI"
sidebar_label: Introduction
---

Starting with Home Assistant 0.72, we're experimenting with a way of defining your user interface. The aproach is fundamentally different from the current approach.

The current approach will look at your groups and entities and will sort them on the fly. With our experimental UI, it is purely based on configuration that is provided by the user, defined in `<config>/experimental-ui.yaml`.

## Trying it out

Create `<config>/experimental-ui.yaml`:

```yaml
views:
- cards:
  - type: entities
    title: Example
    entities:
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_livingroom
      - input_boolean.switch_tv
  - type: entity-filter
    filter:
      domain: input_boolean
      state: 'on'
    card_config:
      title: Input booleans that are on
  theme: dark-mode
```

Add to your `configuration.yaml`:

```yaml
input_boolean:
  switch_ac_kitchen:
    name: AC kitchen
  switch_ac_livingroom:
    name: AC living room
  switch_tv:
    name: TV
```

Now restart Home Assistant, navigate to `<YOUR HASS URL>/experimental-ui`. When you make changes to `experimental-ui.yaml`, you don't have to restart Home Assistant or refresh the page. Just hit the refresh button at the top of the UI.

## Current limitations

This is the very very early version aimed at gathering feedback. Discussion and suggestions are welcome in the [ui-schema repository](https://github.com/home-assistant/ui-schema).

## Change log

**Home Assistant 0.72**

- Initial release
