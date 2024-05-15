---
title: "LLM Tools Invocation"
---

LLM tools extend the functionality of LLM integrations such as OpenAI Conversation, Google Generative AI, and others.

All [Intents](/docs/intent_index) are automatically registered as LLM tools.

This documentation is for LLM integrations developers.

## Tool

The `llm.Tool` class has the following attributes:

| Name                | Type       | Description                                                                                                    |
|---------------------|------------|----------------------------------------------------------------------------------------------------------------|
| `name`              | string     | The name of the tool. Required.                                                                                |
| `description`       | string     | Description of the tool to help the LLM understand when and how it should be called. Optional but recommended. |
| `parameters`        | vol.Schema | The voluptuous schema of the parameters. Defaults to vol.Schema({})                                            |

The `llm.Tool` class has the following methods:

#### `async_call`
Perform the actual operation of the tool when called by the LLM. This must be an async method. Its arguments are `hass` and an instance of `llm.ToolInput`.

Response data must be a dict and serializable in JSON [`homeassistant.util.json.JsonObjectType`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/util/json.py).

Errors must be raised as `HomeAssistantError` exceptions (or its subclasses). The response data should not contain error codes used for error handling.

The `ToolInput` has following attributes:

| Name              | Type    | Description                                                                                             |
|-------------------|---------|---------------------------------------------------------------------------------------------------------|
| `tool_name`       | string  | The name of the tool being called                                                                       |
| `tool_args`       | dict    | The arguments provided by the LLM. The arguments are converted and validated using `parameters` schema. |
| `platform`        | string  | The DOMAIN of the conversation agent using the tool                                                     |
| `context`         | Context | The `homeassistant.core.Context` of the conversation                                                    |
| `user_prompt`     | string  | The raw text input that initiated the tool call                                                         |
| `language`        | string  | The language of the conversation agent, or "*" for any language                                         |
| `assistant`       | string  | The assistant name used to control exposed entities. Currently only `conversation` is supported.        |

## Getting available tools

You can get the currently registered tools with `homeassistant.helpers.llm.async_get_tools(hass)`.

If need the tool specification in OpenAPI-compatible format, you can use `voluptuous_openapi.convert` function (don't forget to mention the dependency in your `manifest.json` file).

Example:
```python
from voluptuous_openapi import convert
from homeassistant.helpers import llm
...
        tools = [
            {
                "name": tool.name,
                "description": tool.description,
                "parameters": convert(tool.parameters),
            }
            for tool in llm.async_get_tools(self.hass)
        ]
```

Refer to the LLM API specification for the correct format.

## Calling the tool

When the LLM response indicates it wants to call a tool, you need to prepare the `llm.ToolInput` object, then execute the `llm.async_call_tool` function.

Example:

```python
from homeassistant.components import conversation
from homeassistant.helpers import llm

class MyConversationEntity(
    conversation.ConversationEntity, conversation.AbstractConversationAgent
):
    """Represent a conversation entity."""

    async def async_process(
        self, user_input: conversation.ConversationInput
    ) -> conversation.ConversationResult:
        """Process a sentence."""

        while True:
            response = ... # Get response from your LLM. Include available tools and the results of previous tool calls
            if not response.tool_calls:
                break

            for tool_call in response.tool_calls:
                LOGGER.info(
                    "Tool call: %s(%s)",
                    tool_call.function.name,
                    tool_call.function.arguments,
                )
                tool_input = llm.ToolInput(
                    tool_name=tool_call.function.name,
                    tool_args=json.loads(tool_call.function.arguments),
                    platform=DOMAIN,
                    context=user_input.context,
                    user_prompt=user_input.text,
                    language=user_input.language,
                    assistant=conversation.DOMAIN,
                )
                try:
                    tool_response = await llm.async_call_tool(
                        self.hass, tool_input
                    )
                except (HomeAssistantError, vol.Invalid) as e:
                    tool_response = {"error": type(e).__name__}
                    if str(e):
                        tool_response["error_text"] = str(e)

                LOGGER.info("Tool response: %s", tool_response)
```
