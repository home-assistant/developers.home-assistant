---
title: Connecting to an instance
id: version-0.83.0-app_integration_setup
original_id: app_integration_setup
---

When a user first opens the app, they will need to connect to their local instance to authenticate and register the device.

## Authenticating the user

The local instance can be discovered if Home Assistant has the [zeroconf component] configured. If not configured, the user will need to be asked for the local address of their instance.

When the address of the instance is known, the app will ask the user to authenticate via [OAuth2 with Home Assistant]. Home Assistant uses IndieAuth, which means that to be able to redirect to a url that triggers your app, you need to take some extra steps. Make sure to read the last paragraph of the "Clients" section thoroughly.

## Registering the device

Once you have tokens to authenticate as a user, it's time to register the app with the app component in Home Assistant. Each native app will need to build their own support layer for their app. The setup of your component will need to use a config flow so that it is configurable via the user interface and can access advanced Home Assistant features like the device registry.

Let's take as an example that we're building an iOS application and that it is supported by the `ios` component in Home Assistant. If the component is loaded, it will register a new API endpoint on `/api/ios/register` (requiring authentication). The app can post to this endpoint to register the users' device with Home Assistant. Example payload:

```json
{
  "device_type": "iPhone 6",
  "firmware": "zxcx"
}
```

The endpoint will register the device with Home Assistant:

 - Generate a unique webhook endpoint that the app can use to send data back to Home Assistant.
 - Use the storage helper to store data.
 - Register the iOS device with the [device registry](device_registry_index).
 - Make the device available as a notification target.

> The following section is not implemented yet.

If the app receives a 404 HTTP status code when trying to register the device, it means the `ios` component is not loaded. In this case, the app can load the `ios` component by posting to `/api/config_entry_discovery`. This will trigger the `http_discovery` step of the config flow for the `ios` component and it will be loaded. The app can now retry the device registration.

[zeroconf component]: https://www.home-assistant.io/components/zeroconf
[OAuth2 with Home Assistant]: auth_api
