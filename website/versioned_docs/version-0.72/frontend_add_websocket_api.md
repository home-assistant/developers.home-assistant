---
title: Extending the WebSocket API
id: version-0.72-frontend_add_websocket_api
original_id: frontend_add_websocket_api
---

As a component you might have information that you want to make available to the frontend. For example, the media player will want to make album covers available for the frontend to show. Our frontend is communicating with the backend over the websocket API, which can be extended with custom commands.

## Registering a command (Python)

To register a command, you need to have a message type, a message schema and a message handler. Your component does not have to add the websocket API as a dependency. You register your command, and if the user is using the websocket API, the command will be made available.

### Message Types

Message types are made up the domain and the message type, separated by a forward slash. In the below example, we're defining `media_player/thumbnail`.

```python
# The type of the message
WS_TYPE_MEDIA_PLAYER_THUMBNAIL = 'media_player/thumbnail'
```

### Message Schema

The message schema defines what type of data we expect when the message is invoked. It is defined as a voluptuous schema and has to extend the base web socket command schema.

```python
import voluptuous as vol

from homeassistant.components import websocket_api
import homeassistant.helpers.config_validation as cv


# The schema for the message
SCHEMA_WEBSOCKET_GET_THUMBNAIL = \
    websocket_api.BASE_COMMAND_MESSAGE_SCHEMA.extend({
        'type': WS_TYPE_MEDIA_PLAYER_THUMBNAIL,
        # The entity that we want to retrieve the thumbnail for.
        'entity_id': cv.entity_id
    })
```

### Defining a handler

Message handlers are callback functions that are run inside the event loop. If you want to do I/O or have to wait for your result, create a new function and queue it up using `hass.async_add_job`. This is done so that the websocket API can get back to handling the next message as soon as possible.

#### Sending a direct response

If you are defining a command that is querying simple information, you might be able to fulfill the request while the handler is being called by the websocket API. To do this, use `connection.to_write.put_nowait`.

```python
@callback
def websocket_handle_thumbnail(hass, connection, msg):
    """Handle getting a thumbnail."""

    # We know the answer without having to fetch any information,
    # so we send it directly.
    connection.to_write.put_nowait(websocket_api.result_message(msg['id'], {
        'thumbnail': 'http://via.placeholder.com/350x150'
    }))
```

#### Sending a delayed response

If your command needs to interact with the network, a device or needs to compute information, you will need to queue a job to do the work and send the response. To do this, use `connection.send_message_outside`.

```python
@callback
def websocket_handle_thumbnail(hass, connection, msg):
    """Handle get media player cover command."""
    # Retrieve media player using passed in entity id.
    player = hass.data[DOMAIN].get_entity(msg['entity_id'])

    # If the player does not exist, send an error message.
    if player is None:
        connection.to_write.put_nowait(websocket_api.error_message(
            msg['id'], 'entity_not_found', 'Entity not found'))
        return

    # Define a function to be enqueued.
    async def send_image():
        """Send image."""
        data, content_type = await player.async_get_media_image()

        # No media player thumbnail available
        if data is None:
            connection.send_message_outside(websocket_api.error_message(
                msg['id'], 'thumbnail_fetch_failed',
                'Failed to fetch thumbnail'))
            return

        connection.send_message_outside(websocket_api.result_message(
            msg['id'], {
                'content_type': content_type,
                'content': base64.b64encode(data).decode('utf-8')
            }))

    # Player exist. Queue up a job to send the thumbnail.
    hass.async_add_job(send_image())
```

### Registering with the Websocket API

With all pieces defined, it's time to register the command. This is done inside your setup method.

```python
async def async_setup(hass, config):
    """Setup of your component."""
    hass.components.websocket_api.async_register_command(
        WS_TYPE_MEDIA_PLAYER_THUMBNAIL, websocket_handle_thumbnail,
        SCHEMA_WEBSOCKET_GET_THUMBNAIL)
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
