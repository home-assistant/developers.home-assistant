---
title: To-do List Entity
sidebar_label: To-do List
---

A To-do list entity is an entity that represents a To-do list. A To-do list contains
To-do items which are ordered and have a status (complete or in progress). A To-do list entity is derived from the [`homeassistant.components.todo.TodoListEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/__init__.py).

## Properties

:::tip
Properties should only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name  | Type          | Default               | Description                                             |
| ----- | ------------- | --------------------- | ------------------------------------------------------- |
| todo_items | <code>list[TodoItem] &#124; None</code> | `None` | **Required.** The ordered contents of the To-do list. |

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


### Create To-do items

A To-do list entity may support creating To-do items by specifying the `CREATE_TODO_ITEM`
supported feature. The `TodoItem` field `uid` will not be present since it is a
unique identifier determined by the integration when the item is created.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Add an item to the To-do list."""
```

### Delete To-do items

A To-do list entity may support deleting To-do items by specifying the `DELETE_TODO_ITEM`
supported feature. Integrations must support deleting multiple items.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Add an item to the To-do list."""
```

### Update To-do items

A To-do list entity may support updating To-do items by specifying the `UPDATE_TODO_ITEM`
supported feature. The `TodoItem` field `uid` is always present and indicates
which item should be updated, and all other fields are optional. Integrations
must support partial update.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Add an item to the To-do list."""
```

### Move To-do items

A To-do list entity may support re-ordering To-do items in the list by specifying
the `MOVE_TODO_ITEM` supported feature. The To-do item with the specified `uid`
should be moved to the position in the list specified by `pos` (`0` is the first
position in the To-do list).

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_move_todo_item(self, uid: str, pos: int) -> None:
        """Move an item in the To-do list."""
```

## TodoItem

A `TodoItem` represents an individual item on a To-do list. The methods
above describe any differences about which fields are optional on create or
update.

| Name        | Type             | Default      | Description                                                                                                                                     |
| ----------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| uid | <code>string &#124; None</code> | `None` | **Required.** A unique identifier for the to-do item. This field is required for mutations.
| summary     | <code>string &#124; None</code>  | `None` |  **Required.** A title or summary of the To-do item.
| status | <code>TodoItemStatus &#124; None</code> | `None` |  **Required.** Defines the overall status for the To-do item, either `NEEDS_ACTION` or `COMPLETE`