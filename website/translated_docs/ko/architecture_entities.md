---
title: "엔티티 아키텍쳐"
sidebar_label: 엔티티
---

![Hass.io 의 아키텍쳐 개요](/img/en/architecture/entities_architecture.png)

## 구성

설정은 [configuration.yaml 파일](configuration_yaml_index.md) 혹은 [컨피그 엔트리](config_entries_index.md)에 의해 제공됩니다.

## 컴포넌트

컴포넌트 예: `light`, `switch`.

컴포넌트는 Abstract Entity Class 와 엔티티를 제어하기 위한 서비스를 정의합니다.

## 엔티티 컴포넌트

엔티티 컴포넌트는:

- 플랫폼에 설정 배포
- 설정 항목 전달과 검색
- 서비스 호출에 대한 엔티티 수집
- 부수적으로 모든 엔티티 그룹을 유지 관리

## 엔티티 플랫폼

엔티티 플랫폼은 플랫폼에 대한 모든 엔티티를 관리하고 필요한 경우 업데이트를 폴링합니다.

엔티티를 추가 할 때, 엔티티 플랫폼은 엔티티 레지스트리를 쿼리해서 추가 할 엔티티에 올바른 엔티티 ID가 있는지 확인합니다.

## 엔티티 레지스트리

[엔티티 레지스트리](entity_registry_index.md)는 엔티티를 추적하고 사용자가 엔티티에 대해 추가 설정을 저장할 수 있도록 해줍니다.

## 플랫폼

플랫폼 예: `light.hue`, `switch.wemo`.

플랫폼은 설정을 사용하여 외부 기기/서비스를 쿼리하고 엔티티를 엔티티 플랫폼에 추가합니다.