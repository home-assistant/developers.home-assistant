---
title: "Extending the WebSocket API"
---

As a component, you might have information that you want to make available to the frontend. For example, the media player will want to make album covers available for the frontend to show. Our frontend is communicating with the backend over the websocket API, which can be extended with custom commands.

## Registering a command (Python)

To register a command, you need to have a message type, a message schema and a message handler. Your component does not have to add the websocket API as a dependency. You register your command, and if the user is using the websocket API, the command will be made available.

### Defining your command schema

A command schema is made up of a message type and what type of data we expect when the command is invoked. You define both the command type and the data schema via a decorator on your command handler. Message handlers are callback functions that are run inside the event loop.

```python
from homeassistant.components import websocket_api

@websocket_api.websocket_command(
    {
        vol.Required("type"): "frontend/get_panels",
        vol.Optional("preload_panels"): bool,
    }
)
@callback
def ws_get_panels(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Handle the websocket command."""
    panels = ...
    connection.send_result(msg["id"], {"panels": panels})
```

#### Doing I/O or sending a delayed response

If your command needs to interact with the network, a device or needs to compute information, you will need to queue a job to do the work and send the response. To do this, make your function async and decorate with `@websocket_api.async_response`.

```python
from homeassistant.components import websocket_api

@websocket_api.websocket_command(
    {
        vol.Required("type"): "camera/get_thumbnail",
        vol.Optional("entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_handle_thumbnail(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict
) -> None:
    """Handle get media player cover command."""
    # Retrieve media player using passed in entity id.
    player = hass.data[DOMAIN].get_entity(msg["entity_id"])

    # If the player does not exist, send an error message.
    if player is None:
        connection.send_error(
                msg["id"], "entity_not_found", "Entity not found"
            )
        )
        return

    data, content_type = await player.async_get_media_image()

    # No media player thumbnail available
    if data is None:
        connection.send_error(
            msg["id"], "thumbnail_fetch_failed", "Failed to fetch thumbnail"
        )
        return

    connection.send_result(
        msg["id"],
        {
            "content_type": content_type,
            "content": base64.b64encode(data).decode("utf-8"),
        },
    )
```

### Registering with the Websocket API

With all pieces defined, it's time to register the command. This is done inside your setup method.

```python
async def async_setup(hass, config):
    """Setup of your component."""
    hass.components.websocket_api.async_register_command(ws_get_panels)
    hass.components.websocket_api.async_register_command(ws_handle_thumbnail)
```

## Calling the command from the frontend (JavaScript)

With your command defined, it's time to call it from the frontend! This is done using JavaScript. You will need access to the `hass` object which holds the WebSocket connection to the backend. Then just call `hass.connection.sendMessagePromise`. This will return a promise that will resolve if the command succeeds and errors if the command fails.

```js
hass.connection.sendMessagePromise({
    type: 'media_player/thumbnail',
    entity_id: 'media_player.living_room_tv',
}).then(
    (resp) => {
        console.log('Message success!', resp.result);
    },
    (err) => {
        console.error('Message failed!', err);
    }
);
```

If your command is not sending a response, you can use `hass.connection.sendMessage`.
