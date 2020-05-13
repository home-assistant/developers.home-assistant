---
title: Home Assistant Supervisor
sidebar_label: Introduction
---

The Supervisor allows the user to manage their Home Assistant installation from Home Assistant. The Supervisor has the following responsibilities:

- Run Home Assistant Core
- Update Home Assistant Core. Automatically roll back if the update fails.
- Make and restore backups
- Add-ons
- Unified audio system
- Update the Home Assistant operating system (disabled in a Supervised installation)

## Architecture

<img class='invertDark' src='/img/en/architecture/ha_architecture_2020.png'
  alt='Architecture Overview of Home Assistant' />

<!--
  https://docs.google.com/drawings/d/13-72kr05yK31HrQEMpt7Y45jPqKsMxBeFYX1PUatTuE/edit?usp=sharing
-->

- **Home Assistant Core**: home automation platform
- **Add-ons**: extra applications that the user wants to run on their server
- **DNS**: allows core and add-ons to communicate among one another
- **Audio**: allows core and add-ons to play audio
- **mDNS**: help discover and connect to devices and services in the network
- **Supervisor**: manages all parts of the system and keeps it up to date
- **Docker**: container service to run applications.
- **Operating System**: Linux based operating system
- **D-Bus**: communication system to control parts of the operating system like the network manager
