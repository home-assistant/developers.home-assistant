---
title: "架构"
sidebar_label: "Introduction"
---

在我们深入讨论Home Assistant架构之前，让我们先厘清整个家庭自动化领域。 这样，我们就能够展示Home Assistant各部分是如何满足家庭自动化的场景。

关于此概述的每一部分的更多信息， 请[查看我们的博客](https://www.home-assistant.io/blog/2014/12/26/home-control-home-automation-and-the-smart-home/)。 这里是博客的 tl;dr 版本:

- Home Control is responsible for collecting information and controlling devices.
- Home Automation triggers commands based on user configurations.
- Smart Home triggers commands based on previous behavior.

![Home Automation landscape](/img/en/architecture/home_automation_landscape.svg)

The Home Assistant core is responsible for Home Control. Home Assistant contains four parts which make this possible:

- **Event Bus**: facilitates the firing and listening of events -- the beating heart of Home Assistant.
- **State Machine**: keeps track of the states of things and fires a `state_changed` event when a state has been changed.
- **Service Registry**: listens on the event bus for `call_service` events and allows other code to register services.
- **Timer**: sends a `time_changed` event every 1 second on the event bus.

![Overview of the Home Assistant core architecture](/img/en/architecture/ha_architecture.svg)