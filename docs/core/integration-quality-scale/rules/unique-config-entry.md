---
title: "Don't allow the same device or service to be able to be set up twice"
related_rules:
  - config-flow
  - test-before-configure
  - config-flow-test-coverage
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Since integrations are easy to set up with the UI, the user could accidentally set up the same device or service twice.
This can lead to duplicated devices and entities with unique identifiers colliding, which has negative side effects.
Any discovery flow must also ensure that a config entry is uniquely identifiable, as otherwise, it would discover devices already set up.

To prevent this, we need to ensure that the user can only set up a device or service once.

## Example implementation

There are 2 common ways an integration checks if it has already been set up.
The first way is by assigning a `unique_id` to the configuration entry.
The second way is by checking if pieces of the data in the configuration entry are unique.

The following examples show how to implement these checks in a config flow.

### Unique identifier

The first way is by assigning a `unique_id` to the configuration entry.
This unique ID is unique per integration domain, so another integration can use the same unique ID without problems.
Below is an example of a config flow that fetches the `unique_id` for the entered configuration with the client and checks if the `unique_id` already exists.
If it does, the flow will abort and show an error message to the user.

`config_flow.py`:
```python {16-17} showLineNumbers
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST])
            try:
                identifier = await client.get_identifier()
            except MyException:
                errors["base"] = "cannot_connect"
            except Exception:  # noqa: BLE001
                LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"
            else:
                await self.async_set_unique_id(identifier)
                self._abort_if_unique_id_configured()
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

### Unique data

The second way is by checking if pieces of the data in the configuration entry are unique.
In the following example, the user fills in a host and a password.
If a configuration entry already exists for the same host, the flow will abort and show an error message to the user.

`config_flow.py`:
```python
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        errors: dict[str, str] = {}
        if user_input:
            self._async_abort_entries_match({CONF_HOST: user_input[CONF_HOST]})
            client = MyClient(user_input[CONF_HOST], user_input[CONF_PASSWORD])
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
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                    vol.Required(CONF_PASSWORD): TextSelector(),
                }
            ),
            errors=errors,
        )
```


## Additional resources

More information about config flows can be found in the [config flow documentation](/docs/config_entries_config_flow_handler).
More information about the requirements for a unique identifier can be found in the [documentation](/docs/entity_registry_index#unique-id-requirements).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>