---
author: epenet
authorURL: https://github.com/epenet
title: "Relocate dhcp/ssdp/usb/zeroconf ServiceInfo models"
---

### Summary of changes

In order to reduce current reliance on optional integrations for names that are in essence used as helpers, the following ServiceInfo models have been relocated:
- `DhcpServiceInfo` from `homeassistant.components.dhcp` to `homeassistant.helpers.service_info.dhcp`
- `SsdpServiceInfo` from `homeassistant.components.ssdp` to `homeassistant.helpers.service_info.ssdp`
- `UsbServiceInfo` from `homeassistant.components.usb` to `homeassistant.helpers.service_info.usb`
- `ZeroconfServiceInfo` from `homeassistant.components.zeroconf` to `homeassistant.helpers.service_info.zeroconf`

Importing these from the old location will fail from 2026.2.

### Examples

```python
# Old
# from homeassistant.components.dhcp import DhcpServiceInfo
# from homeassistant.components.ssdp import SsdpServiceInfo
# from homeassistant.components.usb import UsbServiceInfo
# from homeassistant.components.zeroconf import ZeroconfServiceInfo

# New
from homeassistant.helpers.service_info.dhcp import DhcpServiceInfo
from homeassistant.helpers.service_info.ssdp import SsdpServiceInfo
from homeassistant.helpers.service_info.usb import UsbServiceInfo
from homeassistant.helpers.service_info.zeroconf import ZeroconfServiceInfo

class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow."""

    async def async_step_usb(self, discovery_info: DhcpServiceInfo) -> ConfigFlowResult:
        """Handle dhcp discovery."""
        ...

    async def async_step_usb(self, discovery_info: SsdpServiceInfo) -> ConfigFlowResult:
        """Handle ssdp discovery."""
        ...

    async def async_step_usb(self, discovery_info: UsbServiceInfo) -> ConfigFlowResult:
        """Handle usb discovery."""
        ...

    async def async_step_zeroconf(self, discovery_info: ZeroconfServiceInfo) -> ConfigFlowResult:
        """Handle zeroconf discovery."""
        ...
```
