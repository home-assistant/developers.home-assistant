---
title: "Integrations should have a reconfigure flow (IQS032)"
related_rules:
  - config-flow
  - test-before-configure
  - unique-config-entry
  - config-flow-test-coverage
  - reauthentication-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

It can happen that a user changes something to a device or service, like changing passwords or changing the IP address.
Ideally, Home Assistant catches those events and lets the user know that it requires a reauthentication or attention.
A reconfigure flow gives users the power to trigger a reconfiguration and allows them to update the configuration of the device or service, without the need to remove and re-add the device or service.

This gives users more ways to try and fix their issues, without the need for the software to be restarted or reauthentication to be triggered.

## Example implementation

In the `config_flow.py` file, add a new step called `reconfigure` that allows users to reconfigure the integration.
In the following example, we check if the new api token is valid.
We also double-check if the user is not trying to reconfigure the integration with a different account, since the account used for the integration should not change.

`config_flow.py`:
```python {4-31} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """My config flow."""

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle reconfiguration of the integration."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST], user_input[CONF_API_TOKEN])
            try:
                user_id = await client.check_connection()
            except MyException as exception:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(user_id)
                self._abort_if_unique_id_mismatch(reason="wrong_account")
                return self.async_update_reload_and_abort(
                    self._get_reconfigure_entry(),
                    data_updates=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                    vol.Required(CONF_API_TOKEN): TextSelector(),
                }
            ),
            errors=errors,
        )

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST], user_input[CONF_API_TOKEN])
            try:
                user_id = await client.check_connection()
            except MyException as exception:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(user_id)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="MyIntegration",
                    data=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                    vol.Required(CONF_API_TOKEN): TextSelector(),
                }
            ),
            errors=errors,
        )
```

## Additional resources

For more information on the reconfiguration flow, see the [reconfigure flow documentation](../../../config_entries_config_flow_handler#reconfigure).

## Exceptions

Integrations that don't have settings in their configuration flow are exempt from this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
