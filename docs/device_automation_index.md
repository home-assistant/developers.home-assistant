---
title: "Device Automations"
sidebar_label: Introduction
---

Device Automations provide users with a device-centric layer on top of the core concepts of Home Assistant. When creating automations, users no longer have to deal with core concepts like states and events. Instead, they will be able to pick a device and then pick from a list of pre-defined triggers, conditions and actions.

Integrations can hook into this system by exposing functions to generate the pre-defined triggers, conditions, actions and having functions that can listen for the triggers, check the condition and execute the action.

Device automations are not exposing extra functionality but are a way for users to not have to learn new concepts. Device automations are using events, state and service helpers under the hood.
