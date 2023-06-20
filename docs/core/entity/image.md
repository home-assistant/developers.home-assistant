---
title: Image Entity
sidebar_label: Image
---

An image entity can display a static image. Derive a platform entity from [`homeassistant.components.image.ImageEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image/__init__.py).

The image entity is a greatly simplified version of the [`camera`](/docs/core/entity/camera) entity, and only supports serving a static image.

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
