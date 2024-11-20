---
title: "Integration needs to be able to be set up via the UI"
related_rules:
  - test-before-configure
  - unique-config-entry
  - config-flow-test-coverage
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Since its introduction in 2018, the config flow has become the standard way to set up integrations in Home Assistant.
They allow for a consistent user experience across integrations and provide a way to guide users through the setup process.

Because of the better user experience, we want to make sure that all integrations are able to set up via the config flow.

Since this is the entrypoint for users to start using an integration, we should make sure that the config flow is very user-friendly and understandable.
This means we should use the right selectors at the right place, validate the input where needed, and use `data_description` in the `strings.json` to give context about the input field.

The integration should store all configuration in the `ConfigEntry.data` field, while all settings that are not needed for the connection to be made should be stored in the `ConfigEntry.options` field.

## Example implementation

To use a config flow in your integration, you need to create a `config_flow.py` file in your integration folder and set `config_flow` in your `manifest.json` to `true`.
The text that is shown in the config flow is defined in the `strings.json` file.

`config_flow.py`:
```python
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """My config flow."""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        errors: dict[str, str] = {}
        if user_input:
            return self.async_create_entry(
                title="MyIntegration",
                data=user_input,
            )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_HOST): str}),
            errors=errors,
        )
```

`string.json`: 
```json
{
  "config": {
    "step": {
      "user": {
        "data": {
          "host": "Host"
        },
        "data_description": {
          "host": "The hostname or IP address of the MyIntegration device."
        }
      }
    }
  }
}
```

## Additional resources

More information about config flows can be found in the [config flow documentation](../../../config_entries_config_flow_handler).
More information about the architecture decision around config flows can be found in [ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md)

## Exceptions

The integrations that are exempt in [ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md) are exempt from this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>