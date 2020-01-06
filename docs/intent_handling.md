---
title: "Handling intents"
---

Any component can register to handle intents. This allows a single component to handle intents fired from multiple voice assistants.

A component has to register an intent handler for each type that it wants to handle. Intent handlers have to extend `homeassistant.helpers.intent.IntentHandler`

```python
import asyncio
from homeassistant.helpers import intent

DATA_KEY = "example_key"


@asyncio.coroutine
def async_setup(hass, config):
    hass.data[DATA_KEY] = 0
    intent.async_register(hass, CountInvocationIntent())


class CountInvocationIntent(intent.IntentHandler):
    """Handle CountInvocationIntent intents."""

    # Type of intent to handle
    intent_type = "CountInvocationIntent"

    # Optional. A validation schema for slots
    # slot_schema = {
    #     'item': cv.string
    # }

    @asyncio.coroutine
    def async_handle(self, intent_obj):
        """Handle the intent."""
        intent_obj.hass.data[DATA_KEY] += 1

        response = intent_obj.create_response()
        response.async_set_speech(
            f"This intent has been invoked {intent_obj.hass.data[DATA_KEY]} times"
        )
        return response
```
