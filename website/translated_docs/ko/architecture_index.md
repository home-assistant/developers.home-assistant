---
title: "아키텍쳐"
sidebar_label: "대하여"
---

Home Assistant 아키텍처로 들어가기에 앞서, 홈 자동화 환경에 대한 명확한 개요를 살펴보도록 하겠습니다. 이를 통해 우리는 Home Assistant 의 다른 부분이 그림에 어떻게 들어 맞는지 보여줄 수 있습니다.

이 개요의 각 부분에 대한 자세한 내용은 [ 저희 블로그](https://www.home-assistant.io/blog/2014/12/26/home-control-home-automation-and-the-smart-home/)를 참조해주세요. 다음은 블로그의 요약버전 입니다:

- 홈 제어는 정보 수집 및 기기 제어를 담당합니다.
- 홈 자동화는 사용자 설정을 기반으로 명령을 트리거 합니다.
- 스마트 홈은 이전 동작을 기반으로 명령을 트리거 합니다.

![Home Automation landscape](/img/en/architecture/home_automation_landscape.svg)

Home Assistant 코어는 홈 제어를 담당합니다. Home Assistant 는 이를 위해 네 부분으로 구성되어 있습니다:

- **Event Bus**: facilitates the firing and listening of events -- the beating heart of Home Assistant.
- **State Machine**: keeps track of the states of things and fires a `state_changed` event when a state has been changed.
- **Service Registry**: listens on the event bus for `call_service` events and allows other code to register services.
- **Timer**: sends a `time_changed` event every 1 second on the event bus.

![Overview of the Home Assistant core architecture](/img/en/architecture/ha_architecture.svg)