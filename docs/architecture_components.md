---
title: "Integration Architecture"
sidebar_label: "Integrations"
---

Home Assistant can be extended with **integrations**. Each integration is responsible for a specific domain within Home Assistant. Integrations can listen for or trigger events, offer services, and maintain states. Integrations are made up of a component (the base logic) and platforms (bits that integrate with other integrations). Integrations are written in Python and can do all the goodness that Python has to offer. Out of the box, Home Assistant offers a bunch of [built-in integrations](https://www.home-assistant.io/integrations/).

<img class='invertDark'
src='/img/en/architecture/component_interaction.png'
alt='Diagram showing interaction between integrations and the Home Assistant core.' />

There are two types of integrations within Home Assistant: integrations that interact with an Internet of Things domain, and integrations that respond to events that happen within Home Assistant. Read on to learn about each type!

## Integrations that interact with an Internet-of-Things domain

These integrations track devices within a specific domain and consist of a core part and platform-specific logic. These integrations make their information available via the State Machine and the Event Bus. The integrations also register services in the Service Registry to expose control of the devices.

For example, the built-in [`switch` component](https://www.home-assistant.io/integrations/switch/) is responsible for interaction with different types of switches. A platform provides support for a particular kind or brand of device. For example, a switch could use a WeMo or Orvibo platform and a light component might interact with the Hue or LIFX platform.

If you want to add support for a new platform, check out the [add new platform section](creating_platform_index.md).

## Integrations that respond to events that happen within Home Assistant

These integrations provide small pieces of home automation logic or involve services that do common tasks within your house.

For example, the [`device_sun_light_trigger` component](https://www.home-assistant.io/integrations/device_sun_light_trigger/) tracks the state of devices and the sun to make sure that the lights are turned on when it gets dark and people are home. The component uses logic like this:

```text
In the event that device 'Paulus Nexus 5' changes to the 'Home' state:
  If the sun has set and the lights are not on:
    Turn on the lights
```

```text
In the event that the combined state of all tracked devices changes to 'Not Home':
  If the lights are on:
    Turn off the lights
```

```text
In the event of the sun setting:
  If the lights are off and the combined state of all tracked device equals 'Home':
    Turn on the lights
```

## The full picture

When we put all the different pieces of Home Assistant together, it's a close match for the initial home automation overview sketch. The smart home AI has not been implemented yet, so it's not included in this picture.

<img class='invertDark'
  src='/img/en/architecture/ha_full_architecture.png'
  alt='Overview of the full Home Assistant architecture with a couple of loaded integrations and platforms'
/>

The platform logic for integrations uses third-party Python libraries to communicate with the devices. Through this, we can leverage some of the best libraries in the Python community.
