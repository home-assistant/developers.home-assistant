---
title: Options Flow
---

An integration that is configured via a config entry can expose options to the user to allow tweaking behavior of the integration, like which devices or locations should be integrated.

Config Entry Options uses the [Data Flow Entry framework](data_entry_flow_index.md) to allow users to update the options of a config entry. Components that want to support config entry options will need to define an Options Flow Handler.

## Options support

For an integration to support options it needs to have an `async_get_options_flow` method in its config flow handler. Calling it will return an instance of the components options flow handler.

```python
@staticmethod
@callback
def async_get_options_flow(
    config_entry: config_entries.ConfigEntry,
) -> config_entries.OptionsFlow:
    """Create the options flow."""
    return OptionsFlowHandler(config_entry)
```

## Flow handler

The Flow handler works just like the config flow handler, except that the first step in the flow will always be `async_step_init`.

```python
class OptionsFlowHandler(config_entries.OptionsFlow):
    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        "show_things",
                        default=self.config_entry.options.get("show_things"),
                    ): bool
                }
            ),
        )
```

## Signal updates

If the integration should act on updated options, you can register an update listener to the config entry that will be called when the entry is updated. A listener is registered by adding the following to the `async_setup_entry` function in your integration's `__init__.py`.

```python
entry.async_on_unload(entry.add_update_listener(update_listener))
```

Using the above means the Listener is attached when the entry is loaded and detached at unload. The Listener shall be an async function that takes the same input as async_setup_entry. Options can then be accessed from `entry.options`.

```python
async def update_listener(hass, entry):
    """Handle options update."""
```
