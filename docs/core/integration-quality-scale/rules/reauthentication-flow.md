---
title: "Reauthentication flow"
related_rules:
  - config-flow
  - test-before-configure
  - config-flow-test-coverage
  - test-before-setup
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

It can happen that users change their password of a device or service and forget that their device or account is still linked to Home Assistant.
To avoid that the user has to remove the configuration entry and re-add it, we start a reauthentication flow.
During this flow, the user can provide the new credentials to use from now on.

This is a very user-friendly way to let the user know that they need to take action and update their credentials.

## Example implementation

In the example below, we show an authentication flow that allows the user to reauthenticate with a new API token.
When we receive the new token, we check if we can connect to the service to avoid the user from entering an invalid token.
If the connection is successful, we update the configuration entry with the new token.

`config_flow.py`:
```python {6-11,13-35} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """My config flow."""
    
    host: str

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """Perform reauthentication upon an API authentication error."""
        self.host = entry_data[CONF_HOST]
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm reauthentication dialog."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(self.host, user_input[CONF_API_TOKEN])
            try:
                user_id = await client.check_connection()
            except MyException as exception:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(user_id)
                self._abort_if_unique_id_mismatch(reason="wrong_account")
                return self.async_update_reload_and_abort(
                    self._get_reauth_entry(),
                    data_updates={CONF_API_TOKEN: user_input[CONF_API_TOKEN]},
                )
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema({vol.Required(CONF_API_TOKEN): TextSelector()}),
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

For more info about handling expired credentials, check the [documentation](../../../integration_setup_failures#handling-expired-credentials).

## Exceptions

If the integration doesn't require any form of authentication, this rule doesn't apply.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>