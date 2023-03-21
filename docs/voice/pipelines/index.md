---
title: "Pipelines"
---

A pipeline runs the common steps of a [voice assistant](https://next.home-assistant.io/integrations/voice_assistant):

1. Speech to text
2. Intent recognition
3. Text to speech

Pipelines are run via a WebSocket API:

```json
{
  "type": "voice_assistant/run",
  "language": "en-US"
}
```

The following input fields are available:

| Name              | Type   | Description                                                                            |
|-------------------|--------|----------------------------------------------------------------------------------------|
| `intent_input`    | string | Required. Input text to process.                                                       |
| `language`        | string | Optional. Language of pipeline to run (default: configured language).                  |
| `pipeline`        | string | Optional. Name of a pipeline to run (default: use language).                           |
| `conversation_id` | string | Optional. [Unique id for conversation](/docs/intent_conversation_api#conversation-id). |
| `timeout`         | number | Optional. Number of seconds before pipeline times out (default: 30).                   |

## Events

As the pipeline runs, it emits events back over the WebSocket connection.
The following events can be emitted:

| Name            | Description                 | Emitted    | Attributes                                                                                              |
|-----------------|-----------------------------|------------|---------------------------------------------------------------------------------------------------------|
| `run-start`     | Start of pipeline run       | always     | `pipeline` - Id of pipeline<br />`language` - Language used for pipeline<br />                        |
| `run-finish`    | End of pipeline run         | always     |                                                                                                         |
| `intent-start`  | Start of intent recognition | always     | `engine` - [Agent](/docs/intent_conversation_api) engine used<br />`intent_input` - Input text to agent |
| `intent-finish` | End of intent recognition   | always     | `intent_output` - [conversation response](/docs/intent_conversation_api#conversation-response)          |
| `tts-start`     | Start of text to speech     | audio only | `tts_input` - text to speak                                                                             |
| `tts-finish`    | End of text to speech       | audio only | `tts_otuput` - URL of spoken audio                                                                      |

