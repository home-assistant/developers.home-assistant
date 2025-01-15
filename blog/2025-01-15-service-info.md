---
author: epenet
authorURL: https://github.com/epenet
title: "Relocate dhcp/ssdp/usb/zeroconf ServiceInfo models"
---

As of Home Assistant Core 2025.2, the following ServiceInfo models have been relocated:
- `DhcpServiceInfo` from `homeassistant.components.dhcp` to `homeassistant.helpers.service_info.dhcp`
- `SsdpServiceInfo` from `homeassistant.components.ssdp` to `homeassistant.helpers.service_info.ssdp`
- `UsbServiceInfo` from `homeassistant.components.usb` to `homeassistant.helpers.service_info.usb`
- `ZeroconfServiceInfo` from `homeassistant.components.zeroconf` to `homeassistant.helpers.service_info.zeroconf`
