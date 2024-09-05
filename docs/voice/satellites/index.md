---
title: "Assist satellites"
---

The [Assist satellite](https://www.home-assistant.io/integrations/assist_satellite) integration represents a remote satellite that uses [pipelines](/docs/voice/pipelines). These satellites can be controlled remotely via [actions](https://next.home-assistant.io/integrations/assist_satellite#actions) and a WebSocket API.

## Intercepting wake words

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
