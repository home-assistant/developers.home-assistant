---
title: "Firing intents"
---

When you fire an intent, you will get a response back or an error will be raised. It is up to the component to return the result to the user.

Example code to handle an intent in Home Assistant.

```python
from homeassistant.helpers import intent

intent_type = "TurnLightOn"
slots = {"entity": {"value": "Kitchen"}}

try:
    intent_response = yield from intent.async_handle(
        hass, "example_component", intent_type, slots
    )

except intent.UnknownIntent as err:
    _LOGGER.warning("Received unknown intent %s", intent_type)

except intent.InvalidSlotInfo as err:
    _LOGGER.error("Received invalid slot data: %s", err)

except intent.IntentError:
    _LOGGER.exception("Error handling request for %s", intent_type)
```

The intent response is an instance of `homeassistant.helpers.intent.IntentResponse`.

| Name | Type | Description |
| ---- | ---- | ----------- |
| `intent` | Intent | Instance of intent that triggered response. |
| `speech` | Dictionary | Speech responses. Each key is a type. Allowed types are `plain` and `ssml`. |
| `card` | Dictionary | Card responses. Each key is a type. |

Speech dictionary values:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `speech` | String | The text to say
| `extra_data` | Any | Extra information related to this speech.

Card dictionary values:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `title` | String | The title of the card
| `content` | Any | The content of the card
