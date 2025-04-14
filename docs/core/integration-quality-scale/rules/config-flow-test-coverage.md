---
title: "Full test coverage for the config flow"
related_rules:
  - config-flow
  - test-before-configure
  - unique-config-entry
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

The config flow is the first interaction a user has with your integration.
It is important to ensure that the config flow is working as expected and that the user can set up the integration without any issues or (config flow related) errors.

This means that we want to have **100%** test coverage for the config flow.
In those tests, we require verification that the flow is able to recover from an error to confirm that the user is able to finish the flow even if something goes wrong.

Since we want the user to have a smooth experience using other integration flows, this rule also applies to the reconfigure, reauthentication, and options flows.

The extra added benefit of having tests for an integration is that it introduces the developer to testing, making it easier to write tests for other parts of the integration.

:::warning
Even though the code used to check the uniqueness of a config entry is most likely touched by the happy flow tests, make sure to also test that the flow doesn't allow adding more than one unique configuration entry to reach complete coverage.
:::

## Example implementation

We need to test the following scenarios for each way the config flow can be initiated, either by the user, by discovery, or by an import flow.

The example below shows a basic happy flow initiated by the user.

`test_config_flow.py`:
```python showLineNumbers
async def test_full_flow(
    hass: HomeAssistant,
    mock_my_client: AsyncMock,
    mock_setup_entry: AsyncMock,
) -> None:
    """Test full flow."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": SOURCE_USER},
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {CONF_HOST: "10.0.0.131"},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "My integration"
    assert result["data"] == {
        CONF_HOST: "10.0.0.131",
    }
```

## Additional resources

More information about config flows can be found in the [config flow documentation](/docs/config_entries_config_flow_handler).
More information about testing integrations can be found in the [testing documentation](/docs/development_testing).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>