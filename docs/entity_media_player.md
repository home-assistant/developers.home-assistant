---
title: Media Player Entity
sidebar_label: Media Player
---

> This entry is incomplete. Contribution welcome.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| sound_mode | string | None | The current sound mode of the media player
| sound_mode_list | list | None | Dynamic list of available sound modes (set by platform)
| support_select_sound_mode | boolean | False | Boolean if select sound mode command supported


## Methods
### Select sound mode
Optional. Switch the sound mode of the media player.

    class MyMediaPlayer(MediaPlayerDevice):
      # Implement one of these methods.
      
      def select_sound_mode(self, sound_mode):
          """Switch the sound mode of the entity."""

      def async_select_sound_mode(self, sound_mode):
         """Switch the sound mode of the entity."""
