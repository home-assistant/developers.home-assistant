---
title: "Assist satellite entity"
sidebar_label: Assist satellite
---

An Assist Satellite entity represents the Assist pipeline-powered voice assistant capabilities of a device. Devices with such entities can allow users to control Home Assistant using their voice.

An Assist satellite entity is derived from the [`homeassistant.components.assist_satellite.AssistSatelliteEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/assist_satellite/__init__.py).

## Properties

| Name                 | Type                   | Default           | Description                                                           |
|----------------------|------------------------|-------------------|-----------------------------------------------------------------------|
| `pipeline_entity_id` | <code>str; None</code> | <code>None</code> | Id of the `select` entity with the [pipeline id](/docs/voice/pipelines/) or `None`. |
| `vad_sensitivity_entity_id` | <code>str; None</code> | <code>None</code> | Id of the `select` entity with the [voice activity detection sensitivity](https://github.com/home-assistant/core/blob/dev/homeassistant/components/assist_pipeline/vad.py) or `None`. |
| `tts_options` | <code>dict; None</code> | <code>None</code> | Options passed to the [text-to-speech system](https://www.home-assistant.io/integrations/tts/) when responding. |


## States

The state of an `AssistSatelliteEntity` follows its currently running [pipeline](/docs/voice/pipelines/). The `AssistSatelliteState` enum stores the possible states.

:::tip
You must call the `tts_response_finished` method on your entity when a text-to-speech response **has finished playing** to return to the `IDLE` state.
:::

| Constant     | Description                                                              |
|--------------|--------------------------------------------------------------------------|
| `IDLE`       | Device is waiting for user input, such as a wake word or a button press. |
| `LISTENING`  | Device is streaming audio with the voice command to Home Assistant.      |
| `PROCESSING` | Home Assistant is processing the voice command.                          |
| `RESPONDING` | Device is speaking the response.                                         |

## Supported features

Supported features are defined by using values in the `AssistSatelliteEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value      | Description                                       |
|------------|---------------------------------------------------|
| `ANNOUNCE` | Device supports remotely triggered announcements. Implement the `async_announce` method to play back the provided `media_id` from `AssistSatelliteAnnouncement`. This method should only return once the announcement has finished playing on the device. |
| `START_CONVERSATION` | Device supports remotely triggered conversations, which plays an announcement and then listens for one or more voices commands. Implement the `async_start_conversation` method to play back the provided `media_id` from `AssistSatelliteAnnouncement` and then listen for voice commands. This method should only return once the announcement has finished playing. |

## Methods

### Running a pipeline and handling events

Satellite entities should only run [Assist pipelines](/docs/voice/pipelines/) using the `async_accept_pipeline_from_satellite` method. [Events from the pipeline](/docs/voice/pipelines/#events) are handled by implementing the `on_pipeline_event` method.

The satellite entity's [state](#states) is automatically updated when a pipeline is run, with the exception of `RESPONDING` to `IDLE`. The `tts_response_finished` method must be called by the developer when the satellite has finished speaking the response on the device.

### Get configuration

The `async_get_configuration` method must return a (cached) `AssistSatelliteConfiguration`. If the entity must communicate with the device to retrieve the configuration, this should be during initialization.

A [websocket command](#getting-the-satellite-configuration) is available for getting an entity's configuration.

### Set configuration

The `async_set_configuration` method updates the device's configuration, and must only return once the device's and Home Assistant's `AssistSatelliteConfiguration` are synchronized.

A [websocket command](#setting-the-active-wake-words) is available for setting the active wake words.

### Announcements

If the device has the `ANNOUNCE` [supported feature](#supported-features), then the `async_announce` method should be implemented to announce the provided `media_id` within `AssistSatelliteAnnouncement`. If `preannouncement_media_id` is provided, it should be played before the `media_id`.
The `async_announce` method should only return when the announcement is finished playing on the device.

An [announce action](https://home-assistant.io/integrations/assist_satellite#action-assist_satelliteannounce) is available for automating announcements.

### Start Conversation

If the device has the `START_CONVERSATION` [supported feature](#supported-features), then the `async_start_conversation` method should be implemented to:

1. Announce `preannouncement_media_id` within `AssistSatelliteAnnouncement`, if provided
2. Announce the provided `media_id` within `AssistSatelliteAnnouncement`, then
3. Listen for one or more follow-up voice commands

The `async_start_conversation` method should only return when the announcement is finished playing on the device. The conversation will continue between the user and the satellite.

A [start conversation action](https://home-assistant.io/integrations/assist_satellite#action-assist_satellitestart_conversation) is available for automating conversations.

## WebSocket API

### Intercepting wake words

The integration offers a websocket API to intercept wake word detections and announce them to the user. This is used by the voice wizard to help the user onboard and get familiar with the wake word.

```json
{
  "type": "assist_satellite/intercept_wake_word",
  "entity_id": "assist_satellite.living_room"
}
```

The entity id must be of an Assist satellite entity which supports the `ANNOUNCE` feature.

Once a wake word is detected, a response is returned like:

```json
{
  "wake_word_phrase": "okay nabu"
}
```

### Getting the satellite configuration

The current configuration for the satellite, including available and active wake words, can get retrieved with:

```json
{
  "type": "assist_satellite/get_configuration",
  "entity_id": ENTITY_ID
}
```

A response will be returned like this:

```json
{
  "active_wake_words": [
    "1234"
  ],
  "available_wake_words": [
    {
      "id": "1234",
      "trained_languages": [
        "en"
      ],
      "wake_word": "okay nabu"
    },
    {
      "id": "5678",
      "trained_languages": [
        "en"
      ],
      "wake_word": "hey jarvis"
    }
  ],
  "max_active_wake_words": 1,
  "pipeline_entity_id": "select.pipeline_entity",
  "vad_entity_id": "select.vad_entity"
}
```

The `active_wake_words` list contains the ids of wake words from `available_wake_words`.

The `pipeline_entity_id` contains the id of the select entity which controls the pipeline that the device will run.
The `vad_entity_id` contains the id of the select entity with the voice activity detector (VAD) sensitivity level.


### Setting the active wake words

Set the active wake words using:

```json
{
  "type": "assist_satellite/set_wake_words",
  "entity_id": ENTITY_ID,
  "wake_word_ids": ["1234", "5678"]
}
```

The `wake_word_ids` must contain ids from the `available_wake_words` list from the `assist_satellite/get_configuration` command.
The size of `wake_word_ids` should also not exceed `max_active_wake_words`.
