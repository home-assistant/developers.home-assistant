---
title: "Registering sentences"
---

The conversation component handles incoming commands from the frontend and converts them to intents. It does this based on registered sentences.

As a component, you can register sentences with the conversation component to allow it to be remote controlled. Refer to named slots by putting the slot name between curly braces: `{item}`. Use square brackets around (partial) words to mark them as optional.

Example code:

```python
async def async_setup(hass, config):
    hass.components.conversation.async_register('MyCoolIntent', [
        'I think that {object} is [very] cool',
        'Nothing is cooler than {object}'
    ])
```

If a sentence like "I think that beer is cool" comes in, the conversation component will generate an intent of type `MyCoolIntent` and with 1 slot, named `object` and value `beer`.