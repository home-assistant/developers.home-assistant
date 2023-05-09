---
title: "Assist Pipelines"
---

The [Assist pipeline](https://www.home-assistant.io/integrations/assist_pipeline) integration runs the common steps of a voice assistant:

1. Speech to text
2. Intent recognition
3. Text to speech

Pipelines are run via a WebSocket API:

```json
{
  "type": "assist_pipeline/run",
  "start_stage": "stt",
  "end_stage": "tts",
  "input": {
    "sample_rate": 16000,
  }
}
```

The following input fields are available:

| Name              | Type   | Description                                                                                 |
|-------------------|--------|---------------------------------------------------------------------------------------------|
| `start_stage` | enum   | Required. The first stage to run. One of `stt`, `intent`, `tts`. |
| `end_stage`   | enum   | Required. The last stage to run. One of `stt`, `intent`, `tts`. |
| `input`       | dict   | Depends on `start_stage`. For STT, the dictionary should contain a key `sample_rate` with an integer value. For intent and TTS, the key `text` should contain the input text.
| `pipeline` | string | Optional. ID of the pipeline (use `assist_pipeline/pipeline/list` to get names). |
| `conversation_id` | string | Optional. [Unique id for conversation](/docs/intent_conversation_api#conversation-id).      |
| `timeout`         | number | Optional. Number of seconds before pipeline times out (default: 30).                        |

## Events

As the pipeline runs, it emits events back over the WebSocket connection.
The following events can be emitted:

| Name            | Description                 | Emitted    | Attributes                                                                                              |
|-----------------|-----------------------------|------------|---------------------------------------------------------------------------------------------------------|
| `run-start`     | Start of pipeline run       | always     | `pipeline` - ID of the pipeline<br />`language` - Language used for pipeline<br />`runner_data` - Extra WebSocket data: <ul><li>`stt_binary_handler_id` is the prefix to send speech data over.</li><li>`timeout` is the max run time for the whole pipeline.</li></ul>                         |
| `run-finish`    | End of pipeline run         | always     |                                                                                                         |
| `stt-start`     | Start of speech to text     | audio only | `engine`: STT engine used<br />`metadata`: incoming audio metadata
| `stt-finish`    | End of speech to text       | audio only | `stt_output` - Object with `text`, the detected text.
| `intent-start`  | Start of intent recognition | always     | `engine` - [Agent](/docs/intent_conversation_api) engine used<br />`language`: Processing language. <br/ > `intent_input` - Input text to agent |
| `intent-finish` | End of intent recognition   | always     | `intent_output` - [conversation response](/docs/intent_conversation_api#conversation-response)          |
| `tts-start`     | Start of text to speech     | audio only | `engine` - TTS engine used<br />`language`: Output language.<br />`voice`: Output voice. <br />`tts_input`: Text to speak. |
| `tts-finish`    | End of text to speech       | audio only | `media_id` - Media Source ID of the generated audio<br />`url` - URL to the generated audio<br />`mime_type` - MIME type of the generated audio<br /> |
| `error`         | Error in pipeline           | On error     | `code` - Error code<br />`message` - Error message |

