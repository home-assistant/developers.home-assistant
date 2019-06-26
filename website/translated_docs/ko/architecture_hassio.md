---
title: "Hass.io 아키텍쳐"
sidebar_label: Hass.io
---

![Hass.io 의 아키텍쳐 개요](/img/en/architecture/hassio.png)

## 호스트 제어 (HC)

이는 호스트 시스템에서 실행되는 데몬으로, 관리자가 호스트 OS 의 특정 요소를 제어 할 수 있습니다.

- 전원 조작 (다시 시작, 꺼짐)
- 네트워크 설정 관리
- 로컬 업데이트

## 호스트

사전 빌드 이미지는 [BuildRoot](https://buildroot.org/) 기반의 [HassOS](https://github.com/home-assistant/hassos) 를 기반으로 합니다. 어떤 리눅스 시스템이든지 [설치 프로그램](https://www.home-assistant.io/hassio/installation/#alternative-install-on-generic-linux-server)을 실행해서 Hass.io 호스트로 사용할 수 있습니다.

## 관리자

관리자는 호스트를 관리하고 Docker 컨테이너를 실행하는 API 를 제공합니다.

## 설정 패널

설정 패널은 관리자 내부에 있지만 Home Assistant 사용자 인터페이스를 통해 액세스 할 수 있습니다. 설정 패널은 사용자가 설치를 관리 할 수 ​​있도록 해줍니다.