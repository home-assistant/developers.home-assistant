---
title: "Experimental UI"
sidebar_label: Introduction
---

Starting with Home Assistant 0.72, we're experimenting with a way of defining your user interface. The aproach is fundamentally different from the current approach.

The current approach will look at your groups and entities and will sort them on the fly. With our experimental UI, it is purely based on configuration that is provided by the user, defined in `<config>/experimental-ui.yaml`.

## Trying it out

Create `<config>/experimental-ui.yaml`:

```yaml
title: My Awesome Home
views:
  # The name of a view will be used as tab title.
  # Might be used for other things in the future.
- name: Example
  # Each view can have a different theme applied.
  theme: dark-mode
  # The cards to show on this view.
  cards:
    # The entities card will take a list of entities and show their state.
  - type: entities
    # Title of the entities card
    title: Example
    # The entities here will be shown in the same order as specified.
    entities:
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_livingroom
      - input_boolean.switch_tv

    # The filter card will filter available entities for certain criteria
    # and render it as type 'entities'.
  - type: entity-filter
    # Filter criteria. They are all optional.
    filter:
      domain: input_boolean
      state: 'on'
    # This config will be passed to the card rendering the filter results
    card_config:
      title: Input booleans that are on

    # Use the HTML imports to load custom UI to render cards.
    # Custom UI needs to be custom element that takes in `config` and `hass`
  - type: 'custom:my-custom-ui'
    # Any value here is made available to your element via the `config` property.
    some: value

  # Specify a tab_icon if you want the view tab to be an icon.
- tab_icon: mdi:home-assistant
  # Name of the view. Will be used as the tooltip for tab icon
  name: Second view
  cards:
  - type: entities
    title: Lots of Kitchen AC
    entities:
        # It is totally possible to render duplicates.
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_kitchen
      - input_boolean.switch_ac_kitchen
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

- Initial release supporting title, defining views with a name, tab icon, theme and cards. Supported cards are entities, entity-filter and custom.
