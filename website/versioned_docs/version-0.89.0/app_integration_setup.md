---
title: Connecting to an instance
id: version-0.89.0-app_integration_setup
original_id: app_integration_setup
---

When a user first opens the app, they will need to connect to their local instance to authenticate and register the device.

## Authenticating the user

The local instance can be discovered if Home Assistant has the [zeroconf component] configured by searching for `_home-assistant._tcp.local.`. If not configured, the user will need to be asked for the local address of their instance.

When the address of the instance is known, the app will ask the user to authenticate via [OAuth2 with Home Assistant]. Home Assistant uses IndieAuth, which means that to be able to redirect to a url that triggers your app, you need to take some extra steps. Make sure to read the last paragraph of the "Clients" section thoroughly.

[zeroconf component]: https://www.home-assistant.io/components/zeroconf
[OAuth2 with Home Assistant]: auth_api.md

## Registering the device

> This is an experimental feature. We expect to evolve the API in the upcoming releases.

_This requires Home Assistant 0.89 or later._

Home Assistant has a `mobile_app` component that allows applications to register themselves and interact with the instance. This is a generic component to handle most common mobile application tasks. This component is extendable with custom interactions if your app needs more types of interactions than are offered by this component.

Once you have tokens to authenticate as a user, it's time to register the app with the mobile app component in Home Assistant. You can do so by making an authenticated POST request to `/api/mobile_app/devices`. [More info on making authenticated requests.](auth_api.md#making-authenticated-requests)

If you get a 404 when making this request, it means the user does not have the mobile_app component enabled. Prompt the user to enable the `mobile_app` component. The mobile_app component is set up as part of the default Home Assistant configuration.

Example payload to send to the registration endpoint:

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

| Key | Required | Type | Description |
| --- | -------- | ---- | ----------- |
| `app_id` | V | string | A unique identifier for this app.
| `app_name` | V | string | Name of the mobile app.
| `app_version` | V | string | Version of the mobile app.
| `device_name` | V | string | Name of the device running the app.
| `manufacturer` | V | string | The manufacturer of the device running the app.
| `model` | V | string | The model of the device running the app.
| `os_version` | V | string | The OS version of the device running the app.
| `supports_encryption` | V | bool | If the app supports encryption. See also the [encryption section](#encryption).
| `app_data` |  | Dict | App data can be used if the app has a supporting component that extends mobile_app functionality.

When you get a 200 response, the mobile app is registered with Home Assistant. The response is a JSON document and will contain the urls on how to interact with the Home Assistant instance. Store this information.

```json
{
  "webhook_id": "abcdefgh",
  "secret": "qwerty"
}
```

| Key | Type | Description
| --- | ---- | -----------
| `webhook_id` | string | The webhook ID that can be used to send data back.
| `secret` | string | The secret to use for encrypted communication. Will only be included if encryption is supported by both the app and the Home Assistant instance.


## Encryption

The mobile app component supports encryption to make sure all communication between the app and Home Assistant is encrypted. The encryption is powered by [libsodium](https://libsodium.gitbook.io). Example to encrypt the message using libsodium on Python:

```python
from nacl.secret import SecretBox
from nacl.encoding import Base64Encoder

data = SecretBox(key).encrypt(
  payload,
  encoder=Base64Encoder
).decode("utf-8")
```
