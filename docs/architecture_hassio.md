---
title: "Hass.io Architecture"
sidebar_label: Hass.io
---

![Architecture overview of Hass.io](/img/en/architecture/hassio.png)

## Host Control (HC)

This is a daemon running on the host machine that allows the supervisor to control certain aspects of the host OS:

 - Power cycle (restart, turn off)
 - Manage network settings
 - Local updates

## Host

Our pre-build images are based on [HassOS] which is based on [BuildRoot]. Any Linux machine can be turned into a Hass.io host by running [the installer][linux].

## Supervisor

The supervisor offers an API to manage the host and running the Docker containers.

## Configuration panel

The configuration panel lives inside the supervisor but is accessible via the Home Assistant user interface. The configuration panel allows the user to manage the installation.

[HassOS]: https://github.com/home-assistant/hassos
[BuildRoot]: https://buildroot.org/
[linux]: https://www.home-assistant.io/hassio/installation/#alternative-install-on-generic-linux-server
