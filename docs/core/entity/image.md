---
title: Image Entity
sidebar_label: Image
---

An image entity can display a static image. Derive a platform entity from [`homeassistant.components.image.ImageEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image/__init__.py).

The image entity is a simplified version of the [`camera`](/docs/core/entity/camera) entity, and supports serving a static image or an image URL that can be fetched.

An implementation can provide either a URL from where an image will automatically be fetched or image data as `bytes`. When providing a URL, the fetched image will be cached in `self._cached_image`, set `self._cached_image` to `None` to invalidate the cache.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name               | Type                              | Default      | Description                                                                                              |
| -------------------| --------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| content_type       | str                               | `image/jpeg` | The content-type of the image, set automatically if the image entity provides a URL.                     |
| image_last_updated | <code>datetime.datetime &#124; None</code> | `None`       | Timestamp of when the image was last updated. Used to determine `state`. Frontend will refetch the image when this changes. |
| image_url          | <code>str &#124; None</code>      | `UNDEFINED`  | Optional URL from where the image should be fetched.                                                     |

## Methods

### Image

Implement `async_image` or `image` if your entity returns bytes of the image instead of providing a URL.

Note that:
- The image entity's `async_image` or `image` method is only called when frontend fetches the image.
- Frontend will only refetch the image when the image entity's state changes.

This means it's incorrect to bump the `image_last_updated` property inside `async def async_image`. It should instead be done as part of a state update to signal that an updated image is available.

```python
class MyImage(ImageEntity):
    # Implement one of these methods.

    def image(self) -> bytes | None:
        """Return bytes of image."""

    async def async_image(self) -> bytes | None:
        """Return bytes of image."""
```
