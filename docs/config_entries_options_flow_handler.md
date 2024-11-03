---
title: Options flow
---

An integration that is configured via a config entry can expose options to the user to allow tweaking behavior of the integration, like which devices or locations should be integrated.

Config Entry Options uses the [Data Flow Entry framework](data_entry_flow_index.md) to allow users to update the options of a config entry. Components that want to support config entry options will need to define an Options Flow Handler.

## Options support

For an integration to support options it needs to have an `async_get_options_flow` method in its config flow handler. Calling it will return an instance of the components options flow handler.

```python
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler()
```

## Flow handler

The Flow handler works just like the config flow handler, except that the first step in the flow will always be `async_step_init`. The current config entry details is available through the `self.config_entry` property.

```python
OPTIONS_SCHEMA=vol.Schema(
    {
        vol.Required("show_things"): bool,
    }
)
class OptionsFlowHandler(config_entries.OptionsFlow):
    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_SCHEMA, self.config_entry.options
            ),
        )
```

Config entry options should only be updated using `self.async_create_entry`. In complex flows, it may be necessary to work on a copy of mutable copy of the config entry options, which is available via the `self.options` property.

```python
class OptionsFlowHandler(config_entries.OptionsFlow):
    async def async_step_options_1(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            self.options.update(user_input)
            return self._show_options_menu()

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_1_SCHEMA, self.options
            ),
        )

    async def async_step_options_2(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            self.options.update(user_input)
            return self._show_options_menu()

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_2_SCHEMA, self.options
            ),
        )

    async def async_step_save_options(self)
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Update config entry options."""
        return self.async_create_entry(title="", data=self.options)
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
