---
title: "Assist satellites"
---

The [Assist satellite](https://www.home-assistant.io/integrations/assist_satellite) integration represents a remote satellite that uses [pipelines](/docs/voice/pipelines). Integrations must implement the [base entity](#base-entity) for the `assist_satellite` platform. These satellites can then be controlled remotely via [actions](https://next.home-assistant.io/integrations/assist_satellite#actions) and a [WebSocket API](#websocket-api).

## Base entity

The `AssistSatelliteEntity` base class must be inherited when implementing the `assist_satellite` platform. For example:

```python
from homeassistant.components.assist_satellite import AssistSatelliteEntity
from homeassistant.components.assist_pipeline import PipelineEvent

class MyAssistSatelliteEntity(AssistSatelliteEntity):
    def on_pipeline_event(self, event: PipelineEvent) -> None:
        """Handle events from async_accept_pipeline_from_satellite."""
        ...
```

You must call the `tts_response_finished()` method on your entity when a text-to-speech response has finished playing out of the speaker (this is not the same as the `TTS_END` pipeline event). This will ensure that the entity's state is `responding` only while the response is being spoken.

If your satellite supports announcements, add it to your supported features and override `async_announce`:

```python
from homeassistant.components.assist_satellite import AssistSatelliteEntity, AssistSatelliteEntityFeature

class MyAssistSatelliteEntity(AssistSatelliteEntity):
    _attr_supported_features = AssistSatelliteEntityFeature.ANNOUNCE

    async def async_announce(self, message: str, media_id: str) -> None:
        """Announce media on the satellite.

        Should block until the announcement is done playing.
        """
        ...
```

The `async_announce` method will receive a resolved `media_id` and the `message` text (if provided). This method must block asynchronously until the announcement has finished playing on the satellite.

## WebSocket API

### Intercepting wake words

The next wake word detection from the satellite may be intercepted:

```json
{
  "type": "assist_satellite/intercept_wake_word",
  "entity_id": ENTITY_ID
}
```

The entity id must be of an Assist satellite entity which supports the `ANNOUNCE` feature.

Once a wake word is detected, a response is returned like:

```json
{
  "wake_word_phrase": "okay nabu"
}
```
