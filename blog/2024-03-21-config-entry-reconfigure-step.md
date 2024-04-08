---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "Config Entries can now provide a reconfigure step"
---

As of Home Assistant Core 2024.4, config entries can now be reconfigured by adding a `reconfigure` step in their config flows.

This is not to replace the optional configuration (`OptionsFlow`) but instead to allow the user to change the setup configuration after a config entry has been created.

### Reconfiguration vs. Reauthentication

The `reconfigure` step does not replace a `reauth` step and they have different purposes.

Reauthentication should be started automatically by the integration in the case of a login/token/etc. is invalidated, so the user has an option to adjust those settings.

Reconfiguration is started by the user from the config entry options menu and should be implemented to update config entry data which are not optional for the integration to work. Authentication issues are handled with a re-authentication flow. ([See reauthentication](/docs/config_entries_config_flow_handler#reauthentication)).

### Example

Examples could be changing the latitude and longitude of a `WeatherEntity` when moving between homes or having a mobile home, changing the communication port of a local device, etc.

To implement the `reconfigure` step, include it in your config flow as:

```python
import voluptuous as vol

class ExampleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Config flow for Example integration."""

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None):
        """Add reconfigure step to allow to reconfigure a config entry."""
        if user_input is not None:
            pass  # TODO: process user input

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema({vol.Required("password"): str}),
        )
```
