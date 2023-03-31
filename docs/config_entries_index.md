---
title: Config Entries
---

Config Entries are configuration data that are persistently stored by Home Assistant. A config entry is created by a user via the UI. The UI flow is powered by a [config flow handler](config_entries_config_flow_handler.md) as defined by the component. Config entries can also have an extra [options flow handler](config_entries_options_flow_handler.md), also defined by the component.

## Lifecycle

| State | Description |
| ----- | ----------- |
| not loaded | The config entry has not been loaded. This is the initial state when a config entry is created or when Home Assistant is restarted. |
| loaded | The config entry has been loaded. |
| setup error | An error occurred when trying to set up the config entry. |
| setup retry | A dependency of the config entry was not ready yet. Home Assistant will automatically retry loading this config entry in the future. Time between attempts will automatically increase.
| migration error | The config entry had to be migrated to a newer version, but the migration failed.
| failed unload | The config entry was attempted to be unloaded, but this was either not supported or it raised an exception.

<svg class='invertDark' width="508pt" height="188pt" viewBox="0.00 0.00 508.00 188.00" xmlns="http://www.w3.org/2000/svg">
<g id="graph1" class="graph" transform="scale(1 1) rotate(0) translate(4 184)">
<title>G</title>
<polygon fill="none" stroke="none" points="-4,5 -4,-184 505,-184 505,5 -4,5"></polygon>
<g id="node1" class="node"><title>not loaded</title>
<ellipse fill="none" stroke="black" cx="168" cy="-162" rx="51.3007" ry="18"></ellipse>
<text text-anchor="middle" x="168" y="-157.8" font-family="Times,serif" font-size="14.00">not loaded</text>
</g>
<g id="node3" class="node"><title>loaded</title>
<ellipse fill="none" stroke="black" cx="61" cy="-90" rx="36.1722" ry="18"></ellipse>
<text text-anchor="middle" x="61" y="-85.8" font-family="Times,serif" font-size="14.00">loaded</text>
</g>
<g id="edge2" class="edge"><title>not loaded-&gt;loaded</title>
<path fill="none" stroke="black" d="M140.518,-146.666C123.947,-136.676 103.104,-123.187 86.8392,-111.989"></path>
<polygon fill="black" stroke="black" points="88.532,-108.902 78.3309,-106.041 84.5212,-114.639 88.532,-108.902"></polygon>
</g>
<g id="node5" class="node"><title>setup error</title>
<ellipse fill="none" stroke="black" cx="168" cy="-90" rx="52.3895" ry="18"></ellipse>
<text text-anchor="middle" x="168" y="-85.8" font-family="Times,serif" font-size="14.00">setup error</text>
</g>
<g id="edge4" class="edge"><title>not loaded-&gt;setup error</title>
<path fill="none" stroke="black" d="M162.122,-144.055C161.304,-136.346 161.061,-127.027 161.395,-118.364"></path>
<polygon fill="black" stroke="black" points="164.894,-118.491 162.087,-108.275 157.911,-118.012 164.894,-118.491"></polygon>
</g>
<g id="node7" class="node"><title>setup retry</title>
<ellipse fill="none" stroke="black" cx="291" cy="-90" rx="52.0932" ry="18"></ellipse>
<text text-anchor="middle" x="291" y="-85.8" font-family="Times,serif" font-size="14.00">setup retry</text>
</g>
<g id="edge6" class="edge"><title>not loaded-&gt;setup retry</title>
<path fill="none" stroke="black" d="M189.578,-145.465C206.94,-134.869 231.584,-120.783 252.292,-109.59"></path>
<polygon fill="black" stroke="black" points="254.022,-112.634 261.19,-104.832 250.722,-106.461 254.022,-112.634"></polygon>
</g>
<g id="node9" class="node"><title>migration error</title>
<ellipse fill="none" stroke="black" cx="431" cy="-90" rx="69.1427" ry="18"></ellipse>
<text text-anchor="middle" x="431" y="-85.8" font-family="Times,serif" font-size="14.00">migration error</text>
</g>
<g id="edge8" class="edge"><title>not loaded-&gt;migration error</title>
<path fill="none" stroke="black" d="M207.659,-150.445C252.053,-138.628 324.343,-119.388 374.607,-106.01"></path>
<polygon fill="black" stroke="black" points="375.588,-109.37 384.351,-103.416 373.787,-102.606 375.588,-109.37"></polygon>
</g>
<g id="edge10" class="edge"><title>loaded-&gt;not loaded</title>
<path fill="none" stroke="black" d="M85.5216,-103.56C102.143,-113.462 123.939,-127.508 141.027,-139.231"></path>
<polygon fill="black" stroke="black" points="139.274,-142.276 149.481,-145.116 143.273,-136.53 139.274,-142.276"></polygon>
</g>
<g id="node12" class="node"><title>failed unload</title>
<ellipse fill="none" stroke="black" cx="61" cy="-18" rx="61.5781" ry="18"></ellipse>
<text text-anchor="middle" x="61" y="-13.8" font-family="Times,serif" font-size="14.00">failed unload</text>
</g>
<g id="edge12" class="edge"><title>loaded-&gt;failed unload</title>
<path fill="none" stroke="black" d="M61,-71.6966C61,-63.9827 61,-54.7125 61,-46.1124"></path>
<polygon fill="black" stroke="black" points="64.5001,-46.1043 61,-36.1043 57.5001,-46.1044 64.5001,-46.1043"></polygon>
</g>
<g id="edge16" class="edge"><title>setup error-&gt;not loaded</title>
<path fill="none" stroke="black" d="M173.913,-108.275C174.715,-116.03 174.94,-125.362 174.591,-134.005"></path>
<polygon fill="black" stroke="black" points="171.094,-133.832 173.878,-144.055 178.077,-134.327 171.094,-133.832"></polygon>
</g>
<g id="edge14" class="edge"><title>setup retry-&gt;not loaded</title>
<path fill="none" stroke="black" d="M269.469,-106.507C252.104,-117.106 227.436,-131.206 206.71,-142.408"></path>
<polygon fill="black" stroke="black" points="204.973,-139.368 197.805,-147.17 208.273,-145.541 204.973,-139.368"></polygon>
</g>
</g>
</svg>

