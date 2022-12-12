---
title: "Conversation API"
sidebar_label: "Conversation API"
---

Intents can be recognized from text and fired using the [conversation integration](https://www.home-assistant.io/integrations/conversation/).

An HTTP API endpoint is available at `/api/conversation/process`, which receives an [input sentence](#input-sentence) and produces an [intent response](#intent-response).

## Input Sentence

A sentence may be POST-ed to `/api/conversation/process` like:

```json
{
  "text": "turn on the lights in the living room",
  "language": "en"
}
```

The following input fields are available:

| Name              | Type   | Description                                                                                         |
|-------------------|--------|-----------------------------------------------------------------------------------------------------|
| `text`            | string | Input sentence.                                                                                     |
| `language`        | string | Optional. Language of the input sentence (defaults to configured language).                         |
| `conversation_id` | string | Optional. Unique id to [track conversation](#conversation-id) across multiple inputs and responses. |


## Conversation Id

Conversations are tracked by a unique id generated from within Home Assistant. To continue a conversation, retrieve the `conversation_id` from the first [intent response](#intent-response) and add it to the next [input sentence](#input-sentence).


## Intent Response

The response from `/api/conversation/process` contains information about the effect of the fired intent, for example:

```json
{
  "response_type": "action_done",
  "language": "en",
  "data": {
    "targets": [
      {
        "type": "area",
        "name": "Living Room"
        "id": "living_room"
      },
      {
        "type": "domain",
        "name": "light"
      }
    ]
  },
  "speech": {
    "plain": {
      "speech": "Turned Living Room lights on"
    }
  }
}
```

The following properties are available in the response:

| Name              | Type       | Description                                                                                         |
|-------------------|------------|-----------------------------------------------------------------------------------------------------|
| `response_type`   | string     | One of `action_done`, `query_answer`, or `error` (see [response types](#response-types)).           |
| `data`            | dictionary | Relevant data for each [response type](#response_types).                                            |
| `language`        | string     | Optional. The language of the intent and response.                                                  |
| `speech`          | dictionary | Optional. Response text to speak to the user (see [speech](#speech)).                               |
| `conversation_id` | string     | Optional. Unique id to [track conversation](#conversation-id) across multiple inputs and responses. |


## Response Types

### Action Done

The intent produced an action in Home Assistant, such as turning on a light. The `data` property of the response contains a `targets` list, where each target looks like:

| Name   | Type   | Description                                                                            |
|--------|--------|----------------------------------------------------------------------------------------|
| `type` | string | Target type. One of `area`, `domain`, `device_class`, `device`, `entity`, or `custom`. |
| `name` | string | Name of the affected target.                                                           |
| `id`   | string | Optional. Id of the target.                                                            |

Targets must be ordered from general to specific:

* `area`
* `domain`
* `device_class`
* `device`
* `entity`


### Query Answer

The response is an answer to a question, such as "what is the temperature?". See the [speech](#speech) property for the answer text.

```json
{
  "response_type": "query_answer",
  "language": "en",
  "speech": {
    "plain": {
      "speech": "It is 65 degrees"
    }
  }
}
```


### Error

An error occurred either during intent recognition or handling. See `data.code` for the specific type of error, and the [speech](#speech) property for the error message.

```json
{
  "response_type": "error",
  "language": "en",
  "data": {
    "code": "no_intent_match"
  },
  "speech": {
    "plain": {
      "speech": "Sorry, I didn't understand that"
    }
  }
}
```

`data.code` can be one of:

* `no_intent_match` - The input text did not match any intents.
* `no_valid_targets` - The targeted area, device, or entity does not exist.
* `failed_to_handle` - An unexpected error occurred while handling the intent.


## Speech

The spoken response to the user is provided in the `speech` property of the response. It can either be plain text (the default), or [SSML](https://www.w3.org/TR/speech-synthesis11/).

For plain text speech, the response will look like:

```json
{
  "response_type": "...",
  "speech": {
    "plain": {
      "speech": "...",
      "extra_data": null
    }
  }
}
```

If the speech is [SSML](https://www.w3.org/TR/speech-synthesis11/), it will instead be:

```json
{
  "response_type": "...",
  "speech": {
    "ssml": {
      "speech": "...",
      "extra_data": null
    }
  }
}
```
