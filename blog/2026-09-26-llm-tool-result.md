---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
title: "LLM tools return a ToolResult and declare their integration"
---

As of Home Assistant Core 2026.10, an LLM tool returns an `llm.ToolResult` instead of a plain JSON object. `ToolResult` carries the tool's `data` and an `error` flag that says whether the call failed. On the chat log side, `ToolResultContent.tool_result` is replaced by `ToolResultContent.result`, which holds the `ToolResult`.

Returning a plain JSON object from a tool, reading `ToolResultContent.tool_result`, and setting `tool_result` on a tool result delta are deprecated. They keep working for custom integrations with a warning in the log until Home Assistant Core 2027.11, and stop working after that.

The release also adds metadata to `llm.Tool`. A tool now has a `title` for people to read, `annotations` that describe how it behaves, and an `integration` that records which integration provides it. The MCP Server integration serves the title and the annotations to MCP clients.

The annotations are an `llm.ToolAnnotations` with four flags: `read_only`, `destructive`, `idempotent` and `open_world`. The defaults describe the least safe case, so a tool that declares nothing is taken to write, to be destructive, and to reach outside Home Assistant.

Creating a tool without an `integration` is deprecated. A core integration raises an error. A custom integration gets a warning in the log until Home Assistant Core 2027.10, and stops working after that.

Both changes together look like this:

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers import llm

from .const import DOMAIN


class GetItemsTool(llm.Tool):
    """Tool to read the items on a list."""

    name = "my_integration__get_items"
    title = "Get list items"
    description = "Read the items on a list."
    integration = DOMAIN
    annotations = llm.ToolAnnotations(
        read_only=True, destructive=False, idempotent=True, open_world=False
    )

    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: llm.ToolInput,
        llm_context: llm.LLMContext,
    ) -> llm.ToolResult:
        """Call the tool."""
        return llm.ToolResult(data={"items": ["Milk", "Bread"]})
