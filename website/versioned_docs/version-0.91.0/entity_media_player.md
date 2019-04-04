---
title: Media Player Entity
sidebar_label: Media Player
id: version-0.91.0-entity_media_player
original_id: entity_media_player
---

> This entry is incomplete. Contribution welcome.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| sound_mode | string | None | The current sound mode of the media player
| sound_mode_list | list | None | Dynamic list of available sound modes (set by platform, empty means sound mode not supported)
| source | string | None | The currently selected input source for the media player.
| source_list | list | None | The list of possible input sources for the media player. (This list should contain human readable names, suitible for frontend display)


## Methods
### Select sound mode
Optional. Switch the sound mode of the media player.

    class MyMediaPlayer(MediaPlayerDevice):
      # Implement one of these methods.
      
      def select_sound_mode(self, sound_mode):
          """Switch the sound mode of the entity."""

      def async_select_sound_mode(self, sound_mode):
          """Switch the sound mode of the entity."""

### Select source
Optional. Switch the selected input source for the media player.

    class MyMediaPlayer(MediaPlayerDevice):
      # Implement one of these methods.

      def select_source(self, source):
          """Select input source."""

      def async_select_source(self, source):
          """Select input source."""

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

    class MyMediaPlayer(MediaPlayerDevice):
      # Implement the following method.

      def media_content_type(self):
        """Content type of current playing media."""

