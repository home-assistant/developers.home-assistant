---
author: Michael Hansen
authorURL: https://github.com/synesthesiam
authorImageURL: /img/profile/mike_hansen.png
authorTwitter: rhasspy
title: Introducing the Assist satellite entity
---

Users typically interact with [Assist](https://www.home-assistant.io/voice_control/) using remote voice satellites, such as the [ESP32-S3-BOX-3](https://www.home-assistant.io/voice_control/s3_box_voice_assistant/) running ESPHome, [analog phones](https://www.home-assistant.io/voice_control/worlds-most-private-voice-assistant/) running VoIP, and more. The integrations managing these satellites have used ad-hoc `binary_sensor` and `select` entities to allow users to configure the satellite's [pipeline](/docs/voice/pipelines/), automate based on the pipeline state, etc.

The new [`AssistSatelliteEntity`](/docs/core/entity/assist-satellite) provides an entity which represents a voice satellite. Its state follows the underlying Assist pipeline, allowing for easy automation. Additionally:

* A new [announce action](https://home-assistant.io/integrations/assist_satellite#action-assist_satelliteannounce) is available for making announcements on supported devices.
* Several [websocket commands](/docs/core/entity/assist-satellite#websocket-api) are also available, providing a uniform way to get and set the active on-device wake words.

The `esphome` and `voip` integrations have been transitioned to use `AssistSatelliteEntity`, and the `wyoming` integration will be next.
