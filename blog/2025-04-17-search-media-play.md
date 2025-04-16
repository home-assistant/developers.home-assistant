---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?v=4
title: "Searching in media players"
---

Media players can now allow users to search through the media, by adding `MediaEntityFeature.SEARCH_MEDIA` and implementing `async_search_media`. The users can filter the search result by a search query and a list of `MediaClasses` that the returned results should have. For more info, see [the updated documentation.](/docs/core/entity/media-player#search-media)
