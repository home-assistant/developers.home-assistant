---
title: "Assist pipelines"
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
| `start_stage`     | enum   | Required. The first stage to run. One of `wake_word`, `stt`, `intent`, `tts`.                                                                                                                                                                                                                        |
| `end_stage`       | enum   | Required. The last stage to run. One of `stt`, `intent`, `tts`.                                                                                                                                                                                                                                |
| `input`           | dict   | Depends on `start_stage`: <ul><li>`wake_word` only:<ul><li>`timeout` - seconds before wake word detection times out (int, default: 3)</li><li>`noise_suppression_level` - amount of noise suppression (int, 0 = disabled, 4 = max)</li><li>`auto_gain_dbfs` - automatic gain (int, 0 = disabled, 31 = max)</li><li>`volume_multiplier` - fixed volume amplification (float, 1.0 = no change, 2.0 = twice as loud)</li></ul></li><li>`wake_word` and `stt`:<ul><li>`sample_rate` - sample rate of incoming audio (int, hertz)</li></ul></li><li>`intent` and `tts`:<ul><li>`text` - input text (string)</li></ul></li></ul> |
| `pipeline`        | string | Optional. ID of the pipeline (use `assist_pipeline/pipeline/list` to get names).                                                                                                                                                                                                               |
| `conversation_id` | string | Optional. [Unique id for conversation](/docs/intent_conversation_api#conversation-id).                                                                                                                                                                                                         |
| `device_id`         | string | Optional. Device ID from Home Assistant's device registry of the device that is starting the pipeline.                                                                                                                                                                                                                           |
| `timeout`         | number | Optional. Number of seconds before pipeline times out (default: 300).                                                                                                                                                                                                                           |

## Events

As the pipeline runs, it emits events back over the WebSocket connection.
The following events can be emitted:

| Name           | Description                  | Emitted    | Attributes                                                                                                                                                                                                                                                              |
|----------------|------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `run-start`    | Start of pipeline run        | always     | `pipeline` - ID of the pipeline<br />`language` - Language used for pipeline<br />`runner_data` - Extra WebSocket data: <ul><li>`stt_binary_handler_id` is the prefix to send speech data over.</li><li>`timeout` is the max run time for the whole pipeline.</li></ul><br />`tts_output` - TTS Output data<ul><li>`token` - Token of the generated audio</li><li>`url` - URL to the generated audio</li><li>`mime_type` - MIME type of the generated audio</li><li>`stream_response` - If TTS can stream while the response is being generated.</li></ul> |
| `run-end`      | End of pipeline run          | always     |                                                                                                                                                                                                                                                                         |
| `wake_word-start`   | Start of wake word detection | audio only | `engine`: wake engine used<br />`metadata`: incoming audio<br />`timeout`: seconds before wake word timeout metadata                                                                                                                                                                                                     |
| `wake_word-end`     | End of wake word detection   | audio only | `wake_word_output` - Detection result data: <ul><li>`wake_word_id` is the id of detected wake word</li><li>`timestamp` is the detection time relative to start of audio stream (milliseconds, optional)</li></ul>                                                                             |
| `stt-start`    | Start of speech to text      | audio only | `engine`: STT engine used<br />`metadata`: incoming audio metadata                                                                                                                                                                                                      |
| `stt-vad-start`    | Start of voice command      | audio only | `timestamp`: time relative to start of audio stream (milliseconds)
| `stt-vad-end`    | End of voice command      | audio only | `timestamp`: time relative to start of audio stream (milliseconds)
| `stt-end`      | End of speech to text        | audio only | `stt_output` - Object with `text`, the detected text.                                                                                                                                                                                                                   |
| `intent-start` | Start of intent recognition  | always     | `engine` - [Agent](/docs/intent_conversation_api) engine used<br />`language`: Processing language. <br /> `intent_input` - Input text to agent                                                                                                                         |
| `intent-progress`   | Intermediate update of intent recognition    | depending on conversation agent     | `chat_log_delta` - optional, delta object from the [chat log](/docs/core/entity/conversation#chat-log) <br > `tts_start_streaming` - optional, True if TTS streaming has started                                                                                                                                                                          |
| `intent-end`   | End of intent recognition    | always     | `intent_output` - [conversation response](/docs/intent_conversation_api#conversation-response)                                                                                                                                                                          |
| `tts-start`    | Start of text to speech      | audio only | `engine` - TTS engine used<br />`language`: Output language.<br />`voice`: Output voice. <br />`tts_input`: Text to speak.                                                                                                                                              |
| `tts-end`      | End of text to speech        | audio only | `token` - Token of the generated audio<br />`url` - URL to the generated audio<br />`mime_type` - MIME type of the generated audio<br />                                                                                                                   |
| `error`        | Error in pipeline            | on error   | `code` - Error code ([see below](#error-codes))<br />`message` - Error message                                                                                                                                                                                                                      |

## Error codes

The following codes are returned from the pipeline `error` event:

* `wake-engine-missing` - No wake word engine is installed
* `wake-provider-missing` - Configured wake word provider is not available
* `wake-stream-failed` - Unexpected error during wake word detection
* `wake-word-timeout` - Wake word was not detected within timeout
* `stt-provider-missing` - Configured speech-to-text provider is not available
* `stt-provider-unsupported-metadata` - Speech-to-text provider does not support audio format (sample rate, etc.)
* `stt-stream-failed` - Unexpected error during speech-to-text
* `stt-no-text-recognized` - Speech-to-text did not return a transcript
* `intent-not-supported` - Configured conversation agent is not available
* `intent-failed` - Unexpected error during intent recognition
* `tts-not-supported` - Configured text-to-speech provider is not available or options are not supported
* `tts-failed` - Unexpected error during text-to-speech


## Sending speech data

After starting a pipeline with `stt` as the first stage of the run and receiving a `stt-start` event, speech data can be sent over the WebSocket connection as binary data. Audio should be sent as soon as it is available, with each chunk prefixed with a byte for the `stt_binary_handler_id`.

For example, if `stt_binary_handler_id` is `1` and the audio chunk is `a1b2c3`, the message would be (in hex):

```
stt_binary_handler_id
||
01a1b2c3
  ||||||
   audio
```

To indicate the end of sending speech data, send a binary message containing a single byte with the `stt_binary_handler_id`.

## Wake word detection

When `start_stage` is set to `wake_word`, the pipeline will not run until a wake word has been detected. Clients should avoid unnecessary audio streaming by using a local voice activity detector (VAD) to only start streaming when human speech is detected.

For `wake_word`, the `input` object should contain a `timeout` float value. This is the number of seconds of silence before the pipeline will time out during wake word detection (error code `wake-word-timeout`).
If enough speech is detected by Home Assistant's internal VAD, the timeout will be continually reset.

### Audio enhancements

The following settings are available as part of the `input` object when `start_stage` is set to `wake_word`:

* `noise_suppression_level` - level of noise suppression (0 = disabled, 4 = max)
* `auto_gain_dbfs` - automatic gain control (0 = disabled, 31 = max)
* `volume_multiplier` - audio samples multiplied by constant (1.0 = no change, 2.0 = twice as loud)

If your device's microphone is fairly quiet, the recommended settings are:

* `noise_suppression_level` - 2
* `auto_gain_dbfs` - 31
* `volume_multiplier` - 2.0

Increasing `noise_suppression_level` or `volume_multiplier` may cause audio distortion.
