---
title: Sending data home
id: version-0.90.0-app_integration_sending_data
original_id: app_integration_sending_data
---

Once you have registered your app with the mobile app component, you can start interacting with Home Assistant via the provided webhook information.

The first step is to turn the returned webhook ID into a full URL: `<instance_url>/api/webhook/<webhook_id>`. This will be the only url that we will need for all our interactions. The webhook endpoint will not require authenticated requests.

## Short note on instance URLs

Some users have configured Home Assistant to be available outside of their home network using a dynamic DNS service. There are some routers that don't support hairpinning / NAT loopback: a device sending data from inside the routers network, via the externally configured DNS service, to Home Asisstant, which also resides inside the local network.

To work around this, the app will need to record which WiFi is the home network, and use a direct connection when connected to the home WiFi network.

## Interaction basics

All interaction will be done by making HTTP POST requests to the webhook url. These requests do not need to contain authentication.

The payload format depends on the type of interaction, but it all shares a common base:

```json5
{
  "type": "<type of message>",
  // other info
}
```

If you received a `secret` during registration, you will need to encrypt your message and wrap it in an encrypted message:

```json5
{
  "type": "encrypted",
  "data": "<encrypted message>"
}
```

## Update device location

This message will inform Home Assistant of new location information.

```json
{
  "type": "update_location",
  "gps": [12.34, 56.78],
  "gps_accuracy": 120,
  "battery": 45,
}
```

| Key | Type | Description
| --- | ---- | -----------
| `gps` | latlong | Current location as latitude and longitude.
| `gps_accuracy` | int | GPS accurracy in meters.
| `battery` | int | Percentage of battery the device has left.

## Call a service

Call a service in Home Assistant.

```json
{
  "type": "call_service",
  "domain": "light",
  "service": "turn_on",
  "service_data": {
    "entity_id": "light.kitchen"
  }
}
```

| Key | Type | Description
| --- | ---- | -----------
| `domain` | string | The domain of the service
| `service` | string | The service name
| `service_data` | dict | The data to send to the service

## Fire an event

Fire an event in Home Assistant.

```json
{
  "type": "fire_event",
  "event_type": "my_custom_event",
  "event_data": {
    "something": 50
  }
}
```

| Key | Type | Description
| --- | ---- | -----------
| `event_type` | string | Type of the event to fire
| `event_data` | string | Date of the event to fire

## Render templates

> This API is very likely to change in an upcoming release. Support to render multiple templates at once will be added.

Renders a template and returns the result.

```json
{
  "type": "render_template",
  "template": "Hello {{ name }}, you are {{ states('person.paulus') }}.",
  "variables": {
    "name": "Paulus"
  }
}
```

| Key | Type | Description
| --- | ---- | -----------
| `template` | string | The template to render
| `variables` | Dict | The extra template variables to include.

## Update registration

Update your app registration. Use this if the app version changed or any of the other values.

```json
{
  "type": "update_registration",
  "app_data": {
    "push_notification_key": "abcd"
  },
  "app_version": "2.0.0",
  "device_name": "Robbies iPhone",
  "manufacturer": "Apple, Inc.",
  "model": "iPhone XR",
  "os_version": "23.02",
}
```

All keys are optional.

| Key | Type | Description
| --- | --- | --
| `app_version` | string | Version of the mobile app.
| `device_name` | string | Name of the device running the app.
| `manufacturer` | string | The manufacturer of the device running the app.
| `model` | string | The model of the device running the app.
| `os_version` | string | The OS version of the device running the app.
| `app_data` | Dict | App data can be used if the app has a supporting component that extends mobile_app functionality.
