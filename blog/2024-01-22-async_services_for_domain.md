---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Enumerating services
---

In Home Assistant 2024.2, we will introduce `hass.services.async_services_for_domain()`, which is a new way to enumerate services by domain, allowing integrations to inspect which services are available without having to obtain all the services on the system. We found that most integrations are only interested in the services they provide, and it was expensive to enumerate all the services in the system when an integration was only interested in their services.

Integrations that call `hass.services.async_services()[DOMAIN]` to get services for a specific domain should replace the call with `hass.services.async_services_for_domain(DOMAIN)`.