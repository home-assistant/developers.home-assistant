---
title: "센서"
---

`mobile_app` 컴포넌트는 앱을 통해 전반적으로 관리 할 수있는 맞춤형 센서의 노출을 지원합니다.

## 센서 등록하기

모든 센서는 업데이트 되기 전에 등록되어야 합니다. 또한, 센서의 업데이트와는 달리 한번에 한 개의 센서만 등록할 수 있습니다.

센서를 등록하려면, 다음과 같이 웹훅에 요청하시면 됩니다:

```json
{
  "data": {
    "attributes": {
      "foo": "bar"
    },
    "device_class": "battery",
    "icon": "mdi:battery",
    "name": "Battery State",
    "state": "12345",
    "type": "sensor",
    "unique_id": "battery_state",
    "unit_of_measurement": "%"
  },
  "type": "register_sensor"
}
```

유효한 키는 다음과 같습니다:

| 키                     | 구분                            | 필수여부 | 설명                                                                                                                                                                     |
| --------------------- | ----------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attributes            | object                        | 아니오  | 센서에 부여할 속성                                                                                                                                                             |
| device_class          | string                        | 아니오  | 유효한 기기 클래스. [이진 센서 클래스](https://www.home-assistant.io/components/binary_sensor/#device-class), [센서 클래스](https://www.home-assistant.io/components/sensor/#device-class) |
| icon                  | Material Design Icon (string) | 아니오  | 접두어는 반드시 `mdi:` 이어야 함. 값이 제공되지 않은 경우, 기본값은 `mdi:cellphone`.                                                                                                            |
| name                  | string                        | 예    | 센서명                                                                                                                                                                    |
| state                 | bool, float, int, string      | 예    | 센서의 상태                                                                                                                                                                 |
| type                  | string                        | 예    | 센서의 종류. 반드시 `binary_sensor` 혹은 `sensor` 중 하나이어야 함.                                                                                                                     |
| unique_id             | string                        | 예    | 앱 설치의 고유식별자. 나중에 필요함. 일반적으로 센서명의 안전 버전 정도로 설정                                                                                                                          |
| unit_of_measurement | string                        | 아니오  | 센서의 측정단위                                                                                                                                                               |

센서는 등록되는 대로 바로 표시됩니다.

## 센서 업데이트

센서가 등록되면, 업데이트를 해 줘야 합니다. 센서 등록과 유사하지만, 한번에 모든 센서를 업데이트 할 수 있습니다.

예를 들면, 앞서 등록한 센서를 업데이트 한다면 다음과 같이 요청해줍니다:

```json
{
  "data": [
    {
      "attributes": {
        "hello": "world"
      },
      "icon": "mdi:battery",
      "state": 123,
      "type": "sensor",
      "unique_id": "battery_state"
    }
  ],
  "type": "update_sensor_states"
}
```

업데이트 중에는 일부 키만 허용됩니다:

| 키          | 구분                            | 필수여부 | 설명                                                 |
| ---------- | ----------------------------- | ---- | -------------------------------------------------- |
| attributes | object                        | 아니오  | 센서에 부여할 속성                                         |
| icon       | Material Design Icon (string) | 아니오  | 접두어는 반드시 `mdi:` 이어야 함.                             |
| state      | bool, float, int, string      | 예    | 센서의 상태                                             |
| type       | string                        | 예    | 센서의 종류. 반드시 `binary_sensor` 혹은 `sensor` 중 하나이어야 함. |
| unique_id  | string                        | 예    | 앱 설치의 고유식별자. 나중에 필요함. 일반적으로 센서명의 안전 버전 정도로 설정      |