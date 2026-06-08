---
title: "Media source"
---

The media source platform allows integrations to expose browsable and playable media to Home Assistant. Media sources appear in the media browser UI, letting users navigate hierarchical media libraries and play content on media player devices.

## Implementing a media source

To add media source support, create a `media_source.py` file in your integration directory. No changes to `manifest.json` are needed — Home Assistant automatically discovers `media_source.py` modules via the integration platform mechanism.

The module must define an `async_get_media_source` function that returns an instance of your `MediaSource` subclass:

```python
from homeassistant.components.media_player import BrowseError, MediaClass, MediaType
from homeassistant.components.media_source import (
    BrowseMediaSource,
    MediaSource,
    MediaSourceItem,
    PlayMedia,
    Unresolvable,
)
from homeassistant.core import HomeAssistant

from .const import DOMAIN


async def async_get_media_source(hass: HomeAssistant) -> MyMediaSource:
    """Set up my media source."""
    return MyMediaSource(hass)


class MyMediaSource(MediaSource):
    """Provide media from my integration."""

    name = "My Service"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the media source."""
        super().__init__(DOMAIN)
        self.hass = hass

    async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
        """Resolve a media item to a playable URL."""
        ...

    async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
        """Browse media."""
        ...
```

## The `MediaSource` base class

Your media source must subclass `MediaSource` and implement two methods:

| Method | Description |
|---|---|
| `async_resolve_media(item)` | Resolve a `MediaSourceItem` to a `PlayMedia` with a playable URL and MIME type. Raise `Unresolvable` if the item cannot be resolved. |
| `async_browse_media(item)` | Return a `BrowseMediaSource` representing the browsable structure at the given item. Raise `BrowseError` if browsing fails. |

Set the class attribute `name` to a human-readable name for your source. If not set, it defaults to the integration domain.

## Browsing media

The `async_browse_media` method receives a `MediaSourceItem` and must return a `BrowseMediaSource` tree. When `item.identifier` is empty, return the root of your media hierarchy. For non-empty identifiers, return the children of that item.

```python
async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
    """Browse media."""
    if item.identifier:
        raise BrowseError("Unknown item")

    children = [
        BrowseMediaSource(
            domain=DOMAIN,
            identifier=entity.entity_id,
            media_class=MediaClass.VIDEO,
            media_content_type=entity.content_type,
            title=entity.name,
            thumbnail=f"/api/my_proxy/{entity.entity_id}",
            can_play=True,
            can_expand=False,
        )
        for entity in self.hass.data[DATA_COMPONENT].entities
    ]

    return BrowseMediaSource(
        domain=DOMAIN,
        identifier=None,
        media_class=MediaClass.APP,
        media_content_type="",
        title="My Service",
        can_play=False,
        can_expand=True,
        children_media_class=MediaClass.VIDEO,
        children=children,
    )
```

### `BrowseMediaSource`

`BrowseMediaSource` extends the media player's `BrowseMedia` and automatically constructs the `media_content_id` from the `domain` and `identifier`.

| Parameter | Type | Description |
|---|---|---|
| `domain` | `str` | Your integration domain. |
| `identifier` | `str \| None` | Item-specific identifier. Use `None` for root items. |
| `media_class` | `MediaClass` | The type of media (e.g., `MediaClass.APP`, `MediaClass.DIRECTORY`, `MediaClass.MUSIC`, `MediaClass.VIDEO`, `MediaClass.IMAGE`). |
| `media_content_type` | `MediaType \| str` | MIME type or media type of the content (e.g., `"audio/mpeg"`). |
| `title` | `str` | Display title shown to the user. |
| `can_play` | `bool` | Whether the item can be played directly. |
| `can_expand` | `bool` | Whether the item can be browsed deeper (has children). |
| `children` | `list[BrowseMediaSource] \| None` | Child items. Only set on the parent item that is browsed. |
| `children_media_class` | `MediaClass \| None` | Media class of the children. Automatically calculated if not set. |
| `thumbnail` | `str \| None` | URL to a thumbnail image. |
| `not_shown` | `int` | Number of children not included (e.g., filtered out). Defaults to `0`. |

