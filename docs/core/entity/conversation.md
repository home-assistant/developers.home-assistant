---
title: Conversation entity
sidebar_label: Conversation
---

A conversation entity allows users to converse with Home Assistant.

A conversation entity is derived from the  [`homeassistant.components.conversation.ConversationEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/conversation/entity.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests).
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| supported_languages | `list[str]` \| `Literal["*"]` | **Required** | The supported languages of the service. Return `"*"` if you support all.

## Supported features

Supported features are defined by using values in the `ConversationEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value                      | Description
| -------------------------- | -------------------------------------------------------------------------------------------
| `CONTROL`       | The entity is able to control Home Assistant.

## Methods

### Process

This method is used to process an incoming chat message.

```python
class MyConversationEntity(ConversationEntity):
    """Represent a conversation entity."""

    async def async_process(self, user_input: ConversationInput) -> ConversationResult:
        """Process a sentence."""
        response = intent.IntentResponse(language=user_input.language)
        response.async_set_speech("Test response")
        return agent.ConversationResult(
            conversation_id=None,
            response=response
        )
```

A `ConversationInput` object contains the following data:

| Name | Type | Description
| ---- | ---- | -----------
| `text` | `str` | User input
| `context` | `Context` | HA context to attach to actions in HA
| `conversation_id` | `Optional[str]` | Can be used to track a multi-turn conversation. Return None if not supported
| `language` | `str` | Language of the text. If user did not provide one, it's set to the HA configured language.

### Prepare

As soon as Home Assistant knows a request is coming in, we will let the conversation entity prepare for it. This can be used to load a language model or other resources. This function is optional to implement.

```python
class MyConversationEntity(ConversationEntity):
    """Represent a conversation entity."""

    async def async_prepare(self, language: str | None = None) -> None:
        """Prepare a language for processing."""
```
