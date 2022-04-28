---
author: epenet
authorURL: https://github.com/epenet
title: "ServiceInfo model improvements and deprecations"
---

As of Home Assistant Core 2022.6, access to discovery information via dictionary methods, previously deprecated, has been removed for `DhcpServiceInfo`, `MqttServiceInfo`, `SsdpServiceInfo`, `UsbServiceInfo` and `ZeroconfServiceInfo`. Custom components are required to migrate to the new dataclass properties.
