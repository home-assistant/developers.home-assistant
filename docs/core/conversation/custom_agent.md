---
title: Conversation Agent
---

The conversation integration offers a standardized API for users to use human speech to interact with Home Assistant. The actual processing of human speech is handled by a conversation agent.

The integration provides a default conversation agent that uses our own [intent recognizer](../../voice/intent-recognition) and [intent handlers](../../intent_index).

## Creating a custom conversation agent

It is possible for integrations to provide a custom conversation agent. The `async_process` method takes a `ConversationInput` object that contains the following data:

| Name | Type | Description
| ---- | ---- | -----------
| `text` | `str` | User input
| `context` | `Context` | HA context to attach to actions in HA
| `conversation_id` | `Optional[str]` | Can be used to track a multi-turn conversation. Return None if not supported
| `language` | `str` | Language of the text. If user did not provide one, it's set to the HA configured language.

```python
from homeassistant.helpers import intent
from homeassistant.components.conversation import agent


async def async_setup(hass, config):
    """Initialize your integration."""
    conversation.async_set_agent(hass, MyConversationAgent())


class MyConversationAgent(agent.AbstractConversationAgent):

    @property
    def attribution(self) -> agent.Attribution:
        """Return the attribution."""
        return {
            "name": "My Conversation Agent",
            "url": "https://example.com",
        }

    @abstractmethod
    async def async_process(self, user_input: agent.ConversationInput) -> agent.ConversationResult:
        """Process a sentence."""
        response = intent.IntentResponse(language=user_input.language)
        response.async_set_speech("Test response")
        return agent.ConversationResult(
            conversation_id=None,
            response=response
        )
```
