---
author: epenet
authorURL: https://github.com/epenet
title: "ServiceInfo model improvements and deprecations"
---

As of Home Assistant Core 2022.6, access to discovery information via the, previously deprecated, dictionary methods have been removed.


This applies to the `DhcpServiceInfo`, `MqttServiceInfo`, `SsdpServiceInfo`, `UsbServiceInfo`, and `ZeroconfServiceInfo` instances.

Custom integrations are required to migrate to use the new dataclass properties.
