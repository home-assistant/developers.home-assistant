---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "Config Entries can now provide a reconfigure step"
---

As of Home Assistant Core 2024.4 integrations can add a `reconfigure` step in their config entries to allow a user to reconfigure necessary config entry data.

This is not to replace optional configuration (`OptionsFlow`) but instead to allow the user to change setup configuration after a config entry has been created.

Examples could be to change latitude and longitude of a `WeatherEntity` if you have a moving home, Change of communication port of a local device etc.

To implement the `reconfigure` step include it in your config flow:

```python
import voluptuous as vol

class ExampleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Config flow for Example integration."""

    async def async_step_reconfigure(self, user_input):
        """Add reconfigure step to allow to reconfigure a config entry."""
        if user_input is not None:
            pass  # TODO: process user input

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema({vol.Required("password"): str}),
        )
```
