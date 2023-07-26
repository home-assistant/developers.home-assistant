---
title: Media Device Entity
sidebar_label: Media Device
---

:::info Incomplete
This entry is incomplete. Contribution welcome.
:::
A media device entity controls a media device, such as a player, recorder, preamp, signal processor, amplifier, TV, projector, sound matrix.  Derive a platform entity from [`homeassistant.components.media_player.MediaPlayerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/media_player/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| supported_features | int | int | Flag supported features.
| sound_mode | string | None | The current sound processing mode or filter preset of the media device
| sound_mode_list | list | None | Dynamic list of available sound modes (set by platform, empty means sound mode not supported)
| source | string | None | The currently selected input source for the media device.
| source_list | list | None | The list of possible input sources for the media device. (This list should contain human readable names, suitable for frontend display)
| media_image_url | string | None | URL that represents the current image.
| media_image_remotely_accessible | boolean | False | Return `True` if property `media_image_url` is accessible outside of the home network.
| device_class | string | `None` | Type of media device.
| group_members | list | `None` | A dynamic list of player entities which are currently grouped together for synchronous playback. If the platform has a concept of defining a group leader, the leader should be the first element in that list.
| output_list | list | None | The list of possible independent outputs for the media device e.g. a whole-house amp or matrix. (This list should contain human readable names, suitable for frontend display)
| display_mode | string | None | The current display mode or preset of the visual media device
| display_mode_list | list | None | Dynamic list of available display modes (set by platform, empty means sound mode not supported)



## Supported Features

Supported features are defined by using values in the `MediaPlayerEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value                | Description                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `BROWSE_MEDIA`       | Entity allows browsing media.                                                                               |
| `CLEAR_PLAYLIST`     | Entity allows clearing the active playlist.                                                                 |
| `GROUPING`           | Entity can be grouped with other players for synchronous playback.                                          |
| `MEDIA_ANNOUNCE`     | Entity supports the `play_media` service's announce parameter.                                              |
| `MEDIA_ENQUEUE`      | Entity supports the `play_media` service's enqueue parameter.                                               |
| `NEXT_TRACK`         | Entity allows skipping to the next media track.                                                             |
| `PAUSE`              | Entity allows pausing the playback of media.                                                                |
| `PLAY`               | Entity allows playing/resuming playback of media.                                                           |
| `PLAY_MEDIA`         | Entity allows playing media sources.                                                                        |
| `PREVIOUS_TRACK`     | Entity allows returning back to a previous media track.                                                     |
| `REPEAT_SET`         | Entity allows setting repeat.                                                                               |
| `SEEK`               | Entity allows seeking position during playback of media.                                                    |
| `SELECT_SOUND_MODE`  | Entity allows selecting a sound processing mode or filter preset.                                           |
| `SELECT_SOURCE`      | Entity allows selecting a source/input.                                                                     |
| `SHUFFLE_SET`        | Entity allows shuffling the active playlist.                                                                |
| `STOP`               | Entity allows stopping the playback of media.                                                               |
| `TURN_OFF`           | Entity is able to be turned off.                                                                            |
| `TURN_ON`            | Entity is able to be turned on.                                                                             |
| `VOLUME_MUTE`        | Entity volume can be muted.                                                                                 |
| `VOLUME_SET`         | Entity volume can be set to specific levels.                                                                |
| `VOLUME_STEP`        | Entity volume can be adjusted up and down.                                                                  |
| `DISPLAY_MEDIA`      | Entity supports visual display of the media e.g. by a TV or a projector or even a laser disco projector.    |
| `SELECT_DISPLAY_MODE` | Entity allows selecting a sound processing mode or filter preset.                                           |
| `RECORD_MEDIA`       | Entity allows media recording.                                                                              |
| `RECORD`             | Entity allows starting/resuming recording of media.                                                         |
| `NAME_MEDIA`         | Entity supports naming the media being recorded, e.g. a file name.                                          |
| `MEDIA_FORMAT_SET`   | Entity supports selecting the destination media/file format e.g. when recording or transcoding / upscaling. |
| `SOURCE_MEDIA`       | Entity provides source media distinct from the playback intent: preamp, tuner, camera, NAS.                 |
| `ROUTE_MEDIA`        | Entity provides routing sources to destinations e.g. in a multi-room receiver, or a sound or video matrix . |
| `ROUTE_SET`          | Entity allows connecting a specific media source to a destination output e.g. in a whole-house amp.         |
| `ROUTE_VOLUME_MUTE`  | Route volume can be muted.                                                                                  |
| `ROUTE_VOLUME_SET`   | Route volume can be set to specific levels.                                                                 |
| `ROUTE_VOLUME_STEP`  | Route volume can be adjusted up and down.                                                                   |

## States

The state of a media player is defined by using values in the `MediaPlayerState` enum, and can take the following possible values.

| Value       | Description                                                                                                         |
|-------------|---------------------------------------------------------------------------------------------------------------------|
| `OFF`       | Entity is turned off and is not accepting commands until turned on.                                                 |
| `ON`        | Entity is turned on, but no details on its state is currently known.                                                |
| `IDLE`      | Entity is turned on and accepting commands, but currently not playing any media. Possibly at some idle home screen. |
| `PLAYING`   | Entity is currently playing media.                                                                                  |
| `PAUSED`    | Entity has an active media and is currently paused                                                                  |
| `STANDBY`   | Entity is in a low power state, accepting commands.                                                                 |
| `BUFFERING` | Entity is preparing to start playback of some media.                                                                |
| `ACTIVE`    | Entity (preamp, tuner, camera, NAS, signal processor, projector, matrix, amp, etc.) is tramsmitting / transcoding media. |
| `RECORDING` | Entity is currently recording media.                                                                                |
| `ERROR`     | Entity is experiencing a malfunction (out of space, lost signal, overheat, etc.)                                    |


## Methods

### Play Media

Tells the media player to play media. Implement it using the following:

```python
class MyMediaPlayer(MediaPlayerEntity):

    def play_media(
        self,
        media_type: str,
        media_id: str,
        enqueue: MediaPlayerEnqueue | None = None,
        announce: bool | None = None, **kwargs: Any
    ) -> None:
        """Play a piece of media."""

    async def async_play_media(
        self,
        media_type: str,
        media_id: str,
        enqueue: MediaPlayerEnqueue | None = None,
        announce: bool | None = None, **kwargs: Any
    ) -> None:
        """Play a piece of media."""

```

The `enqueue` attribute is a string enum `MediaPlayerEnqueue`:

 - `add`: add given media item to end of the queue
 - `next`: play the given media item next, keep queue
 - `play`: play the given media item now, keep queue
 - `replace`: play the given media item now, clear queue

When the `announce` boolean attribute is set to `true`, the media player should try to pause the current music, announce the media to the user and then resume the music.

### Browse Media

If the media player supports browsing media, it should implement the following method:

```python
class MyMediaPlayer(MediaPlayerEntity):

    async def async_browse_media(
        self, media_content_type: str | None = None, media_content_id: str | None = None
    ) -> BrowseMedia:
        """Implement the websocket media browsing helper."""
        return await media_source.async_browse_media(
            self.hass,
            media_content_id,
            content_filter=lambda item: item.media_content_type.startswith("audio/"),
        )
```

If the media player also allows playing media from URLs, you can also add support for browsing
Home Assistant media sources. These sources can be provided by any integration. Examples provide
text-to-speech and local media.

```python
from homeassistant.components import media_source
from homeassistant.components.media_player.browse_media import (
    async_process_play_media_url,
)

class MyMediaPlayer(MediaPlayerEntity):

    async def async_browse_media(
        self, media_content_type: str | None = None, media_content_id: str | None = None
    ) -> BrowseMedia:
        """Implement the websocket media browsing helper."""
        # If your media player has no own media sources to browse, route all browse commands
        # to the media source integration.
        return await media_source.async_browse_media(
            self.hass,
            media_content_id,
            # This allows filtering content. In this case it will only show audio sources.
            content_filter=lambda item: item.media_content_type.startswith("audio/"),
        )

    async def async_play_media(
        self,
        media_type: str,
        media_id: str,
        enqueue: MediaPlayerEnqueue | None = None,
        announce: bool | None = None, **kwargs: Any
    ) -> None:
        """Play a piece of media."""
        if media_source.is_media_source_id(media_id):
            media_type = MediaType.MUSIC
            play_item = await media_source.async_resolve_media(self.hass, media_id, self.entity_id)
            # play_item returns a relative URL if it has to be resolved on the Home Assistant host
            # This call will turn it into a full URL
            media_id = async_process_play_media_url(self.hass, play_item.url)

        # Replace this with calling your media player play media function.
        await self._media_player.play_url(media_id)
```

### Select sound mode

Optional. Switch the sound mode of the media player.

```python
class MyMediaPlayer(MediaPlayerEntity):
    # Implement one of these methods.

    def select_sound_mode(self, sound_mode):
        """Switch the sound mode of the entity."""

    def async_select_sound_mode(self, sound_mode):
        """Switch the sound mode of the entity."""
```

### Select source

Optional. Switch the selected input source for the media player.

```python
class MyMediaPlayer(MediaPlayerEntity):
    # Implement one of these methods.

    def select_source(self, source):
        """Select input source."""

    def async_select_source(self, source):
        """Select input source."""
```

### Mediatype

Required. Returns one of the values from the MediaType enum that matches the mediatype

| CONST |
|-------|
|MediaType.MUSIC|
|MediaType.TVSHOW|
|MediaType.MOVIE|
|MediaType.VIDEO|
|MediaType.EPISODE|
|MediaType.CHANNEL|
|MediaType.PLAYLIST|
|MediaType.IMAGE|
|MediaType.URL|
|MediaType.GAME|
|MediaType.APP|
|MediaType.LIVEAUDIO|
|MediaType.LIVEVIDEO|


```python
class MyMediaPlayer(MediaPlayerEntity):
    # Implement the following method.

    @property
    def media_content_type(self):
    """Content type of current playing media."""
```

:::info
Using the integration name as the `media_content_type` is also acceptable within the `play_media` service if the integration provides handling which does not map to the defined constants.
:::

### Available device classes

Optional. What type of media device is this. It will possibly map to google device types.

| Value | Description
| ----- | -----------
| display | Device is a television or projector type device.
| speaker | Device is speakers or stereo type device.
| receiver | Device is audio video receiver type device taking audio and outputting to speakers and video to some display.
| matrix | Device is a multi-input, multi-independent-output type device, such as a multi-room receiver, a whole-house audio amp, a sound matrix, a video matrix.
| live_source | Device is a mic or instrument preamp, an AM or FM or OTA TV tuner, a capture card, or any other source of a live signal.
| recorder | Device is a recorder.

### Proxy album art for media browser

Optional. If your media player is only accessible from the internal network, it will need to proxy the album art via Home Assistant to be able to work while away from home or through a mobile app.

To proxy an image via Home Assistant, set the `thumbnail` property of a `BrowseMedia` item to a url generated by the `self.get_browse_image_url(media_content_type, media_content_id, media_image_id=None)` method. The browser will then fetch this url, which will result in a call to `async_get_browse_image(media_content_type, media_content_id, media_image_id=None)`.

:::info
Only use a proxy for the thumbnail if the web request originated from outside the network. You can test this with `is_local_request(hass)` imported from `homeassistant.helpers.network`.
:::

In `async_get_browse_image`, use `self._async_fetch_image(url)` to fetch the image from the local network. Do not use `self._async_fetch_image_from_cache(url)` which should only be used to for the currently playing artwork.

:::info
Do not pass an url as `media_image_id`. This can allow an attacker to fetch any data from the local network.
:::

```python
class MyMediaPlayer(MediaPlayerEntity):

    # Implement the following method.
    async def async_get_browse_image(self, media_content_type, media_content_id, media_image_id=None):
    """Serve album art. Returns (content, content_type)."""
    image_url = ...
    return await self._async_fetch_image(image_url)
```

### Grouping player entities together

Optional. If your player has support for grouping player entities together for synchronous playback (indicated by `SUPPORT_GROUPING`) one join and one unjoin method needs to be defined.

```python
class MyMediaPlayer(MediaPlayerEntity):
    # Implement one of these join methods:

    def join_players(self, group_members):
        """Join `group_members` as a player group with the current player."""

    async def async_join_players(self, group_members):
        """Join `group_members` as a player group with the current player."""

    # Implement one of these unjoin methods:

    def unjoin_player(self):
        """Remove this player from any group."""

    async def async_unjoin_player(self):
        """Remove this player from any group."""
```
