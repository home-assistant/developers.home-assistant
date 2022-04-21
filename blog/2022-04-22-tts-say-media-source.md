---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Text-to-speech say service to use media source IDs
---

Starting with Home Assistant 2022.5, the TTS say service will set the media content ID to be a media source URI. These need to be resolved inside the media player using the media source integration.

Previously the TTS integration would set the media content ID to a URL that pointed at Home Assistant and it required no extra work from the media players.

Media players need to support the media source integration as [documented here](/docs/core/entity/media-player#browse-media).
