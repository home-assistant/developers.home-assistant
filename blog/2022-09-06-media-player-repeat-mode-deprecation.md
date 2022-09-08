---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecating media player constants"
---

As of Home Assistant Core 2022.10, the following media player constants are deprecated:

  - `MEDIA_CLASS_ALBUM`
  - `MEDIA_CLASS_APP`
  - `MEDIA_CLASS_ARTIST`
  - `MEDIA_CLASS_CHANNEL`
  - `MEDIA_CLASS_COMPOSER`
  - `MEDIA_CLASS_CONTRIBUTING_ARTIST`
  - `MEDIA_CLASS_DIRECTORY`
  - `MEDIA_CLASS_EPISODE`
  - `MEDIA_CLASS_GAME`
  - `MEDIA_CLASS_GENRE`
  - `MEDIA_CLASS_IMAGE`
  - `MEDIA_CLASS_MOVIE`
  - `MEDIA_CLASS_MUSIC`
  - `MEDIA_CLASS_PLAYLIST`
  - `MEDIA_CLASS_PODCAST`
  - `MEDIA_CLASS_SEASON`
  - `MEDIA_CLASS_TRACK`
  - `MEDIA_CLASS_TV_SHOW`
  - `MEDIA_CLASS_URL`
  - `MEDIA_CLASS_VIDEO`

  - `MEDIA_TYPE_ALBUM`
  - `MEDIA_TYPE_APP`
  - `MEDIA_TYPE_APPS`
  - `MEDIA_TYPE_ARTIST`
  - `MEDIA_TYPE_CHANNEL`
  - `MEDIA_TYPE_CHANNELS`
  - `MEDIA_TYPE_COMPOSER`
  - `MEDIA_TYPE_CONTRIBUTING_ARTIST`
  - `MEDIA_TYPE_EPISODE`
  - `MEDIA_TYPE_GAME`
  - `MEDIA_TYPE_GENRE`
  - `MEDIA_TYPE_IMAGE`
  - `MEDIA_TYPE_MOVIE`
  - `MEDIA_TYPE_MUSIC`
  - `MEDIA_TYPE_PLAYLIST`
  - `MEDIA_TYPE_PODCAST`
  - `MEDIA_TYPE_SEASON`
  - `MEDIA_TYPE_TRACK`
  - `MEDIA_TYPE_TVSHOW`
  - `MEDIA_TYPE_URL`
  - `MEDIA_TYPE_VIDEO`

  - `REPEAT_MODE_ALL`
  - `REPEAT_MODE_OFF`
  - `REPEAT_MODE_ONE`
  - `REPEAT_MODES`

Use the new `MediaClass`, `MediaType`, and `RepeatMode` enum instead.

The use of `STATE_*` constants to reflect media player state is also deprecated. Please use the new `MediaPlayerState` enum instead.
