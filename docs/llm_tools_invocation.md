---
title: "LLM Tools Invocation"
---

If you are developing an LLM integration and want to add support of LLM Tools invocation, then here are the steps to do that.

## Step 0. Register the `intent` component.

The intents are also automatically registered as LLM tools. However in order to do so, the `intent` component must be loaded. It does not happen automatically, so it is recommended to make sure it is loaded before using the tools for the first time.

```python
from homeassistant import setup
...
        if "intent" not in self.hass.config.components:
            await setup.async_setup_component(self.hass, "intent", {})
```

## Step 1. Get available tools

You can get the currently registered tools with `homeassistant.helpers.llm.async_get_tools(hass)`:

```python
from homeassistant.helpers import llm
...
        tools = list(llm.async_get_tools(self.hass))
```

## Step 2. Format the tool schema

You need to pass the list of available tools to the LLM. Refer to the LLM API for the correct format to do that. You would probably need the tool specification in OpenAPI-compatible format. To get that, you can use `voluptuous_openapi.convert` function (don't forget to mention the dependency in your `manifest.json` file). Simplest example:

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

You may need some additional processing.

Pass the list to your LLM according to the API specification.

## Step 3. Call the tool

When the LLM response indicates it wants to call a tool, you need to prepare the `llm.ToolInput` object, then execute the `llm.async_call_tool` function.

Example:

```python
from homeassistant.helpers import llm
...
                    LOGGER.info(
                        "Tool call: %s(%s)",
                        tool_call.function.name,
                        tool_call.function.arguments,
                    )
                    try:
                        tool_input = llm.ToolInput(
                            tool_name=tool_call.function.name,
                            tool_args=json.loads(tool_call.function.arguments),
                            platform=DOMAIN,
                            context=user_input.context,
                            user_prompt=user_input.text,
                            language=user_input.language,
                            agent_id=self.entity_id,
                            conversation_id=user_input.conversation_id,
                            device_id=user_input.device_id,
                            assistant=conversation.DOMAIN,
                        )
                        function_response = await llm.async_call_tool(
                            self.hass, tool_input
                        )
                    except Exception as e:  # pylint: disable=broad-exception-caught
                        function_response = {"error": type(e).__name__}
                        if str(e):
                            function_response["error_text"] = str(e)

                    LOGGER.info("Tool response: %s", function_response)
```

## Step 4. Provide the response

Add the tool results to the LLM inputs as per the API specification and continue to the next iteration.
