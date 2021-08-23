---
title: Camera Entity
sidebar_label: Camera
---

A camera entity can display images, and optionally a video stream. Derive a platform entity from [`homeassistant.components.camera.Camera`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/camera/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| is_recording | bool | None | Indication of whether the camera is recording. Used to determine `state`.
| motion_detection_enabled | bool | False | Indication of whether the camera has motion detection enabled.
| is_on | bool | True | Indication camera is on.
| brand | str | None | The brand (manufacturer) of the camera.
| model | str | None | The model of the camera.
| frame_interval | float | 0.5 | The interval between frames of the stream.

## Methods

### Camera Image

When the width and height are passed, scaling should be done on a best-effort basis. The UI will fall back to scaling at the display layer if scaling cannot be done by the camera.

- Return the smallest image that meets the minimum width and minimum height.

- When scaling the image, aspect ratio must be preserved. If the aspect ratio is not the same as the requsted height or width, it is expected that the width and/or height of the returned image will be larger than requested.

- Pass on the width and height if the underlying camera is capable of scaling the image.

- If the integration cannot scale the image and returns a jpeg image, it will automatically be scaled by the camera integration when requested.

```python
class MyCamera(Camera):
    # Implement one of these methods.

    def camera_image(
        self, width: int | None = None, height: int | None = None
    ) -> bytes | None:
        """Return bytes of camera image."""
        raise NotImplementedError()

    async def async_camera_image(
        self, width: int | None = None, height: int | None = None
    ) -> bytes | None:
        """Return bytes of camera image."""

```

### Stream Source

The stream source should return a url that is usable by ffmpeg.

```python
class MyCamera(Camera):

    async def stream_source(self) -> str | None:
        """Return the source of the stream."""

```

### Turn on

```python
class MyCamera(Camera):
    # Implement one of these methods.

    def turn_on(self) -> None:
        """Turn on camera."""

    async def async_turn_on(self) -> None:
        """Turn on camera."""
```

### Turn off

```python
class MyCamera(Camera):
    # Implement one of these methods.

    def turn_off(self) -> None:
        """Turn off camera."""

    async def async_turn_off(self) -> None:
        """Turn off camera."""
```

### Enable motion detection

```python
class MyCamera(Camera):
    # Implement one of these methods.

    def enable_motion_detection(self) -> None:
        """Enable motion detection in the camera."""

    async def async_enable_motion_detection(self) -> None:
        """Enable motion detection in the camera."""
```

### Disable motion detection

```python
class MyCamera(Camera):
    # Implement one of these methods.

    def disable_motion_detection(self) -> None:
        """Disable motion detection in camera."""

    async def async_disable_motion_detection(self) -> None:
        """Disable motion detection in camera."""
```
