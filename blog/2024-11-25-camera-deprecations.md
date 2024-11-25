---
author: Robert Resch
authorURL: https://github.com/edenhaus
authorImageURL: https://avatars.githubusercontent.com/u/26537646?s=96&v=4
title: "Camera deprecations"
---

With Home Assistant 2024.11 we added WebRTC for most cameras. To add support for it we needed to refactor and improve the camera entity.
Today we annouced that with the upcoming HA 2024.12 the following methods are deprecated and they will be removed with HA 2025.6:

- `frontend_stream_type` will be removed and the stream type will identified since 2024.11 by checking, which if the native WebRTC methods are implemented or not ([#130932](https://github.com/home-assistant/core/pull/130932)).
- The method `async_handle_web_rtc_offer` will be removed. Please use `async_handle_async_webrtc_offer` and the async WebRTC signaling approach ([#131285](https://github.com/home-assistant/core/pull/131285)).
- Deprecate `async_register_rtsp_to_web_rtc_provider`. Please use `async_register_webrtc_provider`, which offers more flexibility and supports the async WebRTC signaling approach ([#131462](https://github.com/home-assistant/core/pull/131462)).
