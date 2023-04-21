---
title: Text To Speech Entity
sidebar_label: Text To Speech
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

### Get TTS audio

The get tts audio method is used to generate an audio file from a text message using a TTS service.

```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """Represent a Text To Speech entity."""

    def get_tts_audio(
        self, message: str, language: str, options: dict[str, Any] | None = None
    ) -> TtsAudioType:
        """Load tts audio file from the engine."""

    async def async_get_tts_audio(
        self, message: str, language: str, options: dict[str, Any] | None = None
    ) -> TtsAudioType:
        """Load tts audio file from the engine."""
```
