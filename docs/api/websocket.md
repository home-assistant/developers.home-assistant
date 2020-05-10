---
title: "WebSocket API"
---

Home Assistant contains a WebSocket API. This API can be used to stream information from a Home Assistant instance to any client that implements WebSockets. Implementations in different languages:

- [JavaScript](https://github.com/home-assistant/home-assistant-js-websocket) - powers the frontend
- [Python](https://raw.githubusercontent.com/home-assistant/home-assistant-dev-helper/master/ha-websocket-client.py) - CLI client using [`asyncws`](https://async-websockets.readthedocs.io/en/latest/)
- [JavaScript/HTML](https://raw.githubusercontent.com/home-assistant/home-assistant-dev-helper/master/ha-websocket.html) - WebSocket connection in your browser

Connect your websocket implementation to `ws://localhost:8123/api/websocket`. You will need a valid access token.

If you are not using the [`frontend`](https://www.home-assistant.io/components/frontend/) in your setup then you need to add the [`websocket_api` component](https://www.home-assistant.io/components/websocket_api/) to your `configuration.yaml` file to use the WebSocket API.

## Server states

1. Client connects.
1. Authentication phase starts.
    - Server sends `auth_required` message.
    - Client sends `auth` message.
    - If `auth` message correct: go to 3.
    - Server sends `auth_invalid`. Go to 6.
1. Send `auth_ok` message
1. Authentication phase ends.
1. Command phase starts.
    1. Client can send commands.
    1. Server can send results of previous commands.
1. Client or server disconnects session.

During the command phase, the client attaches a unique identifier to each message. The server will add this identifier to each message so that the client can link each message to its origin.

## Message format

Each API message is a JSON serialized object containing a `type` key. After the authentication phase messages also must contain an `id`, an integer that contains the number of interactions.

Example of an auth message:

```json
{
  "type": "auth",
  "access_token": "ABCDEFGHIJKLMNOPQ"
}
```

```json
{
   "id": 5,
   "type":"event",
   "event":{
      "data":{},
      "event_type":"test_event",
      "time_fired":"2016-11-26T01:37:24.265429+00:00",
      "origin":"LOCAL"
   }
}
```

## Authentication phase

When a client connects to the server, the server will test if the client is authenticated. Authentication will not be necessary if no api_password is set or if the user fulfills one of the other criteria for authentication (trusted network, password in url/header).

If no authentication is needed, the authentication phase will complete and the server will send an `auth_ok` message.

```json
{
  "type": "auth_ok"
}
```

If authentication is necessary, the server sends out `auth_required`.

```json
{
  "type": "auth_required"
}
```

This means that the next message from the client should be an auth message. You can authorize with an access token.

```json
{
  "type": "auth",
  "access_token": "ABCDEFGH"
}
```

For now, we also support authentication with an API password (legacy auth).

```json
{
  "type": "auth",
  "api_password": "supersecret"
}
```

If the client supplies valid authentication, the authentication phase will complete by the server sending the `auth_ok` message:

```json
{
  "type": "auth_ok"
}
```

If the data is incorrect, the server will reply with `auth_invalid` message and disconnect the session.

```json
{
  "type": "auth_invalid",
  "message": "Invalid password"
}
```

## Command phase

During this phase the client can give commands to the server. The server will respond to each command with a `result` message indicating when the command is done and if it was successful.

```json
{
  "id": 6,
  "type": "result",
  "success": true,
  // Can contain extra result info
  "result": null
}
```

## Subscribe to events

The command `subscribe_events` will subscribe your client to the event bus. You can either listen to all events or to a specific event type. If you want to listen to multiple event types, you will have to send multiple `subscribe_events` commands.

```json
{
  "id": 18,
  "type": "subscribe_events",
  // Optional
  "event_type": "state_changed"
}
```

The server will respond with a result message to indicate that the subscription is active.

```json
{
  "id": 18,
  "type": "result",
  "success": true,
  "result": null
}
```

For each event that matches, the server will send a message of type `event`. The `id` in the message will point at the original `id` of the `listen_event` command.

```json
{
   "id": 18,
   "type":"event",
   "event":{
      "data":{
         "entity_id":"light.bed_light",
         "new_state":{
            "entity_id":"light.bed_light",
            "last_changed":"2016-11-26T01:37:24.265390+00:00",
            "state":"on",
            "attributes":{
               "rgb_color":[
                  254,
                  208,
                  0
               ],
               "color_temp":380,
               "supported_features":147,
               "xy_color":[
                  0.5,
                  0.5
               ],
               "brightness":180,
               "white_value":200,
               "friendly_name":"Bed Light"
            },
            "last_updated":"2016-11-26T01:37:24.265390+00:00"
         },
         "old_state":{
            "entity_id":"light.bed_light",
            "last_changed":"2016-11-26T01:37:10.466994+00:00",
            "state":"off",
            "attributes":{
               "supported_features":147,
               "friendly_name":"Bed Light"
            },
            "last_updated":"2016-11-26T01:37:10.466994+00:00"
         }
      },
      "event_type":"state_changed",
      "time_fired":"2016-11-26T01:37:24.265429+00:00",
      "origin":"LOCAL"
   }
}
```

### Unsubscribing from events

You can unsubscribe from previously created subscription events. Pass the id of the original subscription command as value to the subscription field.

```json
{
  "id": 19,
  "type": "unsubscribe_events",
  "subscription": 18
}
```

The server will respond with a result message to indicate that unsubscribing was successful.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": null
}
```

## Calling a service

This will call a service in Home Assistant. Right now there is no return value. The client can listen to `state_changed` events if it is interested in changed entities as a result of a service call.

```json
{
  "id": 24,
  "type": "call_service",
  "domain": "light",
  "service": "turn_on",
  // Optional
  "service_data": {
    "entity_id": "light.kitchen"
  }
}
```

The server will indicate with a message indicating that the service is done executing.

```json
{
  "id": 24,
  "type": "result",
  "success": true,
  "result": null
}
```

## Fetching states

This will get a dump of all the current states in Home Assistant.

```json
{
  "id": 19,
  "type": "get_states"
}
```

The server will respond with a result message containing the states.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": [ ... ]
}
```

## Fetching config

This will get a dump of the current config in Home Assistant.

```json
{
  "id": 19,
  "type": "get_config"
}
```

The server will respond with a result message containing the config.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": { ... }
}
```

## Fetching services

This will get a dump of the current services in Home Assistant.

```json
{
  "id": 19,
  "type": "get_services"
}
```

The server will respond with a result message containing the services.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": { ... }
}
```

## Fetching panels

This will get a dump of the current registered panels in Home Assistant.

```json
{
  "id": 19,
  "type": "get_panels"
}
```

The server will respond with a result message containing the current registered panels.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": [ ... ]
}
```

## Fetching camera thumbnails

_Introduced in Home Assistant 0.69._

Return a b64 encoded thumbnail of a camera entity.

```json
{
  "id": 19,
  "type": "camera_thumbnail",
  "entity_id": "camera.driveway"
}
```

The server will respond with a result message containing the thumbnail.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": {
    "content_type": "image/jpeg",
    "content": "<base64 encoded image>"
  }
}
```

## Fetching media player thumbnails

_Introduced in Home Assistant 0.69._

Fetch a base64 encoded thumbnail picture for a media player.

```json
{
  "id": 19,
  "type": "media_player_thumbnail",
  "entity_id": "media_player.living_room"
}
```

The server will respond with the image encoded via base64.

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": {
    "content_type": "image/jpeg",
    "content": "<base64 encoded image>"
  }
}
```

## Pings and Pongs

The API supports receiving a ping from the client and returning a pong. This serves as a heartbeat to ensure the connection is still alive:

```json
{
    "id": 19,
    "type": "ping"
}
```

The server must send a pong back as quickly as possible, if the connection is still active:

```json
{
    "id": 19,
    "type": "pong"
}
```

## Error handling

If an error occurs, the `success` key in the `result` message will be set to `false`. It will contain an `error` key containing an object with two keys: `code` and `message`.

| Code | Description |
| ----- | ------------ |
| 1 | A non-increasing identifier has been supplied.
| 2 | Received message is not in expected format (voluptuous validation error).
| 3 | Requested item cannot be found

```json
{
   "id": 12,
   "type":"result",
   "success": false,
   "error": {
      "code": 2,
      "message": "Message incorrectly formatted: expected str for dictionary value @ data['event_type']. Got 100"
   }
}
```
