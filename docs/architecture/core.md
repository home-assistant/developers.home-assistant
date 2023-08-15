---
title: Core Architecture
sidebar_label: Core
---

The Home Assistant Core consists of four main parts.

- **Event Bus**: facilitates the firing and listening of events — the beating heart of Home Assistant.
- **State Machine**: keeps track of states and fires a `state_changed` event when a state has been changed.
- **Service Registry**: listens on the event bus for `call_service` events and allows other code to register services.
- **Timer**: sends a `time_changed` event every 1 second on the event bus.

It also includes many helper classes to deal with common scenarios, like providing an entity or dealing with locations.

<img class='invertDark'
  alt='Overview of the Home Assistant core architecture'
  src='/img/en/architecture/ha_architecture.svg'
/>
