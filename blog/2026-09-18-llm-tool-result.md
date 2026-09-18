---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
title: "LLM tools return a ToolResult"
---

As of Home Assistant Core 2026.10, an LLM tool returns an `llm.ToolResult` instead of a plain JSON object. `ToolResult` carries the tool's `data` and an `error` flag that says whether the call failed. On the chat log side, `ToolResultContent.tool_result` is replaced by `ToolResultContent.result`, which holds the `ToolResult`.

Returning a plain JSON object from a tool, reading `ToolResultContent.tool_result`, and setting `tool_result` on a tool result delta are deprecated. They keep working for custom integrations with a warning in the log until Home Assistant Core 2027.11, and stop working after that.

`ToolResult` was added in core [PR #182487](https://github.com/home-assistant/core/pull/182487). The deprecated usage is reported in core [PR #182551](https://github.com/home-assistant/core/pull/182551).
