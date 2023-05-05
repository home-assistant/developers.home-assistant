---
title: Speech To Text Entity
sidebar_label: Speech To Text
---

A speech to text (STT) entity allows other integrations or applications to stream speech data to the STT API and get text back.

A speech to text entity is derived from the  [`homeassistant.components.stt.SpeechToTextEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/stt/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests).
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| supported_languages | list[str] | **Required** | The supported languages of the STT service.
| supported_formats | list[AudioFormats] | **Required** | The supported audio formats of the STT service, wav or ogg.
| supported_codecs | list[AudioCodecs] | **Required** | The supported audio codecs of the STT service, pcm or opus.
| supported_bit_rates | list[AudioBitRates] | **Required** | The supported audio bit rates of the STT service, 8, 16, 24 or 32.
| supported_sample_rates | list[AudioSampleRates] | **Required** | The supported audio sample rates of the STT service.
| supported_channels | list[AudioChannels] | **Required** | The supported audio channels of the STT service, 1 or 2.

## Methods

### Process audio stream

The process audio stream method is used send audio to an STT service and get text back.

```python
class MySpeechToTextEntity(SpeechToTextEntity):
    """Represent a Speech To Text entity."""

    async def async_process_audio_stream(self) -> None:
        """Process an audio stream to STT service.

        Only streaming content is allowed!
        """
```
