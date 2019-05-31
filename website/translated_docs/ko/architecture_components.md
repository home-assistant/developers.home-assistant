---
title: "컴포넌트 아키텍쳐"
sidebar_label: "컴포넌트"
---

Home Assistant 는 **구성요소 즉, 컴포넌트**로 확장될 수 있습니다. 각 컴포넌트는 Home Assistant 내의 특정 도메인을 담당합니다. 컴포넌트는 이벤트를 수신하거나 트리거하고, 서비스를 제공하고, 상태를 유지 관리 할 수 ​​있습니다. 컴포넌트는 파이썬으로 작성되며 파이썬에서 제공하는 모든 유용한 점을 이용할 수 있습니다. Home Assistant 는 바로 사용가능한 다양한 [내장 컴포넌트](https://www.home-assistant.io/components/)를 제공합니다.

<img src='/img/en/architecture/component_interaction.png' alt='Diagram showing interaction between components and the Home Assistant core.' />

Home Assistant 에는 크게 다음의 두가지 컴포넌트로 나눌 수 있습니다: 이는 사물 인터넷 도메인과 상호작용하는 컴포넌트와 Home Assistant 에서 발생하는 이벤트에 응답하는 컴포넌트입니다. 각 유형에 대해 알아 보려면 계속 읽어주세요!

## 사물 인터넷 도메인과 상호작용하는 컴포넌트

이 컴포넌트는 특정 도메인 내의 장치를 추적하며 핵심 부분과 플랫폼 특화 로직으로 구성됩니다. 이러한 컴포넌트는 상태 시스템 및 이벤트 버스를 통해 정보를 제공합니다 컴포넌트는 서비스 레지스트리에 서비스를 등록하여 장치의 제어를 노출합니다.

예를 들어, 내장 된 [ `스위치` 컴포넌트](https://www.home-assistant.io/components/switch/)는 다양한 유형의 스위치와 상호 작용을 담당합니다. A platform provides support for a particular kind or brand of device. For example, a switch could use a WeMo or Orvibo platform and a light component might interact with the Hue or LIFX platform.

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

![Overview of the full Home Assistant architecture with a couple of loaded components and platforms](/img/en/architecture/ha_full_architecture.png)

The platform logic for components uses third-party Python libraries to communicate with the devices. Through this, we can leverage some of the best libraries in the Python community.