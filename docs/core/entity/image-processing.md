---
title: Image processing entity
sidebar_label: Image processing
---

An image processing entity analyzes images from a camera entity, for example to recognize license plates, faces, or text. The entity periodically fetches an image from its source camera and runs it through the integration's processing implementation.

An image processing entity is derived from the [`homeassistant.components.image_processing.ImageProcessingEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image_processing/__init__.py).

## Updates

Home Assistant polls image processing entities every 10 seconds by default. On each update cycle, the platform fetches a still image from the entity's source camera and passes it to the entity's processing method. Users can also trigger an immediate cycle with the `image_processing.scan` action.

Implement either `process_image` or `async_process_image` to analyze the image and update the entity's state from the result:

```python
    async def async_process_image(self, image: bytes) -> None:
        """Process the given image."""
```

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name          | Type            | Default      | Description                                                    |
| ------------- | --------------- | ------------ | -------------------------------------------------------------- |
| camera_entity | `str \| None`   | `None`       | Entity ID of the camera that provides the images to process.   |
| confidence    | `float \| None` | `None`       | Minimum confidence (0-100) for detections to be reported.      |

Other properties that are common to all entities such as `device_class`, `icon`, `name` etc are also applicable.

### Available device classes

| Constant                          | Description                              |
| --------------------------------- | ---------------------------------------- |
| `ImageProcessingDeviceClass.ALPR` | Automatic license plate recognition.     |
| `ImageProcessingDeviceClass.FACE` | Face recognition or detection.           |
| `ImageProcessingDeviceClass.OCR`  | Text recognition.                        |

## Face processing entities

For face detection and recognition, derive from [`ImageProcessingFaceEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image_processing/__init__.py) instead. Rather than setting the state directly, call `process_faces` (or `async_process_faces` from the event loop) with the list of detected faces and the total count. The base class manages the entity state from the detections and fires an `image_processing.detect_face` event for each face that meets the entity's `confidence` threshold.

The [demo platform](https://github.com/home-assistant/core/blob/dev/homeassistant/components/demo/image_processing.py) provides minimal implementations of both entity types, and the [DOODS integration](https://github.com/home-assistant/core/blob/dev/homeassistant/components/doods/image_processing.py) is a fuller real-world example.
