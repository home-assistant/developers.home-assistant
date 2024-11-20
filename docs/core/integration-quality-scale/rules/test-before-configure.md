---
title: "Test a connection in the config flow (IQS002)"
related_rules:
  - config-flow
  - unique-config-entry
  - config-flow-test-coverage
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Apart from being very easy to use, config flows are also a great way to let the user know that something is not going to work when the configuration has been completed.
This can catch issues like:
- DNS issues
- Firewall issues
- Wrong credentials
- Wrong IP address or port
- Unsupported devices

Issues like this are often hard to debug once the integration is set up, so it's better to catch them early so users are not stuck with an integration that doesn't work.

Since this improves the user experience, it's required to test the connection in the config flow.

## Example implementation

To validate the user input, you can call your library with the data as you normally would and do a test call.
If the call fails, you can return an error message to the user.

In the following example, if the `client.get_data()` call raises a `MyException`, the user will see an error message that the integration is unable to connect.

`config_flow.py`:
```python {10-17} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """My config flow."""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST])
            try:
                await client.get_data()
            except MyException:
                errors["base"] = "cannot_connect"
            except Exception:  # noqa: BLE001
                LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"
            else:
                return self.async_create_entry(
                    title="MyIntegration",
                    data=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_HOST): TextSelector()}),
            errors=errors,
        )
```

## Additional resources

More information about config flows can be found in the [config flow documentation](../../../config_entries_config_flow_handler).

## Exceptions

Integrations that don't have a connection to a device or service (for example helpers) don't need to test a connection in the config flow and are exempt from this rule.
Integrations that rely on auto-discovery on runtime (like Google Cast) are also exempt from this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>