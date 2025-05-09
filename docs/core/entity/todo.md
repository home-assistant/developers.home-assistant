---
title: To-do list entity
sidebar_label: To-do list
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

## Supported features

Supported features are defined by using values in the `TodoListEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value                      | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `CREATE_TODO_ITEM`         | Entity implements the methods to allow creation of to-do items.  |
| `DELETE_TODO_ITEM`         | Entity implements the methods to allow deletion of to-do items.  |
| `UPDATE_TODO_ITEM`         | Entity implements the methods to allow update of to-do items.  |
| `MOVE_TODO_ITEM`           | Entity implements the methods to re-order to-do items.  |
| `SET_DUE_DATE_ON_ITEM`     | Entity implements setting the `due` field of an item to a `datetime.date` when creating or updating a to-do item. |
| `SET_DUE_DATETIME_ON_ITEM` | Entity implements setting the `due` field of an item to a `datetime.datetime` when creating or updating a to-do item. |
| `SET_DESCRIPTION_ON_ITEM`  | Entity implements setting the `description` field of an item when creating or updating a to-do item.  |

## Methods

### Create to-do items

A to-do list entity may support creating to-do items by specifying the `CREATE_TODO_ITEM`
supported feature.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Add an item to the To-do list."""
```

### Delete to-do items

A To-do list entity may support deleting to-do items by specifying the `DELETE_TODO_ITEM`
supported feature. Integrations must support deleting multiple items.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Delete an item from the to-do list."""
```

### Update to-do items

A to-do list entity may support updating to-do items by specifying the `UPDATE_TODO_ITEM`
supported feature. The `TodoItem` field `uid` is always present and indicates
which item should be updated. The item passed to update is a copy of the original
item with fields updated or cleared.

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Add an item to the To-do list."""
```

### Move to-do items

A to-do list entity may support re-ordering to-do items in the list by specifying
the `MOVE_TODO_ITEM` supported feature. The to-do item with the specified `uid`
should be moved to the position in the list after the one specified by `previous_uid` (`None` means move to the first
position in the to-do list).

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_move_todo_item(
        self,
        uid: str,
        previous_uid: str | None = None
    ) -> None:
        """Move an item in the To-do list."""
```

## TodoItem

A `TodoItem` represents an individual item on a To-do list. The methods
above describe any differences about which fields are optional on create or
update.

| Name        | Type             | Default      | Description                                                                                                                                     |
| ----------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| uid | <code>string &#124; None</code> | `None` | A unique identifier for the to-do item. This field is required for updates and the entity state.
| summary | <code>string &#124; None</code>  | `None` | A title or summary of the to-do item. This field is required for the entity state.
| status | <code>TodoItemStatus &#124; None</code> | `None` | Defines the overall status for the to-do item, either `NEEDS_ACTION` or `COMPLETE`. This field is required for the entity state.
| due | <code>datetime.date &#124; datetime.datetime &#124; None</code> | `None` | The date and time that a to-do is expected to be completed. As a datetime, must have a timezone.
| description | <code>string &#124; None</code>  | `None` | A more complete description of the to-do item than that provided by the summary.
