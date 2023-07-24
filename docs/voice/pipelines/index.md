---
title: "Assist Pipelines"
---

The [Assist pipeline](https://www.home-assistant.io/integrations/assist_pipeline) integration runs the common steps of a voice assistant:

1. Wake word detection
2. Speech to text
3. Intent recognition
4. Text to speech

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

| Name              | Type   | Description                                                                                                                                                                                                                                                                                    |
|-------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `start_stage`     | enum   | Required. The first stage to run. One of `wake` `stt`, `intent`, `tts`.                                                                                                                                                                                                                        |
| `end_stage`       | enum   | Required. The last stage to run. One of `stt`, `intent`, `tts`.                                                                                                                                                                                                                                |
| `input`           | dict   | Depends on `start_stage`: <ul><li>For wake, the dictionary should contain `timeout` key with a float value.</li><li>For wake/STT, the dictionary should contain a key `sample_rate` with an integer value.</li><li>For intent and TTS, the key `text` should contain the input text.</li></ul> |
| `pipeline`        | string | Optional. ID of the pipeline (use `assist_pipeline/pipeline/list` to get names).                                                                                                                                                                                                               |
| `conversation_id` | string | Optional. [Unique id for conversation](/docs/intent_conversation_api#conversation-id).                                                                                                                                                                                                         |
| `timeout`         | number | Optional. Number of seconds before pipeline times out (default: 30).                                                                                                                                                                                                                           |

## Events

As the pipeline runs, it emits events back over the WebSocket connection.
The following events can be emitted:

| Name           | Description                  | Emitted    | Attributes                                                                                                                                                                                                                                                              |
|----------------|------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `run-start`    | Start of pipeline run        | always     | `pipeline` - ID of the pipeline<br />`language` - Language used for pipeline<br />`runner_data` - Extra WebSocket data: <ul><li>`stt_binary_handler_id` is the prefix to send speech data over.</li><li>`timeout` is the max run time for the whole pipeline.</li></ul> |
| `run-end`      | End of pipeline run          | always     |                                                                                                                                                                                                                                                                         |
| `wake-start`   | Start of wake word detection | audio only | `engine`: wake engine used<br />`metadata`: incoming audio metadata                                                                                                                                                                                                     |
| `wake-end`     | End of wake word detection   | audio only | `wake_output` - Detection result data: <ul><li>`ww_id` is the id of detected wake word</li><li>`timestamp` is the detection time relative to start of audio stream (milliseconds, optional)</li></ul>                                                                             |
| `stt-start`    | Start of speech to text      | audio only | `engine`: STT engine used<br />`metadata`: incoming audio metadata                                                                                                                                                                                                      |
| `stt-end`      | End of speech to text        | audio only | `stt_output` - Object with `text`, the detected text.                                                                                                                                                                                                                   |
| `intent-start` | Start of intent recognition  | always     | `engine` - [Agent](/docs/intent_conversation_api) engine used<br />`language`: Processing language. <br /> `intent_input` - Input text to agent                                                                                                                         |
| `intent-end`   | End of intent recognition    | always     | `intent_output` - [conversation response](/docs/intent_conversation_api#conversation-response)                                                                                                                                                                          |
| `tts-start`    | Start of text to speech      | audio only | `engine` - TTS engine used<br />`language`: Output language.<br />`voice`: Output voice. <br />`tts_input`: Text to speak.                                                                                                                                              |
| `tts-end`      | End of text to speech        | audio only | `media_id` - Media Source ID of the generated audio<br />`url` - URL to the generated audio<br />`mime_type` - MIME type of the generated audio<br />                                                                                                                   |
| `error`        | Error in pipeline            | On error   | `code` - Error code<br />`message` - Error message                                                                                                                                                                                                                      |

## Sending speech data

After starting a pipeline with `stt` as the first stage of the run and receiving a `stt-start` event, speech data can be sent over the WebSocket connection as binary data. Audio should be sent as soon as it is available, with each chunk prefixed with a byte for the `stt_binary_handler_id`.

For example, if `stt_binary_handler_id` is `1` and the audio chunk is `a1b2c3`, the message would be (in hex):

```
01a1b2c3
```

To indicate the end of sending speech data, send a binary message containing a single byte with the `stt_binary_handler_id`.

## Wake word detection

When `start_stage` is set to `wake`, the pipeline will not run until a wake word has been detected. Clients should avoid unnecessary audio streaming by using a local voice activity detector (VAD) to only start streaming when human speech is detected.

For `wake`, the `input` object should contain a `timeout` float value. This is the number of seconds of silence before the pipeline will time out during wake word detection (error code `wake-word-timeout`).
If enough speech is detected by Home Assistant's internal VAD, the timeout will be continually reset.
