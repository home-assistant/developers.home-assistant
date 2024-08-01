---
title: Wake word detection entity
sidebar_label: Wake word detection
---

A wake word detection entity allows other integrations or applications to detect wake words (also called hotwords) in an audio stream.

A wake word detection entity is derived from the  [`homeassistant.components.wake_word.WakeWordDetectionEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/wake_word/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests).
:::

| Name                 | Type           | Default      | Description                                                                                                                 |
|----------------------|----------------|--------------|-----------------------------------------------------------------------------------------------------------------------------|
| supported_wake_words | list[WakeWord] | **Required** | The supported wake words of the service with:<ul><li>ww_id - unique identifier</li><li>name - human-readable name</li></ul> |

## Methods

### Process audio stream

The process audio stream method is used to detect wake words. It must return a `DetectionResult` or `None` if the audio stream ends without a detection.

```python
class MyWakeWordDetectionEntity(WakeWordDetectionEntity):
    """Represent a Wake Word Detection entity."""

    async def async_process_audio_stream(
        self, stream: AsyncIterable[tuple[bytes, int]]
    ) -> DetectionResult | None:
        """Try to detect wake word(s) in an audio stream with timestamps.

        Audio must be 16Khz sample rate with 16-bit mono PCM samples.
        """
```

The audio stream is made of tuples with the form `(timestamp, audio_chunk)` where:

- `timestamp` is the number of milliseconds since the start of the audio stream
- `audio_chunk` is a chunk of 16-bit signed mono PCM samples at 16Khz

If a wake word is detected, a `DetectionResult` is returned with:

- `ww_id` - the unique identifier of the detected wake word
- `timestamp` - the timestamp of the audio chunk when detection occurred
- `queued_audio` - optional audio chunks that will be forwarded to speech-to-text (see below)

In an [Assist pipeline](/docs/voice/pipelines), the audio stream is shared between wake word detection and speech-to-text. This means that any audio chunk removed during wake word detection **can not be processed** by speech-to-text unless passed back in the `queued_audio` of a `DetectionResult`.
