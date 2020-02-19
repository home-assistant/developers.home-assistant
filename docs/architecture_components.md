---
title: "Components Architecture"
sidebar_label: "Components"
---

Home Assistant can be extended with **components**. Each component is responsible for a specific domain within Home Assistant. Components can listen for or trigger events, offer services, and maintain states. Components are written in Python and can do all the goodness that Python has to offer. Out of the box, Home Assistant offers a bunch of [built-in components](https://www.home-assistant.io/components/).

<img class='invertDark' 
src='/img/en/architecture/component_interaction.png'
alt='Diagram showing interaction between components and the Home Assistant core.' />

There are two types of components within Home Assistant: components that interact with an Internet of Things domain, and components that respond to events that happen within Home Assistant. Read on to learn about each type!

## Components that interact with an Internet-of-Things domain

These components track devices within a specific domain and consist of a core part and platform-specific logic. These components make their information available via the State Machine and the Event Bus. The components also register services in the Service Registry to expose control of the devices.

For example, the built-in [`switch` component](https://www.home-assistant.io/components/switch/) is responsible for interaction with different types of switches. A platform provides support for a particular kind or brand of device. For example, a switch could use a WeMo or Orvibo platform and a light component might interact with the Hue or LIFX platform.

If you want to add support for a new platform, check out the [add new platform section](creating_platform_index.md).

## Components that respond to events that happen within Home Assistant

These components provide small pieces of home automation logic or involve services that do common tasks within your house.

For example, the [`device_sun_light_trigger` component](https://www.home-assistant.io/components/device_sun_light_trigger/) tracks the state of devices and the sun to make sure that the lights are turned on when it gets dark and people are home. The component uses logic like this:

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
  alt='Overview of the full Home Assistant architecture with a couple of loaded components and platforms'
/>

The platform logic for components uses third-party Python libraries to communicate with the devices. Through this, we can leverage some of the best libraries in the Python community.
