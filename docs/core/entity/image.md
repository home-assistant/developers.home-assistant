---
title: Image Entity
sidebar_label: Image
---

An image entity can display a static image. Derive a platform entity from [`homeassistant.components.image.ImageEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image/__init__.py).

The image entity is a simplified version of the [`camera`](/docs/core/entity/camera) entity, and supports serving a static image or an image URL that can be fetched.

An implementation can provide either a URL from where an image will automatically be fetched or image data as `bytes`. When providing a URL, the fetched image will be cached in `self._cached_image`, set `self._cached_image` to `None` to invalidate the cache.

To make frontend refetch the image, bump the `image_last_updated` property.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                     | Type        | Default      | Description                                                                                                                        |
| ------------------------ | ---------   | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| content_type             | str         | `image/jpeg` | The content-type of the image, set automatically if the image entity provides a URL.                                               |
| image_last_updated       | datetime    | `None`       | Timestamp of when the image was last updated. Used to determine `state`.                                                           |
| image_url                | str or None | `UNDEFINED`  | Optional URL from where the image should be fetched.                                                                               |

## Methods

### Image

Implement if your entity returns bytes of the image instead of providing a URL.

```python
class MyImage(ImageEntity):
    # Implement one of these methods.

    def image(self) -> bytes | None:
        """Return bytes of image."""

    async def async_image(self) -> bytes | None:
        """Return bytes of image."""
```
