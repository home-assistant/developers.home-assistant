---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
authorImageURL: https://avatars.githubusercontent.com/u/1444314?v=4
title: "BrowseMediaSource: domain is now required"
---

The `BrowseMediaSource` class in the `media_source` integration has been tightened up. The `domain` parameter is now a required `str` instead of `str | None`, and the special "list every media source" root node has moved to its own class, `RootBrowseMediaSource`.

Previously, `domain` was optional only to represent one edge case: the top-level node returned when browsing `media-source://` with no specific source selected. That made the type hint misleading for the 99% case — every actual media source has a domain — and added a `None` branch that consumers had to think about. Splitting the root into its own class removes that branch.

## What changed

- `BrowseMediaSource.__init__` now requires `domain: str`.
- A new `RootBrowseMediaSource` class represents the root browse node listing all available media sources. It hardcodes `domain=None` and `identifier=None` and uses `media-source://` as its content ID.
- `media_source.async_browse_media()` and `MediaSourceItem.async_browse()` now return `BrowseMediaSource | RootBrowseMediaSource`.

## Impact on custom integrations

Most integrations don't need any changes. If you implement a `media_source.py` platform, you were already passing your own `domain` to `BrowseMediaSource` — that keeps working.

You only need to act if:

- **You pass `domain=None` to `BrowseMediaSource`.** This is no longer allowed. If you were doing this to build a root-like node, switch to `RootBrowseMediaSource`. If you were doing it by mistake, set your integration domain instead.
- **You call `media_source.async_browse_media()` and annotate the result.** Update the type hint to `BrowseMediaSource | RootBrowseMediaSource`, or narrow with `isinstance()` before using domain-specific attributes:

  ```python
  from homeassistant.components.media_source import (
      BrowseMediaSource,
      async_browse_media,
  )

  result = await async_browse_media(hass, media_content_id)
  if isinstance(result, BrowseMediaSource):
      # result.domain is guaranteed to be a str here
      ...
  ```

See the updated [media source platform documentation](/docs/core/platform/media_source) for the full reference.
