---
title: "Home Assistant API for Large Language Models"
sidebar_label: "LLM API"
---

Home Assistant can interact with large language models (LLMs). By exposing a Home Assistant API to an LLM, the LLM can fetch data or control Home Assistant to better assist the user. Home Assistant comes with a built-in LLM API, but custom integrations can register their own to provide more advanced functionality.

## Built-in Assist API

Home Assistant has a built-in API which exposes the Assist API to LLMs. This API allows LLMs to interact with Home Assistant via [intents](../../intent_builtin), and can be extended by registering intents.

The Assist API is equivalent to the capabilities and exposed entities that are also accessible to the built-in conversation agent. No administrative tasks can be performed.

## Supporting LLM APIs

The LLM API needs to be integrated in two places in your integration. Users need to be able to configure which APIs should be used, and the tools offered by the APIs should be passed to the LLM when interacting with it.

### Options flow

The chosen API should be stored in the config entry options. It should hold a string or list of selected API IDs, if any. If no API is selected, the key must be omitted.

In your options flow, you should offer a selector to the user to pick which API should be used.

```python
from types import MappingProxyType

from homeassistant.const import CONF_LLM_HASS_API
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import llm
from homeassistant.helpers.selector import (
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
)


@callback
def async_get_options_schema(
    hass: HomeAssistant,
    options: MappingProxyType[str, Any],
) -> vol.Schema:
    """Return the options schema."""
    apis: list[SelectOptionDict] = [
        SelectOptionDict(
            label=api.name,
            value=api.id,
        )
        for api in llm.async_get_apis(hass)
    ]

    return vol.Schema(
        {
            vol.Optional(
                CONF_LLM_HASS_API,
                description={"suggested_value": options.get(CONF_LLM_HASS_API)},
            ): SelectSelector(SelectSelectorConfig(options=apis, multiple=True)),
        }
    )
```


### Fetching tools

When interacting with the LLM, the provided `ChatLog` will make any selected tools available from the selected API and the conversation entity should pass them to the LLM together with the extra prompt provided by the API.

```python
from homeassistant.const import CONF_LLM_HASS_API
from homeassistant.core import HomeAssistant, callback
from homeassistant.components import conversation
from homeassistant.helpers import intent, llm


class MyConversationEntity(conversation.ConversationEntity):

    def __init__(self, entry: ConfigEntry) -> None:
        """Initialize the agent."""
        self.entry = entry

    ...

    async def _async_handle_message(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> conversation.ConversationResult:
        """Call the API."""

        try:
            await chat_log.async_provide_llm_data(
                user_input.as_llm_context(DOMAIN),
                self.entry.options.get(CONF_LLM_HASS_API),
                self.entry.options.get(CONF_PROMPT),
                user_input.extra_system_prompt,
            )
        except conversation.ConverseError as err:
            return err.as_conversation_result()

        tools: list[dict[str, Any]] | None = None
        if chat_log.llm_api:
            tools = [
                _format_tool(tool)  # TODO format the tools as your LLM expects
                for tool in chat_log.llm_api.tools
            ]

        messages = [
            m
            for content in chat_log.content
            for m in _convert_content(content)  # TODO format messages
        ]

        # Interact with LLM and pass tools
        request = user_input.text
        for _iteration in range(10):
            response = ... # Send request to LLM and get streaming response

            messages.extend(
                [
                    _convert_content(content)  # TODO format messages
                    async for content in chat_log.async_add_delta_content_stream(
                        user_input.agent_id, _transform_stream(response)  # TODO call tools and stream responses
                    )
                ]
            )

            if not chat_log.unresponded_tool_results:
                break

        # Send the final response to the user
        intent_response = intent.IntentResponse(language=user_input.language)
        intent_response.async_set_speech(chat_log.content[-1].content or "")
        return conversation.ConversationResult(
            response=intent_response,
            conversation_id=chat_log.conversation_id,
            continue_conversation=chat_log.continue_conversation,
        )
```

## Creating your own API

To create your own API, you need to create a class that inherits from `API` and implement the `async_get_tools` method. The `async_get_tools` method should return a list of `Tool` objects that represent the functionality that you want to expose to the LLM.

### Tools

The `llm.Tool` class represents a tool that can be called by the LLM.

```python
from homeassistant.core import HomeAssistant
from homeassistant.helper import llm
from homeassistant.util import dt as dt_util
from homeassistant.util.json import JsonObjectType


class TimeTool(llm.Tool):
    """Tool to get the current time."""

    name = "GetTime"
    description: "Returns the current time."

    # Optional. A voluptuous schema of the input parameters.
    parameters = vol.Schema({
      vol.Optional('timezone'): str,
    })

    async def async_call(
        self, hass: HomeAssistant, tool_input: ToolInput, llm_context: LLMContext
    ) -> JsonObjectType:
        """Call the tool."""
        if "timezone" in tool_input.tool_args:
            tzinfo = dt_util.get_time_zone(tool_input.tool_args["timezone"])
        else:
            tzinfo = dt_util.DEFAULT_TIME_ZONE

        return dt_util.now(tzinfo).isoformat()
```

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
| `assistant`       | string  | The assistant name used to control exposed entities. Currently, only `conversation` is supported.        |
| `device_id`       | string  | The device_id of the device the user used to initiate the conversation.                                 |

### API

The API object allows creating API instances. An API Instance represents a collection of tools that will be made available to the LLM.

```python
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helper import llm
from homeassistant.util import dt as dt_util
from homeassistant.util.json import JsonObjectType


class MyAPI(API):
    """My own API for LLMs."""

    async def async_get_api_instance(self, llm_context: LLMContext) -> APIInstance:
        """Return the instance of the API."""
        return APIInstance(
            api=self,
            api_prompt="Call the tools to fetch data from Home Assistant.",
            llm_context=llm_context,
            tools=[TimeTool()],
        )


async def async_setup_api(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Register the API with Home Assistant."""
    # If the API is associated with a Config Entry, the LLM API must be
    # unregistered when the config entry is unloaded.
    unreg = llm.async_register_api(
        hass,
        MyAPI(hass, f"my_unique_key-{entry.entry_id}", entry.title)
    )
    entry.async_on_unload(unreg)
```

The `llm.API` class has the following attributes:

| Name              | Type    | Description                                                                                             |
|-------------------|---------|---------------------------------------------------------------------------------------------------------|
| `id`              | string  | A unique identifier for the API. Required.                                                              |
| `name`            | string  | The name of the API. Required.                                                                          |

The `llm.APIInstance` class has the following attributes:

| Name              | Type    | Description                                                                                             |
|-------------------|---------|---------------------------------------------------------------------------------------------------------|
| `api`             | API     | The API object. Required.                                                                               |
| `api_prompt`      | string  | Instructions for LLM on how to use the LLM tools. Required.                                      |
| `llm_context`    | LLMContext | The context of the tool call. Required.                                                                 |
| `tools`           | list[Tool] | The tools that are available in this API. Required.                                                     |
