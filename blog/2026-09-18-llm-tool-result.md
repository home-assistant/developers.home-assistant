---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
title: "LLM tools return a ToolResult"
---

As of Home Assistant Core 2026.10, an LLM tool returns an `llm.ToolResult` instead of a plain JSON object. `ToolResult` carries the tool's `data` and an `error` flag that says whether the call failed. On the chat log side, `ToolResultContent.tool_result` is replaced by `ToolResultContent.result`, which holds the `ToolResult`.

Returning a plain JSON object from a tool, reading `ToolResultContent.tool_result`, and setting `tool_result` on a tool result delta are deprecated. They keep working for custom integrations with a warning in the log until Home Assistant Core 2027.11, and stop working after that. Core and core integrations raise `RuntimeError`.

`ToolResult` was added in core [PR #182487](https://github.com/home-assistant/core/pull/182487). The deprecated usage is reported in core [PR #182551](https://github.com/home-assistant/core/pull/182551).

<!--truncate-->

## Why

Until now, a tool call had two outcomes: it returned a JSON object, or it raised `HomeAssistantError`. The chat log turned the exception into a JSON object with `error` and `error_text` keys, but that object looked like any other result. A conversation agent could not tell a failed call from a successful one without inspecting the data. Tools that wanted to report a failure without raising had to pick their own convention, such as a `success` key.

`ToolResult` makes this explicit:

```python
@dataclass(slots=True)
class ToolResult:
    data: JsonObjectType
    error: bool = False
```

The chat log now sets `error=True` when a tool raises, and the MCP server maps the flag to `isError` on the MCP response. The dataclass also gives us a place to add more result types in the future without another breaking change.

## Tool authors

Wrap the return value of `async_call` in `ToolResult`:

```python
# Before
async def async_call(
    self, hass: HomeAssistant, tool_input: ToolInput, llm_context: LLMContext
) -> JsonObjectType:
    return {"time": dt_util.now().isoformat()}

# After
async def async_call(
    self, hass: HomeAssistant, tool_input: ToolInput, llm_context: LLMContext
) -> ToolResult:
    return ToolResult(data={"time": dt_util.now().isoformat()})
```

Raising `HomeAssistantError` still works, and is still the way to report an error the tool cannot recover from. Set `error=True` when the tool has data to give the model about the failure:

```python
return ToolResult(data={"error": "Entity not found"}, error=True)
```

`APIInstance.async_call_tool` always returns a `ToolResult`. Until 2027.11, a plain JSON object returned by a tool is wrapped in one, with the deprecation warning.

## Conversation agents

A conversation agent reads tool results from the chat log to send them back to the model. Read `content.result.data` instead of `content.tool_result`:

```python
# Before
json.dumps(content.tool_result)

# After
json.dumps(content.result.data)
```

Check `content.result.error` to tell the model the call failed, if the model API has a field for that.

An agent that adds tool result deltas itself, for example for tool calls executed by the model provider, must set `result` instead of `tool_result`:

```python
# Before
{
    "role": "tool_result",
    "tool_call_id": tool_call_id,
    "tool_name": tool_name,
    "tool_result": data,
}

# After
{
    "role": "tool_result",
    "tool_call_id": tool_call_id,
    "tool_name": tool_name,
    "result": llm.ToolResult(data=data),
}
```

The `as_dict()` serialization of a `ToolResultContent`, which delta listeners and chat log subscribers receive, now has a `result` key with `data` and `error`. The `tool_result` key is still included until 2027.11.

Core's own conversation integrations were migrated in the pull requests linked from [PR #182551](https://github.com/home-assistant/core/pull/182551), which can serve as examples.
