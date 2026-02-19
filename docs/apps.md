---
title: "Developing an app"
sidebar_label: Introduction
---

Apps (formerly known as add-ons) for Home Assistant allow the user to extend the functionality around Home Assistant. This can be running an application that Home Assistant can integrate with (like an MQTT broker) or to share the configuration via Samba for easy editing from other computers. Apps can be configured via the Supervisor panel in Home Assistant.

Under the hood, apps are container images published to a container registry like [GitHub container registry](https://github.com/features/packages) and [Docker Hub](https://hub.docker.com/). Developers can create [GitHub](https://github.com) repositories that contain multiple apps for easy sharing with the community.

- [Tutorial: Making your first app](apps/tutorial.md)
- [Configuration](apps/configuration.md)
- [Communication](apps/communication.md)
- [Local Testing](apps/testing.md)
- [Publishing](apps/publishing.md)
- [Presentation](apps/presentation.md)
- [Repositories](apps/repository.md)
- [Security](apps/security.md)

Useful links:

- [Example App repository](https://github.com/home-assistant/addons-example)
- [Home Assistant Supervisor](https://github.com/home-assistant/supervisor)
- [Home Assistant Core Apps](https://github.com/home-assistant/addons)
- [Home Assistant Docker base images](https://github.com/home-assistant/docker-base)
- [Home Assistant Builder](https://github.com/home-assistant/builder)
- [Home Assistant community apps](https://github.com/hassio-addons)
- [Home Assistant Operating System](https://github.com/home-assistant/operating-system)
- [Home Assistant Docker images](https://github.com/home-assistant/docker)
