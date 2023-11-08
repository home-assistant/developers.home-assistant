---
title: "Connecting to an instance"
---

When a user first opens the app, they will need to connect to their local instance to authenticate and register the device.

## Authenticating the user

The local instance can be discovered if Home Assistant has the [zeroconf integration] configured by searching for `_home-assistant._tcp.local.`. If not configured, the user will need to be asked for the local address of their instance.

When the address of the instance is known, the app will ask the user to authenticate via [OAuth2 with Home Assistant]. Home Assistant uses IndieAuth, which means that to be able to redirect to a url that triggers your app, you need to take some extra steps. Make sure to read the last paragraph of the "Clients" section thoroughly.

[zeroconf integration]: https://www.home-assistant.io/integrations/zeroconf
[OAuth2 with Home Assistant]: auth_api.md

## Registering the device

_This requires Home Assistant 0.90 or later._

Home Assistant has a `mobile_app` component that allows applications to register themselves and interact with the instance. This is a generic component to handle most common mobile application tasks. This component is extendable with custom interactions if your app needs more types of interactions than are offered by this component.

Once you have tokens to authenticate as a user, it's time to register the app with the mobile app integration in Home Assistant.

### Getting Ready

First, you must ensure that the `mobile_app` integration is loaded. There are two ways to do this:

- You can publish a Zeroconf/Bonjour record `_hass-mobile-app._tcp.local.` to trigger the automatic load of the `mobile_app` integration. You should wait at least 60 seconds after publishing the record before continuing.
- You can ask the user to add `mobile_app` to their configuration.yaml and restart Home Assistant. If the user already has `default_config` in their configuration, then `mobile_app` will have been already loaded.

You can confirm the `mobile_app` component has been loaded by checking the `components` array of the [`/api/config` REST API call](/api/rest.md#get-apiconfig). If you continue to device registration and receive a 404 status code, then it most likely hasn't been loaded yet.

### Registering the device

To register the device, make an authenticated POST request to `/api/mobile_app/registrations`. [More info on making authenticated requests.](/auth_api.md#making-authenticated-requests)

Example payload to send to the registration endpoint:

```json
{
  "device_id": "ABCDEFGH",
  "app_id": "awesome_home",
  "app_name": "Awesome Home",
  "app_version": "1.2.0",
  "device_name": "Robbies iPhone",
  "manufacturer": "Apple, Inc.",
  "model": "iPhone X",
  "os_name": "iOS",
  "os_version": "iOS 10.12",
  "supports_encryption": true,
  "app_data": {
    "push_notification_key": "abcdef"
  }
}
```

| Key                   | Required | Type   | Description                                                                                                                  |
| --------------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------                          |
| `device_id`           | V        | string | A unique identifier for this device. New in Home Assistant 0.104                                                             |
| `app_id`              | V        | string | A unique identifier for this app.                                                                                            |
| `app_name`            | V        | string | Name of the mobile app.                                                                                                      |
| `app_version`         | V        | string | Version of the mobile app.                                                                                                   |
| `device_name`         | V        | string | Name of the device running the app.                                                                                          |
| `manufacturer`        | V        | string | The manufacturer of the device running the app.                                                                              |
| `model`               | V        | string | The model of the device running the app.                                                                                     |
| `os_name`             | V        | string | The name of the OS running the app.                                                                                          |
| `os_version`          | V        | string | The OS version of the device running the app.                                                                                |
| `supports_encryption` | V        | bool   | If the app supports encryption. See also the [encryption section](/api/native-app-integration/sending-data.md#implementing-encryption).  |
| `app_data`            |          | Dict   | App data can be used if the app has a supporting component that extends `mobile_app` functionality.                          |

When you get a 200 response, the mobile app is registered with Home Assistant. The response is a JSON document and will contain the URLs on how to interact with the Home Assistant instance. You should permanently store this information.

```json
{
  "cloudhook_url": "https://hooks.nabu.casa/randomlongstring123",
  "remote_ui_url": "https://randomlongstring123.ui.nabu.casa",
  "secret": "qwerty",
  "webhook_id": "abcdefgh"
}
```

| Key             | Type   | Description                                                                                                                                                                                                            |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudhook_url` | string | The cloudhook URL provided by Home Assistant Cloud. Only will be provided if user is actively subscribed to Nabu Casa.                                                                                                 |
| `remote_ui_url` | string | The remote UI URL provided by Home Assistant Cloud. Only will be provided if user is actively subscribed to Nabu Casa.                                                                                                 |
| `secret`        | string | The secret to use for encrypted communication. Will only be included if encryption is supported by both the app and the Home Assistant instance. [More info](/api/native-app-integration/sending-data.md#implementing-encryption). |
| `webhook_id`    | string | The webhook ID that can be used to send data back.                                                                                                                                                                     |
