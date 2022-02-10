---
title: "REST API"
---
import ApiEndpoint from '@site/static/js/api_endpoint.jsx'

Home Assistant provides a RESTful API on the same port as the web frontend. (default port is port 8123).

If you are not using the [`frontend`](https://www.home-assistant.io/components/frontend/) in your setup then you need to add the [`api` component](https://www.home-assistant.io/components/api/) to your `configuration.yaml` file.

- `http://IP_ADDRESS:8123/` is an interface to control Home Assistant.
- `http://IP_ADDRESS:8123/api/` is a RESTful API.

The API accepts and returns only JSON encoded objects.

All API calls have to be accompanied by the header `Authorization: Bearer ABCDEFGH`, where `ABCDEFGH` is replaced by your token. You can obtain a token ("Long-Lived Access Token") by logging into the frontend using a web browser, and going to [your profile](https://www.home-assistant.io/docs/authentication/#your-account-profile) `http://IP_ADDRESS:8123/profile`.

There are multiple ways to consume the Home Assistant Rest API. One is with `curl`:

```shell
curl -X GET \
  -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://IP_ADDRESS:8123/ENDPOINT
```

Another option is to use Python and the [Requests](https://requests.readthedocs.io/en/master/) module.

```python
from requests import get

url = "http://localhost:8123/ENDPOINT"
headers = {
    "Authorization": "Bearer ABCDEFGH",
    "content-type": "application/json",
}

response = get(url, headers=headers)
print(response.text)
```

Another option is to use the [Restful Command integration](https://www.home-assistant.io/components/rest_command/) in a Home Assistant automation or script.

```yaml
turn_light_on:
  url: http://localhost:8123/api/states/light.study_light
  method: POST
  headers:
    authorization: 'Bearer ABCDEFGH'
    content-type: 'application/json'
  payload: '{"state":"on"}'
```

Successful calls will return status code 200 or 201. Other status codes that can return are:

- 400 (Bad Request)
- 401 (Unauthorized)
- 404 (Not Found)
- 405 (Method not allowed)

### Actions

The API supports the following actions:

<ApiEndpoint path="/api/" method="get">

Returns a message if the API is up and running.

```json
{
  "message": "API running."
}
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" http://localhost:8123/api/
```

</ApiEndpoint>

<ApiEndpoint path="/api/config" method="get">

Returns the current configuration as JSON.

```json
{
   "components":[
      "sensor.cpuspeed",
      "frontend",
      "config.core",
      "http",
      "map",
      "api",
      "sun",
      "config",
      "discovery",
      "conversation",
      "recorder",
      "group",
      "sensor",
      "websocket_api",
      "automation",
      "config.automation",
      "config.customize"
   ],
   "config_dir":"/home/ha/.homeassistant",
   "elevation":510,
   "latitude":45.8781529,
   "location_name":"Home",
   "longitude":8.458853651,
   "time_zone":"Europe/Zurich",
   "unit_system":{
      "length":"km",
      "mass":"g",
      "temperature":"\u00b0C",
      "volume":"L"
   },
   "version":"0.56.2",
   "whitelist_external_dirs":[
      "/home/ha/.homeassistant/www",
      "/home/ha/.homeassistant/"
   ]
}
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" http://localhost:8123/api/config
```

</ApiEndpoint>

<ApiEndpoint path="/api/events" method="get">

Returns an array of event objects. Each event object contains event name and listener count.

```json
[
    {
      "event": "state_changed",
      "listener_count": 5
    },
    {
      "event": "time_changed",
      "listener_count": 2
    }
]
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" http://localhost:8123/api/events
```

</ApiEndpoint>

<ApiEndpoint path="/api/services" method="get">

Returns an array of service objects. Each object contains the domain and which services it contains.

```json
[
    {
      "domain": "browser",
      "services": [
        "browse_url"
      ]
    },
    {
      "domain": "keyboard",
      "services": [
        "volume_up",
        "volume_down"
      ]
    }
]
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" http://localhost:8123/api/services
```

</ApiEndpoint>

<ApiEndpoint path="/api/history/period/<timestamp>" method="get">

Returns an array of state changes in the past. Each object contains further details for the entities.

The `<timestamp>` (`YYYY-MM-DDThh:mm:ssTZD`) is optional and defaults to 1 day before the time of the request. It determines the beginning of the period.

You can pass the following optional GET parameters:

- `filter_entity_id=<entity_ids>` to filter on one or more entities - comma separated.
- `end_time=<timestamp>` to choose the end of the period in URL encoded format (defaults to 1 day).
- `minimal_response` to only return `last_changed` and `state` for states other than the first and last state (much faster).
- `significant_changes_only` to only return significant state changes.

Example without `minimal_response`

```json
[
    [
        {
            "attributes": {
                "friendly_name": "Weather Temperature",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:15:00+00:00",
            "last_updated": "2016-02-06T22:15:00+00:00",
            "state": "-3.9"
        },
        {
            "attributes": {
                "friendly_name": "Weather Temperature",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:15:00+00:00",
            "last_updated": "2016-02-06T22:15:00+00:00",
            "state": "-1.9"
        },
    ]
]
```

Example with `minimal_response`

```json
[
    [
        {
            "attributes": {
                "friendly_name": "Weather Temperature",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:15:00+00:00",
            "last_updated": "2016-02-06T22:15:00+00:00",
            "state": "-3.9"
        },
        {
            "last_changed": "2016-02-06T22:20:00+00:00",
            "state": "-2.9"
        },
        {
            "last_changed": "2016-02-06T22:22:00+00:00",
            "state": "-2.2"
        },
        {
            "attributes": {
                "friendly_name": "Weather Temperature",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:25:00+00:00",
            "last_updated": "2016-02-06T22:25:00+00:00",
            "state": "-1.9"
        },
    ]
]
```

Sample `curl` commands:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/history/period/2016-12-29T00:00:00+02:00
```

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/history/period/2016-12-29T00:00:00+02:00?minimal_response
```

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/history/period/2016-12-29T00:00:00+02:00?filter_entity_id=sensor.temperature
```

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/history/period/2016-12-29T00:00:00+02:00?end_time=2016-12-31T00%3A00%3A00%2B02%3A00
```

</ApiEndpoint>

<ApiEndpoint path="/api/logbook/<timestamp>" method="get">

Returns an array of logbook entries.

The `<timestamp>` (`YYYY-MM-DDThh:mm:ssTZD`) is optional and defaults to 1 day before the time of the request. It determines the beginning of the period.

You can pass the following optional GET parameters:

- `entity=<entity_id>` to filter on one entity.
- `end_time=<timestamp>` to choose the end of period starting from the `<timestamp>` in URL encoded format.

Example
```json
[
  {
		"context_user_id": null,
		"domain": "alarm_control_panel",
		"entity_id": "alarm_control_panel.area_001",
		"message": "changed to disarmed",
		"name": "Security",
		"when": "2020-06-20T16:44:26.127295+00:00"
	},
	{
		"context_user_id": null,
		"domain": "homekit",
		"entity_id": "alarm_control_panel.area_001",
		"message": "send command alarm_arm_night for Security",
		"name": "HomeKit",
		"when": "2020-06-21T02:59:05.759645+00:00"
	},
	{
		"context_user_id": null,
		"domain": "alarm_control_panel",
		"entity_id": "alarm_control_panel.area_001",
		"message": "changed to armed_night",
		"name": "Security",
		"when": "2020-06-21T02:59:06.015463+00:00"
	}
]
```

Sample `curl` commands:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/logbook/2016-12-29T00:00:00+02:00
```

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  'http://localhost:8123/api/logbook/2016-12-29T00:00:00+02:00?end_time=2099-12-31T00%3A00%3A00%2B02%3A00&entity=sensor.temperature'
```

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/logbook/2016-12-29T00:00:00+02:00?end_time=2099-12-31T00%3A00%3A00%2B02%3A00
```

</ApiEndpoint>

<ApiEndpoint path="/api/states" method="get">

Returns an array of state objects. Each state has the following attributes: entity_id, state, last_changed and attributes.

```json
[
    {
        "attributes": {},
        "entity_id": "sun.sun",
        "last_changed": "2016-05-30T21:43:32.418320+00:00",
        "state": "below_horizon"
    },
    {
        "attributes": {},
        "entity_id": "process.Dropbox",
        "last_changed": "22016-05-30T21:43:32.418320+00:00",
        "state": "on"
    }
]
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" http://localhost:8123/api/states
```

</ApiEndpoint>

<ApiEndpoint path="/api/states/<entity_id>" method="get">

Returns a state object for specified entity_id. Returns 404 if not found.

```json
{
   "attributes":{
      "azimuth":336.34,
      "elevation":-17.67,
      "friendly_name":"Sun",
      "next_rising":"2016-05-31T03:39:14+00:00",
      "next_setting":"2016-05-31T19:16:42+00:00"
   },
   "entity_id":"sun.sun",
   "last_changed":"2016-05-30T21:43:29.204838+00:00",
   "last_updated":"2016-05-30T21:50:30.529465+00:00",
   "state":"below_horizon"
}
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/states/sensor.kitchen_temperature
```

</ApiEndpoint>

<ApiEndpoint path="/api/error_log" method="get">

Retrieve all errors logged during the current session of Home Assistant as a plaintext response.

```text
15-12-20 11:02:50 homeassistant.components.recorder: Found unfinished sessions
15-12-20 11:03:03 netdisco.ssdp: Error fetching description at http://192.168.1.1:8200/rootDesc.xml
15-12-20 11:04:36 homeassistant.components.alexa: Received unknown intent HelpIntent
```

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/error_log
```

</ApiEndpoint>

<ApiEndpoint path="/api/camera_proxy/<camera entity_id>" method="get">

Returns the data (image) from the specified camera entity_id.

Sample `curl` command:

```shell
curl -X GET -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/camera_proxy/camera.my_sample_camera?time=1462653861261 -o image.jpg
```

</ApiEndpoint>

<ApiEndpoint path="/api/states/<entity_id>" method="post">

Updates or creates a state. You can create any state that you want, it does not have to be backed by an entity in Home Assistant.

:::info
This endpoint sets the representation of a device within Home Assistant and will not communicate with the actual device. To communicate with the device, use the [POST /api/services/&lt;domain>/&lt;service>](#post-apiservicesltdomainltservice) endpoint.
:::

Expects a JSON object that has at least a state attribute:

```json
{
    "state": "below_horizon",
    "attributes": {
        "next_rising":"2016-05-31T03:39:14+00:00",
        "next_setting":"2016-05-31T19:16:42+00:00"
    }
}
```

The return code is 200 if the entity existed, 201 if the state of a new entity was set. A location header will be returned with the URL of the new resource. The response body will contain a JSON encoded State object.

```json
{
    "attributes": {
        "next_rising":"2016-05-31T03:39:14+00:00",
        "next_setting":"2016-05-31T19:16:42+00:00"
    },
    "entity_id": "sun.sun",
    "last_changed": "2016-05-30T21:43:29.204838+00:00",
    "last_updated": "2016-05-30T21:47:30.533530+00:00",
    "state": "below_horizon"
}
```

Sample `curl` command:

```shell
curl -X POST -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  -d '{"state": "25", "attributes": {"unit_of_measurement": "°C"}}' \
  http://localhost:8123/api/states/sensor.kitchen_temperature
```

</ApiEndpoint>

<ApiEndpoint path="/api/events/<event_type>" method="post">

Fires an event with event_type. Please be mindful of the data structure as documented on our [Data Science portal](https://data.home-assistant.io/docs/events/#database-table).

You can pass an optional JSON object to be used as `event_data`.

```json
{
    "next_rising":"2016-05-31T03:39:14+00:00",
}
```

Returns a message if successful.

```json
{
    "message": "Event download_file fired."
}
```

</ApiEndpoint>

<ApiEndpoint path="/api/services/<domain>/<service>" method="post">

Calls a service within a specific domain. Will return when the service has been executed or after 10 seconds, whichever comes first.

You can pass an optional JSON object to be used as `service_data`.

```json
{
    "entity_id": "light.Ceiling"
}
```

Returns a list of states that have changed while the service was being executed.

```json
[
    {
        "attributes": {},
        "entity_id": "sun.sun",
        "last_changed": "2016-05-30T21:43:32.418320+00:00",
        "state": "below_horizon"
    },
    {
        "attributes": {},
        "entity_id": "process.Dropbox",
        "last_changed": "22016-05-30T21:43:32.418320+00:00",
        "state": "on"
    }
]
```

Sample `curl` commands:

Turn the light on:

```shell
curl -X POST -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  -d '{"entity_id": "switch.christmas_lights"}' \
  http://localhost:8123/api/services/switch/turn_on
```

Sample `python` command using the [Requests](https://requests.readthedocs.io/en/master/) module:

Turn the light on:

```shell
from requests import post

url = "http://localhost:8123/api/services/light/turn_on"
headers = {"Authorization": "Bearer ABCDEFGH"}
data = {"entity_id": "light.study_light"}

response = post(url, headers=headers, json=data)
print(response.text)
```

Send a MQTT message:

```shell
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-ha-access:YOUR_PASSWORD" \
  -d '{"payload": "OFF", "topic": "home/fridge", "retain": "True"}' \
  http://localhost:8123/api/services/mqtt/publish
```

:::tip
The result will include any states that changed while the service was being executed, even if their change was the result of something else happening in the system.
:::

</ApiEndpoint>

<ApiEndpoint path="/api/template" method="post">

Render a Home Assistant template. [See template docs for more information.](https://www.home-assistant.io/topics/templating/)

```json
{
    "template": "Paulus is at {{ states('device_tracker.paulus') }}!"
}
```

Returns the rendered template in plain text.

```text
Paulus is at work!
```

Sample `curl` command:

```shell
curl -X POST -H "Authorization: Bearer ABCDEFGH" \
  -H "Content-Type: application/json" \
  -d '{"template": "It is {{ now() }}!"}' http://localhost:8123/api/template
```

</ApiEndpoint>

<ApiEndpoint path="/api/config/core/check_config" method="post">

Trigger a check of `configuration.yaml`. No additional data needs to be passed in with this request. Needs config integration enabled.

If the check is successful, the following will be returned:

```json
{
    "errors": null,
    "result": "valid"
}
```

If the check fails, the errors attribute in the object will list what caused the check to fail. For example:

```json
{
    "errors": "Integration not found: frontend:",
    "result": "invalid"
}
```

</ApiEndpoint>

<ApiEndpoint path="/api/intent/handling" method="post">

Handle an intent.

Sample `curl` command:
	
```shell
curl -X POST -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{ "name": "SetTimer", "data": { "seconds": "30" } }' \
  http://localhost:8123/api/intent/handle
```

</ApiEndpoint>
