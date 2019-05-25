---
title: "인스턴스에 연결하기"
---

사용자가 처음 앱을 열면, 기기를 인증하고 등록하기 위해 로컬 인스턴스에 연결해야합니다.

## 사용자 인증하기

Home Assistant 에 `_home-assistant._tcp.local.` 을 검색해서 구성된 [zeroconf 컴포넌트](https://www.home-assistant.io/components/zeroconf)가 있는 경우, 로컬 인스턴스가 검색 될 수 있습니다. 구성되지 않은 경우엔 사용자에게 해당 인스턴스의 로컬 주소를 물어봐야합니다.

인스턴스의 주소가 확인되면, 앱은 사용자에게 [Home Assistant 의 OAuth2](auth_api.md)를 통해 인증을 요청합니다. Home Assistant 는 IndieAuth 를 사용합니다. 즉, 앱을 트리거하는 url 로 리디렉션 할 수 있도록 하려면 몇 가지 추가 조치가 필요합니다. "Client" 섹션의 마지막 단락을 확실히 읽어주세요.

## 기기 등록하기

*Home Assistant 0.90 혹은 그 이후 버전에 필요.*

Home Assistant 에는 애플리케이션을 등록하고 인스턴스와 상호 작용할 수있는 `mobile_app` 컴포넌트가 있습니다. 이것은 가장 일반적인 모바일 애플리케이션 작업을 처리하기 위한 일반적인 컴포넌트 입니다. 이 컴포넌트는, 이 컴포넌트가 제공하는 것보다 많은 유형의 상호 작용이 필요한 경우, 별도의 상호 작용을 통해 확장할 수 있습니다.

사용자로 인증 할 토큰이 있다면, 이제 Home Assistant 의 모바일 앱 구성 요소에 앱을 등록 할 차례입니다.

### 준비하기

먼저, `mobile_app` 컴포넌트가 로드되었는지 확인해야합니다. 다음의 2가지 방법이 있습니다:

- `mobile_app` 컴포넌트의 자동 로드를 트리거하기 위해 Zeroconf/Bonjour 레코드`_hass-mobile-app._tcp.local.` 를 게시할 수 있습니다. 계속 진행하기 전에 레코드를 게시한 후엔 최소 60초 정도 기다려주세요.
- 사용자에게 configuration.yaml 에 `mobile_app` 을 추가하고 Home Assistant 를 재시작 하도록 요청할 수 있습니다. 사용자가 구성파일에 `default_config` 를 넣어둔 상태라면, ` mobile_app` 은 이미 로드되었을겁니다.

`mobile_app` 컴포넌트가 로드되었는지 확인하려면 [`/api/config` REST API 호출](external_api_rest.md#get-api-config)의 `components` 배열을 확인해보면 됩니다. 기기 등록을 진행하는데 404 상태 코드를 받는다면 대부분 로드되지 않은 경우 입니다.

### 기기 등록하기

기기를 등록하려면 `/api/mobile_app/registrations` 에 인증 된 POST 요청을 해주세요. [인증된 요청 만드는 방법에 대해 자세히 알아보기](auth_api.md#making-authenticated-requests)

앤드포인트에 보내는 페이로드 예제:

```json
{
  "app_id": "awesome_home",
  "app_name": "Awesome Home",
  "app_version": "1.2.0",
  "device_name": "Robbies iPhone",
  "manufacturer": "Apple, Inc.",
  "model": "iPhone X",
  "os_version": "iOS 10.12",
  "supports_encryption": true,
  "app_data": {
    "push_notification_key": "abcdef",
  }
}
```

| 키                     | 필수여부 | 구분     | 설명                                                        |
| --------------------- | ---- | ------ | --------------------------------------------------------- |
| `app_id`              | 예    | string | 앱에 대한 고유식별자                                               |
| `app_name`            | 예    | string | 모바일 앱 이름                                                  |
| `app_version`         | 예    | string | mobile_app 의 버전                                           |
| `device_name`         | 예    | string | 앱을 구동하는 기기의 이름                                            |
| `manufacturer`        | 예    | string | 앱을 구동하는 기기의 제조사                                           |
| `model`               | 예    | string | 앱을 구동하는 기기의 모델명                                           |
| `os_version`          | 예    | string | 앱을 구동하는 OS의 버전                                            |
| `supports_encryption` | 예    | bool   | 앱이 암호화를 지원하는 경우. [암호화 섹션](#encryption) 참고.                |
| `app_data`            |      | Dict   | 앱에 `mobile_app` 기능을 확장하는 컴포넌트 지원이 있는 경우, 앱 데이터를 사용할 수 있슴. |

200 응답코드를 받으면 모바일 앱이 Home Assistant 에 등록됩니다. 응답은 JSON 문서이며 Home Assistant 인스턴스와 상호 작용하는 방법에 대한 URL을 포함합니다. 이 정보는 영구적으로 저장해야 합니다.

```json
{
  "cloudhook_url": "https://hooks.nabu.casa/randomlongstring123",
  "remote_ui_url": "https://randomlongstring123.ui.nabu.casa",
  "secret": "qwerty",
  "webhook_id": "abcdefgh"
}
```

| 키               | 구분     | 설명                                                                                                                              |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `cloudhook_url` | string | Home Assistant Cloud 에서 제공한 클라우드훅 URL. 사용자가 Nabu Casa 에 가입 활성화 된 경우에만 제공.                                                       |
| `remote_ui_url` | string | Home Assistant Cloud 에서 제공한 원격 UI URL. 사용자가 Nabu Casa 에 가입 활성화 된 경우에만 제공.                                                       |
| `secret`        | string | 암호화 통신을 위한 키. 앱과 Home Assistant 인스턴스 모두 암호화가 지원되는 경우에만 포함. [자세히 알아보기](app_integration_sending_data.md#implementing-encryption). |
| `webhook_id`    | string | 보낸 데이터를 되받을수 있는 웹훅 ID.                                                                                                          |