### Hierarchical browsing

For deep media hierarchies, use the identifier to encode the path. A common pattern is to use `/` as a separator within the identifier:

```python
async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
    """Browse media."""
    category, _, sub_id = (item.identifier or "").partition("/")

    if category == "albums" and sub_id:
        return await self._async_browse_album(sub_id)

    if category == "albums":
        return await self._async_browse_albums()

    # Root
    return BrowseMediaSource(
        domain=DOMAIN,
        identifier=None,
        media_class=MediaClass.APP,
        media_content_type="",
        title="My Service",
        can_play=False,
        can_expand=True,
        children=[
            BrowseMediaSource(
                domain=DOMAIN,
                identifier="albums",
                media_class=MediaClass.DIRECTORY,
                media_content_type=MediaType.MUSIC,
                title="Albums",
                can_play=False,
                can_expand=True,
            ),
        ],
    )
```

## Resolving media

The `async_resolve_media` method resolves a media item to a playable URL. It receives a `MediaSourceItem` and returns a `PlayMedia` instance:

```python
async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
    """Resolve a media item to a playable URL."""
    track = await self.api.get_track(item.identifier)

    if not track:
        raise Unresolvable(f"Could not resolve: {item.identifier}")

    return PlayMedia(track.stream_url, track.mime_type)
```

### `PlayMedia`

| Field | Type | Description |
|---|---|---|
| `url` | `str` | The URL to play. Can be an absolute URL or a relative path served by Home Assistant. |
| `mime_type` | `str` | The MIME type of the media (e.g., `"audio/mpeg"`, `"video/mp4"`, `"image/jpeg"`). |
| `path` | `Path \| None` | Optional local filesystem path. Only used for local file sources. |

### `MediaSourceItem`

The `MediaSourceItem` passed to both methods has these attributes:

| Attribute | Type | Description |
|---|---|---|
| `domain` | `str \| None` | Your integration domain. |
| `identifier` | `str` | The item identifier from the URI. |
| `target_media_player` | `str \| None` | Entity ID of the media player that will play the media. Can be used to customize the resolved URL. |

## URI scheme

Media sources use the `media-source://` URI scheme:

```
media-source://domain/identifier
```

For example:
- `media-source://radio_browser/popular` — the "popular" category of radio_browser
- `media-source://tts/message` — a TTS message

Use the `generate_media_source_id` helper to construct URIs:

```python
from homeassistant.components.media_source import generate_media_source_id

media_id = generate_media_source_id(DOMAIN, "my_track_123")
# Returns: "media-source://my_integration/my_track_123"
```

Use `is_media_source_id` to check if a string is a valid media source URI:

```python
from homeassistant.components.media_source import is_media_source_id

if is_media_source_id(media_content_id):
    # Handle as media source
    ...
```

## Error handling

Raise the appropriate exception when something goes wrong:

| Exception | When to raise |
|---|---|
| `Unresolvable` | In `async_resolve_media` when the media item cannot be resolved to a playable URL. |
| `BrowseError` | In `async_browse_media` when the media structure cannot be retrieved. |

Both exceptions support translations:

```python
raise Unresolvable(
    translation_domain=DOMAIN,
    translation_key="item_not_found",
    translation_placeholders={"item": item.identifier},
)
```

## Using media source from other integrations

Other integrations (e.g., media players) can use the media source helpers to browse and resolve media:

```python
from homeassistant.components.media_source import (
    async_browse_media,
    async_resolve_media,
    is_media_source_id,
)

# Browse media sources
result = await async_browse_media(hass, "media-source://my_domain")

# Resolve a media item to a playable URL
play_media = await async_resolve_media(
    hass,
    "media-source://my_domain/track_123",
    target_media_player="media_player.living_room",
)
```
