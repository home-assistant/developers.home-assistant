---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: "Media Player updates: enqueue changes, announce added"
---

Starting with Home Assistant 2022.6, the media player integration has received two updates to the `media_player.play_media` service. The `enqueue` attribute has been changed to a string in [PR #72406](https://github.com/home-assistant/core/pull/72406) and a new `announce` boolean attribute was added in [PR #72566](https://github.com/home-assistant/core/pull/72566).

See the updated [media player play_media documentation](/docs/core/entity/media-player/#play-media) for more information.
