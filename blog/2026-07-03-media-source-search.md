---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?s=96&v=4
title: "Media sources can now be searched"
---

Media sources can now implement search. By adding an `async_search_media` method to your `MediaSource`, users can search through your media directly from the media browser.

```python
from homeassistant.components.media_player import SearchMedia, SearchMediaQuery

async def async_search_media(
    self, item: MediaSourceItem, query: SearchMediaQuery
) -> SearchMedia:
    """Search media."""
    results = [...]  # list of BrowseMediaSource items
    return SearchMedia(result=results)
```

To tell the media browser which items can be searched, set the `can_search` flag to `True` on the `BrowseMediaSource` items you return while browsing (typically directories). Other integrations can trigger a search through the new `media_source.async_search_media` helper.

For more info, see [the updated documentation.](/docs/core/platform/media_source#searching-media)
