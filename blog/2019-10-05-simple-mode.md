---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Simple Mode in Home Assistant 1.0
---

import DiscussionBox from '../static/js/discourse_discussion.jsx'

:::info
This blog post references simple and advanced mode. This has since been renamed to standard mode and advanced mode.
:::

The Home Assistant UI has two different modes. There is a simple mode and an advanced mode. Simple mode has been introduced recently in [Home Assistant 0.96](https://www.home-assistant.io/blog/2019/07/17/release-96/#advanced-mode). In this post I want to outline my vision for simple mode in Home Assistant 1.0.

**With simple mode we focus on the core Home Assistant experience. We're trying to answer the question: what is it that we want anyone to be able to do. Can we make it intuitive enough that people, young and old, can install Home Assistant and use it.**

## Core concepts

Simple mode is the simplified interface for non-power users. This is the default UI. Simple mode offers a subset of Home Assistant that is intuitive: easy to understand and easy to use.

In simple mode, we will structure the configuration to how the user thinks about their house:

- Inputs: devices and persons
- Outputs: scenes, scripts, automations

<center>
![Configuration concepts. Inputs are users, integrations, zones, persons, devices. Outputs are scenes, scripts and automations.](/img/en/blog/2019-10-simple-mode/config-concepts.png)
</center>

<!-- https://docs.google.com/drawings/d/1021ATCQ_Q3eBQQ1Ei5Bq7rSBfn6YtLh9113HimpsYWs/edit?usp=sharing -->

There are other inputs, but they are there to support devices and persons:

- Integrations allow you to interact with your devices
- Users allow persons to log in and access Home Assistant
- Areas allow devices to be grouped
- Zones label locations on the map to allow tracking persons that carry a GPS emitting device

As a user in simple mode, you will not be exposed to events, entity IDs, YAML or services.

<!--truncate-->

## Integration requirements

Integrations need to be able to provide the inputs for the user in simple mode. This means that there will be requirements that need to be met before an integration can be included as part of simple mode.

- All entities of an integration need to have a unique ID
- All entities of an integration need to provide device info

Integrations should be set up via discovery or via account linking. In rare cases we can allow an integration to be configured via IP addresses.

## Extended discovery

During onboarding and when the user visits the integrations page, we will trigger an extended discovery. By default Home Assistant scans the network with the SSDP and zeroconf discovery protocols. In extended discovery we will run custom discovery protocols for popular integrations like Plex or Unifi.

## No YAML

Simple mode will be fully controlled via the UI. No features should be exposed that require users to open a text editor. For example, a config flow that requires a user to add client_id/secret to the configuration.yaml should not be part of simple mode.

## Hass.io without add-ons

In simple mode, Hass.io will be the place where users can go to manage hardware settings and updates.

The initial version of simple mode will not show features to install Hass.io add-ons. This is done to manage the scope of Home Assistant 1.0. In the future we will revisit this and decide which add-ons fit our simple mode.

## Scenes

Users will control devices from scripts and automations using scenes instead of services. With scenes you take a snapshot of the current state of your devices and can restore this at a future moment. Easy to explain so easy to use. Our UI for managing scenes will be built around devices and areas.

## Automations & Scripts

Automations and scripts will be used with the current editor, but the types of triggers, conditions and actions will be limited to the ones that match our inputs.

- Trigger types will be limited to time, sun, zone and device triggers.
- Condition types will be limited to time, zone, sun and device conditions.
- Action types will be limited to activate scene and device actions.

## I am a power user, why would I care?

By focusing energy on simple mode, we are making Home Assistant easier to use for all users, both beginners and power users.

A great recent example of a feature that was driven by simple mode, but is beneficial for everyone is device automations. With device automations it is a breeze to configure Zigbee remotes. You can just pick from a list the button that should trigger your automation. Compare this to the old way of doing it: learn that you need to listen for `zha_event` in the event dev tool, then press the button to learn the event data to match on with an event trigger.

Another ongoing effort that will make it easier for everyone is our Hacktoberfest focus on making scenes a [first-class citizen](https://github.com/home-assistant/core/issues/25681).

## Comments

<div id='discourse-comments'></div>

<DiscussionBox discourseUrl="https://community.home-assistant.io/"
      discourseEmbedUrl="https://developers.home-assistant.io/blog/2019/10/05/simple-mode.html" />
