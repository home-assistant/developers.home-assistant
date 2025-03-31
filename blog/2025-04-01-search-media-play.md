---
author: Josef Zwedck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?v=4
title: "Sarching in media players"
---

Media players can now allow users to search through the media, by adding `MediaEntityFeature.SEARCH_MEDIA` and implementing `async_search_media`.

The users can filter the search result by a search query and a list of `MediaClasses` that the returned results should have.

Inside of `async_search_media` the developer is responsible for querying the requested results from their serving API and returning it as a list of `BrowseMedia` as part of the `SearchMedia` result.

 ```python
 class MyMediaPlayer(MediaPlayerEntity):
 
     async def async_search_media(
         self,
         query: SearchMediaQuery,
     ) -> SearchMedia:
         """Search the media player."""
         # search for the reqested media on your library client.
         result = await my_client.search(query=query.search_query)
         return SearchMedia(result=result)
 ```
