---
title: "집으로 데이터 보내기"
---

앱을 모바일 앱 컴포넌트에 등록하면, 제공된 웹 훅 정보를 통해 Home Assistant 와 상호 작용할 수 있습니다.

첫 번째 단계는 반환 된 웹 훅 아이디를 다음과 같이 전체 URL 로 변환시켜주는 것입니다:`<instance_url>/api/webhook/<webhook_id>`. 이 url 은 모든 상호 작용에 필요할 유일한 url 입니다. 웹 훅 앤드포인트는 인증된 요청이 필요하지 않습니다.

등록하는 동안 Cloudhook URL 이 제공된 경우 기본 제공된 값을 사용해야하며, 위 요청이 실패한 경우 위에 설명된것과 같은 URL 로 대체시켜주면 됩니다.

등록하는 동안 원격 UI URL 이 제공된 경우 URL 을 생성 할 때 `instance_url` 을 사용해야하며, 원격 UI URL 이 실패한 경우 사용자 제공 URL 로 대체시켜주면 됩니다.

요약하자면, 요청방법은 다음과 같습니다:

1. Cloudhook URL이 있다면 요청이 실패할때 까지 사용하세요. 요청이 실패하면, 2단계로 가세요.
2. 원격 UI URL이 있다면, 웹훅 URL 을 다음과 같이 구성합니다: `<remote_ui_url>/api/webhook/<webhook_id>`. 요청이 실패하면, 3단계로 가세요.
3. 구성 중에 제공된 인스턴스 URL 을 사용하여 다음과 같이 웹훅 URL 을 만듭니다: `<instance_url>/api/webhook/<webhook_id>`.

## 인스턴스 URL 에 대한 짧은 설명

일부 사용자는 Home Assistant 를 동적 DNS(DDNS) 서비스를 사용하여 홈 네트워크 외부에서 사용 가능하도록 구성합니다. 일부 라우터(공유기) 는 헤어핀 / NAT 루프백을 지원하지 않습니다: 라우터의 네트워크 내부로부터 외부에서 구성된 DNS 서비스를 통해 로컬 네트워크의 Home Asisstant 로 데이터를 보내는 기기입니다.

이런 문제를 해결하려면, 앱에서 사용자의 홈 네트워크 인 WiFi SSID 를 기록해두고 홈 WiFi 네트워크에 연결될 때 직접 연결을 사용해야합니다.

## 상호 작용 기본 사항

### 요청

모든 상호 작용은 웹훅 URL에 대해 HTTP POST 요청을 만드는것에 의해 이루어집니다. 이러한 요청에는 인증이 필요하지 않습니다.

페이로드 형식은 상호 작용 유형에 따라 다르지만, 다음과 같은 공통된 기반을 공유합니다:

```json5
{
  "type": "<type of message>",
  "data": {}
}
```

등록하는 동안 `secret` 를 받았다면 메시지를 **반드시** 암호화해서 다음과 같이 페이로드에 넣어주어야 합니다:

```json5
{
  "type": "encrypted",
  "encrypted": true,
  "encrypted_data": "<encrypted message>"
}
```

### 응답

일반적으로는, 모든 요청에 ​​대해 200 상태 코드 응답을 받습니다. 다음은 다른 상태 코드를 받게되는 몇 가지 경우입니다:

- JSON 이 잘못된 경우 400 상태 코드를 받게됩니다. 단, 암호화 된 JSON 이 잘못된 경우에는 이 오류를 받지 않습니다.
- 센서를 만들때 201 상태코드를 받습니다.
- 404 상태 코드 응답을 받은 경우 `mobile_app` 컴포넌트는 대체로 로드되지 않은 경우 입니다.
- 410 상태 코드를 받은것은 통합 구성요소가 삭제되었음을 의미합니다. 이 경우 사용자에게 알려주어야하며 대개는 다시 등록해야합니다.

## 암호화 구현

