---
title: "Hass.io Architecture"
---

<p class='img'>
  <a href='/images/hassio/architecture.png'><img src='/images/hassio/architecture.png' alt='Architecture overview of Hass.io'></a>
  Architecture overview of Hass.io
</p>

### Host Control (HC)

This is a daemon running on the host machine that allows the supervisor to control certain aspects of the host OS:

 - Power cycle (restart, turn off)
 - Manage network settings
 - Local updates

### Host

Our pre-build images are based on [ResinOS]. Any Linux machine can be turned into a Hass.io host by running [the installer][linux].

### Supervisor

The supervisor offers an API to manage the host and running the Docker containers.

### Configuration panel

The configuration panel lives inside the supervisor but is accessible via the Home Assistant user interface. The configuration panel allows the user to manage the installation.

[ResinOS]: https://resinos.io/
[linux]: /hassio/installation/#alternative-install-on-generic-linux-server
