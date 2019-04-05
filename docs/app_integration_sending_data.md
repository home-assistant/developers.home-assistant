---
title: "Sending data home"
---

Once you have registered your app with the mobile app component, you can start interacting with Home Assistant via the provided webhook information.

The first step is to turn the returned webhook ID into a full URL: `<instance_url>/api/webhook/<webhook_id>`. This will be the only url that we will need for all our interactions. The webhook endpoint will not require authenticated requests.

If you were provided a Cloudhook URL during registration, you should use that by default and only fall back to a constructed URL as described above if that request fails.

If you were provided a remote UI URL during registration, you should use that as the `instance_url` when constructing a URL and only fallback to the user provided URL if the remote UI URL fails.

## Short note on instance URLs

Some users have configured Home Assistant to be available outside of their home network using a dynamic DNS service. There are some routers that don't support hairpinning / NAT loopback: a device sending data from inside the routers network, via the externally configured DNS service, to Home Asisstant, which also resides inside the local network.

To work around this, the app will need to record which WiFi is the home network, and use a direct connection when connected to the home WiFi network.

## Interaction basics

All interaction will be done by making HTTP POST requests to the webhook url. These requests do not need to contain authentication.

The payload format depends on the type of interaction, but it all shares a common base:

```json5
{
  "type": "<type of message>",
  "data": {}
}
```

If you received a `secret` during registration, you will need to encrypt your message and wrap it in an encrypted message:

```json5
{
  "type": "encrypted",
  "encrypted": true,
  "encrypted_data": "<encrypted message>"
}
```

## Implementing encryption

`mobile_app` supports two way encrypted communication via [Sodium](https://libsodium.gitbook.io/doc/).

> Sodium is a modern, easy-to-use software library for encryption, decryption, signatures, password hashing and more.

### Choosing a library
Libraries that wrap Sodium exist for most modern programming languages and platforms. Sodium itself is written in C.

Here are the libraries we suggest using, although you should feel free to use whatever works well for you.

- Swift/Objective-C: [swift-sodium](https://github.com/jedisct1/swift-sodium) (official library maintained by Sodium developers.

For other languages, please see the list of [Bindings for other languages](https://download.libsodium.org/doc/bindings_for_other_languages). If more than one choice is available, we recommend using the choice most recently updated.

### Configuration

We use the [secret-key cryptography](https://download.libsodium.org/doc/secret-key_cryptography) features of Sodium to encrypt and decrypt payloads. All payloads are JSON encoded in Base64. For Base64 type, use `sodium_base64_VARIANT_ORIGINAL` (that is, "original", no padding, not URL safe).

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

| Key | Type | Description
| --- | ---- | -----------
| `location_name` | string | Name of the zone the device is in.
| `gps` | latlong | Current location as latitude and longitude.
| `gps_accuracy` | int | GPS accurracy in meters. Must be greater than 0.
| `battery` | int | Percentage of battery the device has left. Must be greater than 0.
| `speed` | int | Speed of the device in meters per second. Must be greater than 0.
| `altitude` | int | Altitude of the device in meters. Must be greater than 0.
| `course` | int | The direction in which the device is traveling, measured in degrees and relative to due north. Must be greater than 0.
| `vertical_accuracy` | int | The accuracy of the altitude value, measured in meters. Must be greater than 0.

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
	"data": {
		"event_type": "my_custom_event",
		"event_data": {
			"something": 50
		}
	}
}
```

| Key | Type | Description
| --- | ---- | -----------
| `event_type` | string | Type of the event to fire
| `event_data` | string | Date of the event to fire

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

| Key | Type | Description
| --- | ---- | -----------
| `template` | string | The template to render
| `variables` | Dict | The extra template variables to include.

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

| Key | Type | Description
| --- | --- | --
| `app_data` | Dict | App data can be used if the app has a supporting component that extends mobile_app functionality or wishes to enable the notification platform.
| `app_version` | string | Version of the mobile app.
| `device_name` | string | Name of the device running the app.
| `manufacturer` | string | The manufacturer of the device running the app.
| `model` | string | The model of the device running the app.
| `os_version` | string | The OS version of the device running the app.

## Get zones

Get all enabled zones.

```json
{
	"type": "get_zones"
}
```
