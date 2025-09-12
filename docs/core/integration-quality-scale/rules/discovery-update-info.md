---
title: "Integration uses discovery info to update network information"
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Most networks of end users are using dynamic IP addresses.
This means that devices and services can get a different IP address than the one they had when they were first set up.
To avoid the need for users to set devices to static IP addresses (which is not always possible), integrations should use the discovery information to update the network information of the device or service.

We should only update the IP address of a device or service if the integration is sure that the device or service is the same one as set up previously.

## Example implementation

In the following example we have an integration that uses mDNS to discover devices.
Every time a zeroconf discovery flow is started, the integration will set the unique ID of the flow to the serial number of the device.
If the unique ID is already set, the device IP address will be updated if it has changed, and the flow will be aborted.

`manifest.json`:
```json
{
  "zeroconf": ["_mydevice._tcp.local."]
}
```

`config_flow.py`:
```python {14-15} showLineNumbers
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
```

:::info
If you are using DHCP discovery, and you want to receive discovery flows for updated IP addresses, be sure to register the MAC address in the device info and set `registered_devices` to `true` in the manifest.
This will create discovery flows for those devices.
:::

## Additional resources

To learn more information about config flows, checkout the [config flow documentation](/docs/config_entries_config_flow_handler).
To learn more about network protocols and discovery, checkout the [Networking and discovery documentation](/docs/network_discovery).

## Exceptions

The exception to this rule is that not every device can be discovered.
Integrations where the devices can't be discovered are exempt from this rule.

