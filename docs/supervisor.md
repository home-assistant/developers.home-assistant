---
title: Home Assistant Supervisor
sidebar_label: Introduction
---

<img class='invertDark' src='/img/en/architecture/hassio.png'
  alt='Architecture Overview of Home Assistant' />

## Host Control (HC)

This is a daemon running on the host machine that allows the supervisor to control certain aspects of the host OS:

- Power cycle (restart, turn off)
- Manage network settings
- Local updates

## Host

Our pre-build images are based on [Home Assistant Operating System] which is based on [BuildRoot]. Any Linux machine can be turned into a Home Assistant host by running [the installer][linux].

## Supervisor

The supervisor offers an API to manage the host and running the Docker containers.

## Configuration panel

The configuration panel lives inside the supervisor but is accessible via the Home Assistant user interface. The configuration panel allows the user to manage the installation.

[HassOS]: https://github.com/home-assistant/operating-system
[BuildRoot]: https://buildroot.org/
[linux]: https://www.home-assistant.io/hassio/installation/#alternative-install-on-generic-linux-server
