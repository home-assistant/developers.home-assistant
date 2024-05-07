---
title: "LLM Tools"
sidebar_label: "LLM Tools"
---

LLM tools extend the functionality of OpenAI Conversation, Google Generative AI, and possibly other future LLM integrations. You can define your own LLM tool that these integrations can use.

There are 3 options to define your own tool.

# Option 1. Intent

Create and register your own intent handler. Intents are automatically registered as LLM tools. This method allows to use the same code for other integrations that support intents.

# Option 2. Tool class

Define a child class of `homeassistant.helpers.llm.Tool` and register an object of that class. This it the most flexible method. Example:

```python
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import llm

class MyTool(llm.Tool):
  """LLM multiplication helper tool."""
  name = "multiply"
  description = "Return a product of two integers"
  parameters = vol.Schema(
    {
      vol.Required("a", description="multiplicand"): vol.Coerce(int),
      vol.Required("b", description="multiplier"): vol.Coerce(int),
    }
  )

  async def async_call(self, hass: HomeAssistant, tool_input: llm.ToolInput) -> Any:
    """Call the function."""
    args = tool_input.tool_args
    return {"result": args["a"] * args["b"]}

my_tool = MyTool()
llm.async_register_tool(hass, my_tool)
```

Let's unpack.

The `llm.Tool` class has the following user-defined attributes:

| Name                | Type       | Description                                                                                                    |
|---------------------|------------|----------------------------------------------------------------------------------------------------------------|
| `name`              | string     | The name of the tool. Required.                                                                                |
| `description`       | string     | Description of the tool to help the LLM understand when and how it should be called. Optional but recommended. |
| `parameters`        | vol.Schema | The voluptuous schema of the parameters. Defaults to vol.Schema({})                                            |

The `llm.Tool` class has the following user-defined methods:

### `async_call`
Perform the actual operation of the tool when called by the LLM. This must be an async method and return json-serializable result. Its arguments are `hass` and an instance of `llm.ToolInput`.

Example:
```python
class MyTool(llm.Tool):
    ...
    async def async_call(self, hass: HomeAssistant, tool_input: ToolInput) -> Any:
      """Call the tool."""
      return {"result": "success"}
```

The `ToolInput` has following attributes:

| Name              | Type    | Description                                                                                             |
|-------------------|---------|---------------------------------------------------------------------------------------------------------|
| `tool_name`       | string  | The name of the tool being called                                                                       |
| `tool_args`       | dict    | The arguments provided by the LLM. The arguments are converted and validated using `parameters` schema. |
| `platform`        | string  | The DOMAIN of the conversation agent using the tool                                                     |
| `context`         | Context | The `homeassistant.core.Context` of the conversation                                                    |
| `user_prompt`     | string  | The raw text input that initiated the tool call                                                         |
| `language`        | string  | The language of the conversation agent, or "*" for any language                                         |
| `agent_id`        | string  | The ID of the conversation agent                                                                        |
| `conversation_id` | string  | The ID of the conversation                                                                              |
| `device_id`       | string  | The device ID that user uses for the conversation, if available                                         |
| `assistant`       | string  | The assistant name used to control exposed entities. Currently only `conversation` is supported.        |

### `custom_serializer`
The Tools are usually represented to the LLM with OpenAPI schema, which is based on JSON schema.
It is auto generated from `vol.Schema` of tool parameters, but sometimes it requires a custom conversion, for example, if the vol.Schema has custom validators.

This method allows a user to define or tweak the conversion. See example below.

## Unregistration
When your integration no longer wants to provide the tool, you need to unregister it with `llm.async_remove_tool`.

Example:
```python
async_remove_tool(hass, MyTool)
```

You can also use the tool name:
```python
async_remove_tool(hass, "multiply")
```

## Full example:

The following tool returns a currency exponent. Note the use of the `currency_validator` in `parameters` and `custom_serializer`.

```python
from iso4217 import Currency
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import llm

def currency_validator(currency_code: str) -> Currency:
    """Validate currency code."""
    return Currency(currency_code)

class MyTool(llm.Tool):
    name = "currency_exponent"
    description = "Return the currency exponent for a ISO 4217 currency code"
    parameters = vol.Schema(
        {
            vol.Required("currency", description="ISO 4217 alphabetic code"): currency_validator,
        }
    )

    async def async_call(self, hass: HomeAssistant, tool_input: llm.ToolInput) -> Any:
        """Call the function."""
        return {"exponent": tool_input.tool_args["currency"].exponent}

    def custom_serializer(self, schema: Any) -> Any:
        """Serialize additional types in OpenAPI-compatible format."""
        if schema is currency_validator:
            return {"type": "string"}
        return super().custom_serializer(schema)

llm.async_register_tool(hass, MyTool())
```

# Option 3. Tool function

Define a function and register it as an LLM tool. This is the easiest method.

There are two ways to register the function as an LLM tool: with `llm.FunctionTool` class or with a decorator.

Example with `llm.FunctionTool` class:

```python
from homeassistant.helpers import llm

def multiply(a: int, b: int) -> int:
    "Return a product of two integers."
    return {"result": a * b}

my_tool = FunctionTool(multiply)
llm.async_register_tool(hass, my_tool)
```

Example with the `@llm_tool` decorator:
```python
from homeassistant.helpers.llm import llm_tool

@llm_tool(hass)
def multiply(a: int, b: int) -> Any:
    "Return a product of two integers."
    return {"result": a * b}
```

The function name is used as the tool name, the docstring is used as the tool description, and the argument annotations are used to construct the parameters schema.

If a parameter name is "hass" or any of the `ToolInput` attributes (see above), then the value for that parameter will be provided by the conversation agent. The rest arguments will be provided by the LLM.

Example:
```python
from homeassistant.helpers.llm import llm_tool

@llm_tool(hass)
def test_tool(platform: str, test_arg: str) -> str:
    """Test tool to verify that function calling works."""
    return f"This is {platform} and the test argument is {test_arg}"
```

The function can be `async` or not. If the function is not `async`, it should not do any I/O or block in any other way.

The function should return a json-serializable result.

Registering class methods as LLM tool functions is not supported.

When your integration no longer wants to provide the tool, you need to unregister it with `llm.async_remove_tool`.

Example:
```python
async_remove_tool(hass, multiply)
```

You can also use the tool name (remove the `async_` prefix, if any):
```python
async_remove_tool(hass, "multiply")
```
