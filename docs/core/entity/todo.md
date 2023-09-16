---
title: To-do List Entity
sidebar_label: To-do List
---

A todo entity is an entity that represents a To-do list. A To-do list contains
To-do items which are ordered and have a status (complete or in progress). A to-do list entity is derived from the [`homeassistant.components.todo.TodoListEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/__init__.py).


### States

A `TodoListEntity` state is the count of incomplete items in the To-do list.

## Supported Features

Supported features are defined by using values in the `TodoListEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value               | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `CREATE_TODO_ITEM`      | Entity implements the methods to allow creation of to-do items.  |
| `DELETE_TODO_ITEM`      | Entity implements the methods to allow deletion of to-do items.  |
| `UPDATE_TODO_ITEM`      | Entity implements the methods to allow update of to-do items.  |
| `MOVE_TODO_ITEM`        | Entity implements the methods to re-order to-do items.  |

## Methods

### Get To-do items

A To-do list entity can return To-do items, which are ordered by their position
on the to-do list.

```python
import datetime
from homeassistant.core import HomeAssistant
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_get_todo_items(self) -> list[TodoItem]:
        """Get items in the To-do list."""
```

### Create To-do items

A To-do list entity may support creating To-do items by specifying the `CREATE_TODO_ITEM` supported feature.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Add an item to the To-do list."""
```

### Delete To-do items

A To-do list entity may support deleting To-do items by specifying the `DELETE_TODO_ITEM` supported feature. Integrations must support deleting
multiple items.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_delete_todo_items(self, uids: set[str]) -> None:
        """Add an item to the To-do list."""
```

### Update To-do items

A To-do list entity may support updating To-do items by specifying the `UPDATE_TODO_ITEM` supported feature. 

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Add an item to the To-do list."""
```

### Move To-do items

A To-do list entity may support re-ordering To-do items in the list by specifying the `MOVE_TODO_ITEM` supported feature. 

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_move_todo_item(self, uid: str, previous: str | None) -> None:
        """Move an item in the To-do list."""
```

## TodoItem

A `TodoItem` represents an individual item on a To-do list.

| Name        | Type             | Default      | Description                                                                                                                                     |
| ----------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| summary     | string           | **Required** | A title or summary of the To-do item.
| uid | string | `None` | A unique identifier for the to-do item (required for mutations)
| status | `TodoItemStatus` | `NEEDS_ACTION` | Defines the overall status for the To-do item, either `NEEDS_ACTION` or `COMPLETE`