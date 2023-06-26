---
title: Image Entity
sidebar_label: Image
---

An image entity can display a static image. Derive a platform entity from [`homeassistant.components.image.ImageEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image/__init__.py).

The image entity is a simplified version of the [`camera`](/docs/core/entity/camera) entity, and supports serving a static image or an image URL that can be fetched.

To make frontend refetch the image, bump the `image_last_updated` property.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                     | Type  | Default | Description                                                                                                                        |
| ------------------------ | ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| image_last_updated             | datetime  | `None`  | Timestamp of when the image was last updated. Used to determine `state`.                                                          |

## Methods

### Image

Return bytes of the image.

```python
class MyImage(ImageEntity):
    # Implement one of these methods.

    def image(self) -> bytes | None:
        """Return bytes of image."""

    async def async_image(self) -> bytes | None:
        """Return bytes of image."""
```

Return the URL of an image to be fetched.

```python
class MyImage(ImageEntity):
    # Implement one of these methods.

    def image_url(self) -> str | None:
        """Return URL of image."""

    async def async_image_url(self) -> str | None:
        """Return URL of image."""
```

By default `image_url` or `async_image_url` return `None`, and `async_image` or `image` will be called expecting to return the bytes of the image.
