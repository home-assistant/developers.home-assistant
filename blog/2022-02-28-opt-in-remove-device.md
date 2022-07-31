---
author: Martin Hjelmare
authorURL: https://github.com/MartinHjelmare
authorTwitter: MartinHjelmare
title: "Opt in support to manually remove device"
---

In the Home Assistant Core 2022.3 release, [Erik Montnemery](https://github.com/emontnemery) added [support](https://github.com/home-assistant/core/pull/66188) for any integration to opt in to show a "delete device" button on the device page in the Home Assistant interface.

See our [developer documentation](/docs/device_registry_index#removing-devices) for how to implement this in an integration.

So far five integrations have opted in to this feature:

- [Google Cast](https://github.com/home-assistant/core/pull/66808)
- [MQTT](https://github.com/home-assistant/core/pull/66766)
- [MySensors](https://github.com/home-assistant/core/pull/67128)
- [RFXCOM RFXtrx](https://github.com/home-assistant/core/pull/58252)
- [Tasmota](https://github.com/home-assistant/core/pull/66811)

## Why is this needed?

Before this feature was added, integrations were advised to automatically clean up stale devices from the config entry. But not all integrations are able to automatically determine if a device should be removed, so a manual option where the user can make the choice is in some cases still needed.

To solve this need, some integrations had implemented an integration specific websocket command with accompanying frontend support to allow manual removal of a device. With this new feature, integrations do no longer need to add any websocket or frontend code but can easily support, just by implementing the backend callback function, manual device removal.

Happy days!
