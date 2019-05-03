---
title: "Developing an add-on"
sidebar_label: Introduction
---

Add-ons for Hass.io allow the user to extend the functionality around Home Assistant. This can be running an application that Home Assistant can integrate with (like an MQTT broker) or to share the configuration via Samba for easy editing from other computers. Add-ons can be configured via the Hass.io panel in Home Assistant.

Under the hood, add-ons are Docker images published in [Docker Hub](https://hub.docker.com/). Developers can create [GitHub](https://github.com) repositories that contain multiple references to add-ons for easy sharing with the community.

1. [Tutorial: Making your first add-on](hassio_addon_tutorial.md)
1. [Configuration](hassio_addon_config.md)
1. [Communication](hassio_addon_communication.md)
1. [Local Testing](hassio_addon_testing.md)
1. [Publishing](hassio_addon_publishing.md)
1. [Presentation](hassio_addon_presentation.md)
1. [Repositories](hassio_addon_repository.md)
1. [Security](hassio_addon_security.md)


Useful links:

* [Hass.io Supervisor](https://github.com/home-assistant/hassio)
* [Hass.io Core Add-ons](https://github.com/home-assistant/hassio-addons)
* [Hass.io Build environment](https://github.com/home-assistant/hassio-build)
* [Hass.io base images](https://github.com/home-assistant/hassio-base)
* [Hass.io Builder](https://github.com/home-assistant/hassio-builder)
* [Hass.io community Add-ons](https://github.com/hassio-addons)
* [HassOS embedded Linux](https://github.com/home-assistant/hassos)
* [Home Assistant Dockerfile](https://github.com/home-assistant/hassio-homeassistant)
