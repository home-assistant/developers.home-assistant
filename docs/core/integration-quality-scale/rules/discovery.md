---
title: "Can be discovered (IQS019)"
related_rules:
  - config_flow
  - test_before_configure
  - unique_config_entry
  - config_flow_test_coverage
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

A lot of devices have the ability to be discovered.
This can happen using one of the following methods:
- Add-on
- Bluetooth
- DHCP
- HomeKit
- mDNS
- MQTT
- SSDP
- USB

This is a great way to make it easier for users to find and set up devices, since they don't have to manually look up which integration to use and then enter the host.
This greatly reduces the effort required to set up a device and thus improves the user experience.

Using a network-based setup, also allows the configuration of the integration to be updated once the device receives a new IP address.

## Example implementation

In the following example, the integration is discoverable using mDNS.
The device would make itself discoverable by providing a `_mydevice._tcp.local.` service.
Home Assistant will pick this up and start a discovery flow for the user.
The user will then be able to confirm the discovery and set up the integration.

`manifest.json`:
```json {2} showLineNumbers
{
  "zeroconf": ["_mydevice._tcp.local."]
}
```

`config_flow.py`:
```python {8-23,25-36} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """My config flow."""

    def __init__(self) -> None:
        """Initialize the config flow."""
        self.data: dict[str, Any] = {}

    async def async_step_zeroconf(
        self, discovery_info: zeroconf.ZeroconfServiceInfo
    ) -> ConfigFlowResult:
        """Handle zeroconf discovery."""
        self.data[CONF_HOST] = host = discovery_info.host

        await self.async_set_unique_id(discovery_info.properties["serialno"])
        self._abort_if_unique_id_configured(updates={CONF_HOST: host})

        client = MyClient(host)
        try:
            await client.get_data()
        except MyClientError:
            return self.async_abort(reason="cannot_connect")

        return await self.async_step_discovery_confirm()

    async def async_step_discovery_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm discovery."""
        if user_input is not None:
            return self.async_create_entry(
                title="MyIntegration",
                data={CONF_HOST: self.data[CONF_HOST]},
            )

        self._set_confirm_only()
        return self.async_show_form(step_id="discovery_confirm")

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST])
            try:
                serial_number = await client.check_connection()
            except MyException as exception:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(
                    serial_number, raise_on_progress=False
                )
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
                }
            ),
            errors=errors,
        )
```

## Additional resources

To learn more information about config flows, checkout the [config flow documentation](../../../config_entries_config_flow_handler).
To learn more about discovery on network protocols, checkout the [Networking and discovery documentation](../../../network_discovery).
To learn more about discovery for bluetooth devices, checkout the [Bluetooth documentation](../../../bluetooth).

## Exceptions

The exception to this rule is that not every device can be discovered.
Integrations where the devices can't be discovered are exempt from this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>