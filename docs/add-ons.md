---
title: "Developing an add-on"
sidebar_label: Introduction
---

Add-ons for Home Assistant allow the user to extend the functionality around Home Assistant. This can be running an application that Home Assistant can integrate with (like an MQTT broker) or to share the configuration via Samba for easy editing from other computers. Add-ons can be configured via the Supervisor panel in Home Assistant.

Under the hood, add-ons are container images published to a container registry like [GitHub container registry](https://github.com/features/packages) and [Docker Hub](https://hub.docker.com/). Developers can create [GitHub](https://github.com) repositories that contain multiple add-ons for easy sharing with the community.

- [Tutorial: Making your first add-on](add-ons/tutorial.md)
- [Configuration](add-ons/configuration.md)
- [Communication](add-ons/communication.md)
- [Local Testing](add-ons/testing.md)
- [Publishing](add-ons/publishing.md)
- [Presentation](add-ons/presentation.md)
- [Repositories](add-ons/repository.md)
- [Security](add-ons/security.md)

Useful links:

- [Example Add-on repository](https://github.com/home-assistant/addons-example)
- [Home Assistant Supervisor](https://github.com/home-assistant/supervisor)
- [Home Assistant Core Add-ons](https://github.com/home-assistant/addons)
- [Home Assistant Docker base images](https://github.com/home-assistant/docker-base)
- [Home Assistant Builder](https://github.com/home-assistant/builder)
- [Home Assistant community Add-ons](https://github.com/hassio-addons)
- [Home Assistant Operating System](https://github.com/home-assistant/operating-system)
- [Home Assistant Docker images](https://github.com/home-assistant/docker)
