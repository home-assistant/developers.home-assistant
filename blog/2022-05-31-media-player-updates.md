---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: "Media Player updates: enqueue changes, announce added"
---

Starting with Home Assistant 2022.6, the media player integration has received two updates to the `media_player.play_media` service:

The `enqueue` attribute was changed in [PR #72406](https://github.com/home-assistant/core/pull/72406) from a boolean to a string enum `MediaPlayerEnqueue`:

 - `add`: add given media item to end of the queue
 - `next`: play the given media item next, keep queue
 - `play`: play the given media item now, keep queue
 - `replace`: play the given media item now, clear queue

A new `announce` boolean attribute was added in [PR #72566](https://github.com/home-assistant/core/pull/72566). When set to `true`, the media player should try to pause the current music, announce the media to the user and then resume the music.
