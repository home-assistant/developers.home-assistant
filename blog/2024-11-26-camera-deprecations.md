---
author: Robert Resch
authorURL: https://github.com/edenhaus
authorImageURL: https://avatars.githubusercontent.com/u/26537646?s=96&v=4
title: "Camera API changes"
---

With Home Assistant `2024.11` we added WebRTC for most cameras. To add support for it we needed to refactor and improve the camera entity.
Today we would like to announce that with the upcoming Home Assistant release `2024.12` the following methods are deprecated and will be removed with Home Assistant version `2025.6`:

- The property `frontend_stream_type` will be removed. As of `2024.11` Home assistant will identify the frontend stream type by checking if the camera entity implements the native WebRTC methods ([#130932](https://github.com/home-assistant/core/pull/130932)).
    - Card developers can use the new websocket command `camera/capabilities` to get the frontend stream types.

- The method `async_handle_web_rtc_offer` will be removed. Please use `async_handle_async_webrtc_offer` and the async WebRTC signaling approach ([#131285](https://github.com/home-assistant/core/pull/131285)).

- The method `async_register_rtsp_to_web_rtc_provider` has been deprecated. Please use `async_register_webrtc_provider`, which offers more flexibility and supports the async WebRTC signaling approach ([#131462](https://github.com/home-assistant/core/pull/131462)).

More information about the replacements can be found in the [camera entiy documentation](/docs/core/entity/camera.md).
