---
title: "Developing an add-on"
sidebar_label: Introduction
---

Add-ons for Hass.io allow the user to extend the functionality around Home Assistant. This can be running an application that Home Assistant can integrate with (like an MQTT broker) or to share the configuration via Samba for easy editing from other computers. Add-ons can be configured via the Hass.io panel in Home Assistant.

Under the hood, add-ons are Docker images published in [Docker Hub](https://hub.docker.com/). Developers can create [GitHub](https://github.com) repositories that contain multiple references to add-ons for easy sharing with the community.

- [Tutorial: Making your first add-on](tutorial)
- [Configuration](add-ons/configuration.md)
- [Communication](add-ons/communication)
- [Local Testing](docs/add-ons/testing.md)
- [Publishing](publishing.md)
- [Presentation](presentation.md)
- [Repositories](repository.md)
- [Security](security.md)

Useful links:

- [Supervisor](https://github.com/home-assistant/supervisor)
- [Core Add-ons](https://github.com/home-assistant/hassio-addons)
- [Docker base images](https://github.com/home-assistant/docker-base)
- [Builder](https://github.com/home-assistant/hassio-builder)
- [Home Assistant community Add-ons](https://github.com/hassio-addons)
- [Home Assistant Operating System](https://github.com/home-assistant/operating-system)
- [Home Assistant Docker](https://github.com/home-assistant/docker)
