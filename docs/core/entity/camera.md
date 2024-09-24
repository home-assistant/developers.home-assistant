---
title: Camera entity
sidebar_label: Camera
---

A camera entity can display images, and optionally a video stream. Derive a platform entity from [`homeassistant.components.camera.Camera`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/camera/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                     | Type                                | Default | Description                                                                                         |
| ------------------------ | ------------------------------------| ------- | --------------------------------------------------------------------------------------------------- |
| brand                    | <code>str &#124; None</code>        | `None`  | The brand (manufacturer) of the camera.                                                             |
| frame_interval           | `float`                             | 0.5     | The interval between frames of the stream.                                                          |
| frontend_stream_type     | <code>StreamType &#124; None</code> | `None`  | Used with `CameraEntityFeature.STREAM` to tell the frontend which type of stream to use (`StreamType.HLS` or `StreamType.WEB_RTC`) |
| is_on                    | `bool`                              | `True`  | Indication of whether the camera is on.                                                             |
| is_recording             | `bool`                              | `False` | Indication of whether the camera is recording. Used to determine `state`.                           |
| is_streaming             | `bool`                              | `False` | Indication of whether the camera is streaming. Used to determine `state`.                           |
| model                    | <code>str &#124; None</code>        | `None`  | The model of the camera.                                                                            |
| motion_detection_enabled | `bool`                              | `False` | Indication of whether the camera has motion detection enabled.                                      |
| use_stream_for_stills    | `bool`                              | `False` | Determines whether or not to use the `Stream` integration to generate still images                  |

### States

The state is defined by setting the properties above. The resulting state uses the `CameraState` enum to return one of the below members.

| Value       | Description                             |
|-------------|-----------------------------------------|
| `RECORDING` | The camera is currently recording.      |
| `STREAMING` | The camera is currently streaming.      |
| `IDLE`      | The camera is currently idle.           |


## Supported features

Supported features are defined by using values in the `CameraEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value    | Description                                  |
| -------- | -------------------------------------------- |
| `ON_OFF` | The device supports `turn_on` and `turn_off` |
| `STREAM` | The device supports streaming                |

## Methods

### Camera image

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

### Stream source

The stream source should return a url that is usable by ffmpeg (e.g. an RTSP url). Requires `CameraEntityFeature.STREAM`.

A camera entity with a stream source by default uses `StreamType.HLS` to tell the frontend to use an HLS feed with the `stream` component. This stream source will also be used with `stream` for recording.

```python
class MyCamera(Camera):

    async def stream_source(self) -> str | None:
        """Return the source of the stream."""

```

A common way for a camera entity to render a camera still image is to pass the stream source to `async_get_image` in the `ffmpeg` component.

### WebRTC streams

WebRTC enabled cameras can be used by facilitating a direct connection with the home assistant frontend. This usage requires `CameraEntityFeature.STREAM` with `frontend_stream_type` set to `StreamType.WEB_RTC`. The integration should implement `async_handle_web_rtc_offer` which passes the frontend's SDP offer to the device and returns back the answer.

WebRTC streams do not use the `stream` component and do not support recording.

```python
class MyCamera(Camera):

    async def async_handle_web_rtc_offer(self, offer_sdp: str) -> str | None:
        """Handle the WebRTC offer and return an answer."""
```

### RTSP to WebRTC

An integration may provide a WebRTC stream for any RTSP camera using `async_register_rtsp_to_web_rtc_provider`. The current best practice is for an integration to provide the actual stream manipulation with an Add-on or external service.

```python
async def handle_offer(stream_source: str, offer_sdp: str) -> str:
    """Handle the signal path for a WebRTC stream and return an answer."""
    try:
        return await client.offer(offer_sdp, stream_source)
    except ClientError as err:
        raise HomeAssistantError from err

# Call unsub() when integration unloads
unsub = camera.async_register_rtsp_to_web_rtc_provider(
    hass, DOMAIN, handle_offer
)
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
