---
title: "架构"
sidebar_label: "Introduction"
---

在我们深入讨论Home Assistant架构之前，让我们先厘清整个家庭自动化领域。 这样，我们就能够展示Home Assistant各部分是如何满足家庭自动化的场景。

关于此概述的每一部分的更多信息， [查看我们的博客](https://www. home-assistant. io/blog/2014/12/26/home-control-home-automation-and-the-smart-home/)。 这里是博客的 tl;dr 版本:

- 家庭控制(Home Control)负责收集信息和控制设备。
- 家庭自动化(Home Automation)基于用户的配置来触发指令。
- 智能家居(Smart Home)基于先前的行为触发指令。

![家庭自动化领域](/img/en/architecture/home_automation_landscape.svg)

Home Assistant的核心负责家庭控制。 Home Assistant包括四个部分使其可能：

- **事件总线(Event Bus)**: 使事件发布和监听变得方便 - 是Home Assistant跳动的心脏。
- **状态机(State Machine)**: 持续跟踪状态并在状态发生变化时触发 `state_changed` 事件。
- **服务注册表(Service Registry)**: 监听事件总线上的`call_service`事件并允许其他代码注册服务。
- **计时器(Timer)**: 每秒发送一次`time_changed`事件。

![Home Assistant核心架构概览](/img/en/architecture/ha_architecture.svg)