<!--
Graphviz:
digraph G {
  "not loaded" -> "loaded"
  "not loaded" -> "setup error"
  "not loaded" -> "setup retry"
  "not loaded" -> "migration error"
  "loaded" -> "not loaded"
  "loaded" -> "failed unload"
  "setup retry" -> "not loaded"
  "setup error" -> "not loaded"
}
-->

## Setting up an entry

During startup, Home Assistant first calls the [normal component setup](/creating_component_index.md),
and then call the method `async_setup_entry(hass, entry)` for each entry. If a new Config Entry is
created at runtime, Home Assistant will also call `async_setup_entry(hass, entry)` ([example](https://github.com/home-assistant/core/blob/0.68.0/homeassistant/components/hue/__init__.py#L119)).

### For platforms

If a component includes platforms, it will need to forward the Config Entry to the platform. This can
be done by calling the forward function on the config entry manager ([example](https://github.com/home-assistant/core/blob/0.68.0/homeassistant/components/hue/bridge.py#L81)):

```python
# Use `hass.async_create_task` to avoid a circular dependency between the platform and the component
hass.async_create_task(
  hass.config_entries.async_forward_entry_setup(
    config_entry, "light"
  )
)
```

For a platform to support config entries, it will need to add a setup entry method ([example](https://github.com/home-assistant/core/blob/0.68.0/homeassistant/components/light/hue.py#L60)):

```python
async def async_setup_entry(hass, config_entry, async_add_devices):
    """Set up entry."""
```

## Unloading entries

Components can optionally support unloading a config entry. When unloading an entry, the component needs to clean up all entities, unsubscribe any event listener and close all connections. To implement this, add `async_unload_entry(hass, entry)` to your component ([example](https://github.com/home-assistant/core/blob/0.68.0/homeassistant/components/hue/__init__.py#L136)).

For each platform that you forwarded the config entry to, you will need to forward the unloading too.

```python
await self.hass.config_entries.async_forward_entry_unload(self.config_entry, "light")
```

If you need to clean up resources used by an entity in a platform, have the entity implement the [`async_will_remove_from_hass`](core/entity.md#async_will_remove_from_hass) method.

## Removal of entries

If a component needs to clean up code when an entry is removed, it can define a removal method:

```python
async def async_remove_entry(hass, entry) -> None:
    """Handle removal of an entry."""
```

## Migrating config entries to a new version

If the config entry version is changed, `async_migrate_entry` must be implemented to support the migration of old entries. This is documented in detail in the [config flow documentation](/config_entries_config_flow_handler.md#config-entry-migration)

```python
async def async_migrate_entry(hass: HomeAssistant, config_entry: ConfigEntry) -> bool:
    """Migrate old entry."""
```
