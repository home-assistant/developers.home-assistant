---
title: Text-to-speech entity
sidebar_label: Text-to-speech
---

A text-to-speech (TTS) entity enables Home Assistant to speak to you.

A text-to-speech entity is derived from the  [`homeassistant.components.tts.TextToSpeechEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/tts/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests).
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| supported_languages | list[str] | **Required** | The supported languages of the TTS service.
| default_language | str | **Required** | The default language of the TTS service.
| supported_options | list[str] | None | The supported options like voice, emotions of the TTS service.
| default_options | Mapping[str, Any] | None | The default options of the TTS service.

## Methods

### Get supported voices

This method is used to return a list of supported voices for a language of a TTS service.

```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """Represent a Text To Speech entity."""

    @callback
    def async_get_supported_voices(self, language: str) -> list[str] | None:
        """Return a list of supported voices for a language."""
```

### Generating TTS audio

An entity can choose to implement three different ways of generating TTS audio. Only one method can be implemented at a time.

The stream TTS audio method allows text to be streamed into the TTS service and audio to be streamed back.

```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """Represent a Text To Speech entity."""

    async def async_stream_tts_audio(
        self, request: TTSAudioRequest
    ) -> TTSAudioResponse:
        """Generate speech from an incoming message."""
```

The definition of the `TTSAudioRequest` and `TTSAudioResponse` objects are as follows:

```python
@dataclass
class TTSAudioRequest:
    """Request to get TTS audio."""

    language: str
    options: dict[str, Any]
    message_gen: AsyncGenerator[str]


@dataclass
class TTSAudioResponse:
    """Response containing TTS audio stream."""

    extension: str
    data_gen: AsyncGenerator[bytes]
```

If the Text-to-Speech service requires the entire message to be sent at once, the get tts audio method can be used. It can be implemented as either synchronous or asynchronous.


```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """Represent a Text To Speech entity."""

    def get_tts_audio(
        self, message: str, language: str, options: dict[str, Any]
    ) -> TtsAudioType:
        """Load tts audio file from the engine."""

    async def async_get_tts_audio(
        self, message: str, language: str, options: dict[str, Any]
    ) -> TtsAudioType:
        """Load tts audio file from the engine."""
```
