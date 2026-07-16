---
title: Lock entity
sidebar_label: Lock
---

A lock entity is able to be locked and unlocked. Locking and unlocking can optionally be secured with a user code. Some locks also allow for opening of latches, this may also be secured with a user code. Derive a platform entity from [`homeassistant.components.lock.LockEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/lock/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| changed_by | string | None | Describes what the last change was triggered by.
| code_format | string | None | Regex used to validate the code supplied to the lock, unlock, and open actions, or None if no code is required.
| is_locked | bool | None | Whether the lock is locked. Used to determine `state`.
| is_locking | bool | None | Whether the lock is in the process of being locked. Used to determine `state`.
| is_unlocking | bool | None | Whether the lock is in the process of being unlocked. Used to determine `state`.
| is_open | bool | None | Whether the lock is unlocked and has released its latch. Only relevant for locks that support `LockEntityFeature.OPEN`. Used to determine `state`.
| is_opening | bool | None | Whether the lock is in the process of releasing its latch. Used to determine `state`.
| is_jammed | bool | None | Whether the lock tried to move but got stuck before it finished. Used to determine `state`.

### States

The state is derived from the properties above and is one of the following `LockState` enum members:

| Value       | Description                                                        |
|-------------|--------------------------------------------------------------------|
| `LOCKED`    | The lock is secured.                                               |
| `LOCKING`   | The lock is in the process of being locked.                        |
| `UNLOCKED`  | The lock is not secured.                                           |
| `UNLOCKING` | The lock is in the process of being unlocked.                      |
| `OPEN`      | The lock is not secured and has released its latch.                |
| `OPENING`   | The lock is in the process of releasing its latch.                 |
| `JAMMED`    | The lock tried to move but got stuck before it finished.           |

:::note

The `OPEN` state and the `is_open` property require the lock to be not secured **and** have its latch released. A released latch while the lock is still secured is not the open state.

:::

When more than one of the state properties is set, they are evaluated in a fixed priority order and the first match determines the state:

1. `is_jammed` → `JAMMED`
2. `is_opening` → `OPENING`
3. `is_locking` → `LOCKING`
4. `is_open` → `OPEN`
5. `is_unlocking` → `UNLOCKING`
6. `is_locked` → `LOCKED` when `True`, `UNLOCKED` when `False`

If `is_locked` is `None` and none of the other state properties evaluate truthy, the state is `unknown`.

## Supported features

Supported features are defined by using values in the `LockEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value  | Description                                |
| ------ | ------------------------------------------ |
| `OPEN` | This lock supports opening the door latch. |

## Methods

### Lock

```python
class MyLock(LockEntity):

    def lock(self, **kwargs: Any) -> None:
        """Lock all or specified locks. A code to lock the lock with may optionally be specified."""

    async def async_lock(self, **kwargs: Any) -> None:
        """Lock all or specified locks. A code to lock the lock with may optionally be specified."""
```

### Unlock

```python
class MyLock(LockEntity):

    def unlock(self, **kwargs: Any) -> None:
        """Unlock all or specified locks. A code to unlock the lock with may optionally be specified."""

    async def async_unlock(self, **kwargs: Any) -> None:
        """Unlock all or specified locks. A code to unlock the lock with may optionally be specified."""
```

### Open

Only implement this method if the flag `LockEntityFeature.OPEN` is set.

```python
class MyLock(LockEntity):

    def open(self, **kwargs: Any) -> None:
        """Open (unlatch) all or specified locks. A code to open the lock with may optionally be specified."""

    async def async_open(self, **kwargs: Any) -> None:
        """Open (unlatch) all or specified locks. A code to open the lock with may optionally be specified."""
```
