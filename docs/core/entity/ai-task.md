---
title: AI Task entity
sidebar_label: AI Task
---

An AI Task entity provides a framework for AI-powered task execution in Home Assistant. It enables integrations to offer AI capabilities for generating data, content, or performing structured tasks based on natural language instructions.

A AI Task entity is derived from the [`homeassistant.components.ai_task.AITaskEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/ai_task/entity.py). The entity state tracks the timestamp of the last activity for monitoring purposes.

## Properties

_This entity has no properties._

## Supported features

Supported features are defined by using values in the `AITaskEntityFeature` enum and are combined using the bitwise or (`|`) operator.

| Value | Description
| ----- | -----------
| `GENERATE_DATA` | The entity can generate data based on natural language instructions.

## Methods

### Generate Data

This method handles data generation tasks based on natural language instructions.

```python
from homeassistant.components.ai_task import AITaskEntity, GenDataTask, GenDataTaskResult

class MyAITaskEntity(AITaskEntity):
    """Represent an AI Task entity."""

    async def _async_generate_data(
        self, task: GenDataTask, chat_log: ChatLog
    ) -> GenDataTaskResult:
        """Handle a generate data task."""
        # Process the task instructions and generate appropriate data
        # Use the chat_log to maintain conversation context. A common
        # pattern is to share an implementation between conversation and AI
        # task entities to process the chat log.
        # await self._async_handle_chat_log(
        #  chat_log,
        #  task.structure,
        #  task.attachments
        # )

        text = ...
        if not task.structure:
            return GenDataTaskResult(
                conversation_id=chat_log.conversation_id,
                data=text
            )

        data = ... # process the text to match the structure
        return GenDataTaskResult(
            conversation_id=chat_log.conversation_id,
            data=data
        )

```

A `GenDataTask` object contains the following data:

| Name | Type | Description
| ---- | ---- | -----------
| `task_name` | `str` | Name/identifier for the task
| `instructions` | `str` | Natural language instructions for the AI
| `structure` | `vol.Schema` \| `None` | Optional schema for structured output validation
| `attachments` | `list[PlayMediaWithId]` | List of attachments to include in the task.

## Structured Output Schema

The `structure` parameter allows you to define the expected format of the generated data using Home Assistant's [selector system](https://www.home-assistant.io/docs/blueprint/selectors/):

```python
{
    "yes_no_field": {
        "description": "Description of the field",
        "required": True/False,  # Optional, defaults to False
        "selector": {
            "boolean": {}  # Selector type
        }
    },
    "text_field": {
        "description": "Description of the text field",
        "required": True/False,  # Optional, defaults to False
        "selector": {
            "text": {}  # Selector type
        }
    },
    "number_field": {
        "description": "Description of the number field",
        "required": True/False,  # Optional, defaults to False
        "selector": {
            "number": {
                "min": 18,  # Optional minimum value
                "max": 100,  # Optional maximum value
            }
        }
    },
}
```