`mobile_app` 은 [Sodium](https://libsodium.gitbook.io/doc/) 을 통한 양방향 암호화 통신을 지원합니다.

> Sodium 은 암호화, 복호화, 서명, 비밀번호 해시 등을 위한 현대적이고 사용하기 쉬운 소프트웨어 라이브러리입니다.

### 라이브러리 선택

Sodium 을 래핑하는 라이브러리는 대부분의 최신 프로그래밍 언어와 플랫폼에 제공됩니다. Sodium 자체는 C 언어로 작성되었습니다.

제안드리는 라이브러리가 여기 있습니다만, 잘 작동하는 라이브러리라면 어떤것이든 자유롭게 사용이 가능합니다.

- Swift/Objective-C: [swift-sodium](https://github.com/jedisct1/swift-sodium) (Sodium 개발자 공식 라이브러리)

다른 언어용은 [다른 언어로 바인딩하기](https://download.libsodium.org/doc/bindings_for_other_languages) 의 목록을 참고해주세요. 둘 이상의 선택 항목이 있는 경우 가장 최근에 업데이트 된 항목을 사용하는 것이 좋습니다.

### 구성

페이로드를 암호화하고 복호화하기 위해 Sodium 의 [secret-key crytography](https://download.libsodium.org/doc/secret-key_cryptography) 기능을 사용합니다. 모든 페이로드는 Base64 로 인코딩 된 JSON 입니다. Base64 의 경우, `sodium_base64_VARIANT_ORIGINAL` 을 사용합니다 (즉, "original", no padding, not URL safe).

### Signaling encryption support

During registration, you must set `supports_encryption` to `true` to enable encryption. The Home Assistant instance must be able to install `libsodium` to enable encryption. Confirm that you should make all future webhook requests encrypted by the presence of the key `secret` in the initial registration response. You must store this secret forever. There is no way to recover it via the Home Assistant UI and you should **not** ask users to investigate hidden storage files to re-enter the encryption key. You should create a new registration if encryption ever fails and alert the user.

## Update device location

This message will inform Home Assistant of new location information.

```json
{
    "type": "update_location",
    "data": {
        "gps": [12.34, 56.78],
        "gps_accuracy": 120,
        "battery": 45
    }
}
```

| 키                   | 구분      | 설명                                                                                                                     |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `location_name`     | string  | Name of the zone the device is in.                                                                                     |
| `gps`               | latlong | Current location as latitude and longitude.                                                                            |
| `gps_accuracy`      | int     | GPS accurracy in meters. Must be greater than 0.                                                                       |
| `battery`           | int     | Percentage of battery the device has left. Must be greater than 0.                                                     |
| `speed`             | int     | Speed of the device in meters per second. Must be greater than 0.                                                      |
| `altitude`          | int     | Altitude of the device in meters. Must be greater than 0.                                                              |
| `course`            | int     | The direction in which the device is traveling, measured in degrees and relative to due north. Must be greater than 0. |
| `vertical_accuracy` | int     | The accuracy of the altitude value, measured in meters. Must be greater than 0.                                        |

## Call a service

Call a service in Home Assistant.

```json
{
    "type": "call_service",
    "data": {
        "domain": "light",
        "service": "turn_on",
        "service_data": {
            "entity_id": "light.kitchen"
        }
    }
}
```

| 키              | 구분     | 설명                              |
| -------------- | ------ | ------------------------------- |
| `domain`       | string | The domain of the service       |
| `service`      | string | The service name                |
| `service_data` | dict   | The data to send to the service |

## Fire an event

Fire an event in Home Assistant.

```json
{
    "type": "fire_event",
    "data": {
        "event_type": "my_custom_event",
        "event_data": {
            "something": 50
        }
    }
}
```

| 키            | 구분     | 설명                        |
| ------------ | ------ | ------------------------- |
| `event_type` | string | Type of the event to fire |
| `event_data` | string | Date of the event to fire |

## Render templates

Renders one or more templates and returns the result(s).

```json
{
    "type": "render_template",
    "data": {
        "my_tpl": {
            "template": "Hello {{ name }}, you are {{ states('person.paulus') }}.",
            "variables": {
                "name": "Paulus"
            }
        }
    }
}
```

`data` must contain a map of `key`: `dictionary`. Results will be returned like `{"my_tpl": "Hello Paulus, you are home"}`. This allows for rendering multiple templates in a single call.

| 키           | 구분     | 설명                                       |
| ----------- | ------ | ---------------------------------------- |
| `template`  | string | The template to render                   |
| `variables` | Dict   | The extra template variables to include. |

## Update registration

Update your app registration. Use this if the app version changed or any of the other values.

```json
{
    "type": "update_registration",
    "data": {
        "app_data": {
            "push_token": "abcd",
            "push_url": "https://push.mycool.app/push"
        },
        "app_version": "2.0.0",
        "device_name": "Robbies iPhone",
        "manufacturer": "Apple, Inc.",
        "model": "iPhone XR",
        "os_version": "23.02"
    }
}
```

All keys are optional.

| 키              | 구분     | 설명                                                                                                                                              |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `app_data`     | Dict   | App data can be used if the app has a supporting component that extends mobile_app functionality or wishes to enable the notification platform. |
| `app_version`  | string | Version of the mobile app.                                                                                                                      |
| `device_name`  | string | Name of the device running the app.                                                                                                             |
| `manufacturer` | string | The manufacturer of the device running the app.                                                                                                 |
| `model`        | string | The model of the device running the app.                                                                                                        |
| `os_version`   | string | The OS version of the device running the app.                                                                                                   |

## Get zones

Get all enabled zones.

```json
{
    "type": "get_zones"
}
```

## Get config

Returns a version of `/api/config` with values useful for configuring your app.

```json
{
  "type": "get_config"
}
```