---
title: Media Player Entity
sidebar_label: Media Player
---

:::info Incomplete
This entry is incomplete. Contribution welcome.
:::
A media player entity controls a media player.  Derive a platform entity from [`homeassistant.components.media_player.MediaPlayerEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/media_player/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| supported_features | int | int | Flag supported features.
| sound_mode | string | None | The current sound mode of the media player
| sound_mode_list | list | None | Dynamic list of available sound modes (set by platform, empty means sound mode not supported)
| source | string | None | The currently selected input source for the media player.
| source_list | list | None | The list of possible input sources for the media player. (This list should contain human readable names, suitable for frontend display)
| media_image_url | string | None | URL that represents the current image.
| media_image_remotely_accessible | boolean | False | Return `True` if property `media_image_url` is accessible outside of the home network.
| device_class | string | `None` | Type of media player.

## Supported Features

| Constant | Description
| -------- | -----------
| `SUPPORT_CLEAR_PLAYLIST` | Entity allows clearing the active playlist.
| `SUPPORT_NEXT_TRACK` | Entity allows skipping to the next media track.
| `SUPPORT_PAUSE` | Entity allows pausing the playback of media.
| `SUPPORT_PLAY` | Entity allows playing/resuming playback of media.
| `SUPPORT_PLAY_MEDIA` | Entity allows playing media sources.
| `SUPPORT_PREVIOUS_TRACK` | Entity allows returning back to a previous media track.
| `SUPPORT_SEEK` | Entity allows seeking position during playback of media.
| `SUPPORT_SELECT_SOURCE` | Entity allows selecting a source/input.
| `SUPPORT_SELECT_SOUND_MODE` | Entity allows selecting a sound mode.
| `SUPPORT_SHUFFLE_SET` | Entity allows shuffling the active playlist.
| `SUPPORT_STOP` | Entity allows stopping the playback of media.
| `SUPPORT_TURN_OFF` | Entity is able to be turned off.
| `SUPPORT_TURN_ON` | Entity is able to be turned on.
| `SUPPORT_VOLUME_MUTE` | Entity volume can be muted.
| `SUPPORT_VOLUME_SET` | Entity volume can be set to specific levels.
| `SUPPORT_VOLUME_STEP` | Entity volume can be adjusted up and down.

## Methods

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

Required. Returns one of the defined constants from the below list that matches the mediatype

| CONST |
|-------|
|MEDIA_TYPE_MUSIC|
|MEDIA_TYPE_TVSHOW|
|MEDIA_TYPE_MOVIE|
|MEDIA_TYPE_VIDEO|
|MEDIA_TYPE_EPISODE|
|MEDIA_TYPE_CHANNEL|
|MEDIA_TYPE_PLAYLIST|
|MEDIA_TYPE_IMAGE|
|MEDIA_TYPE_URL|
|MEDIA_TYPE_GAME|
|MEDIA_TYPE_APP|

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
| tv | Device is a television type device.
| speaker | Device is speakers or stereo type device.
| receiver | Device is audio video receiver type device taking audio and outputting to speakers and video to some display.

### Proxy album art for media browser

Optional. Some media players can serve album artwork or other images on an internal network accessible to Home Assistant that is inaccessible from an external url.
You can use the REST api to make these images accessible externally at `/api/media_player_proxy/{entity_id}?token={access_token}&browse_image={browse_image}` 

To do so, implement the `async_get_browse_image` method. It takes a single parameter - an image identifier that is passed as the `browse_image` `get` parameter. You may want to also create a method that generates the appropriate url and use it as part of your `async_browse_media` implementation. Note: `/api/media_player_proxy/{entity_id}` requires a `token` get parameter. The value of this token can be retrieved using the `access_token` property implemented by the `MediaPlayerEntity` base class.

```python
class MyMediaPlayer(MediaPlayerEntity):
    # Implement the following method.
    async def async_get_browse_image(self, browse_image):
    """Serve album art. Returns (content, content_type)."""
    
    # Optionally use a method like this to generate the url to view this image.
    def get_browse_image_url(self, browse_image):
        """Generate an externally accessible url for a media browser image."""
        base_url = get_url(self.hass, prefer_external=True)
        thumbnail = browse_image
        if thumbnail and thumbnail.startswith(self._internal_artwork_url):
            thumbnail = (
                f"{base_url}/api/media_player_proxy/{self.entity_id}"
                f"?token={self.access_token}&browse_image={thumbnail}"
            )
        return thumbnail
```
