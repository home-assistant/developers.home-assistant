---
title: Lock Entity
sidebar_label: Lock
---

A lock entity is a device which is able to lock and unlock. Locking and unlocking can optionally be secured with a user code. Some locks also allow for opening of latches, this may also be secured with a user code.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| changed_by | string | None | Describes what the last change was triggered by.
| code_format | string | None | Regex for code format or None if no code is required.
| is_locked | bool | None | Indication of whether the lock is currently locked. Used to determine `state`.

### States
| Constant | Description
|----------|------------------------|
| `STATE_LOCKED` | The lock is locked.
| `STATE_UNLOCKED` | The lock is unlocked.

### Supported Features

Supported features constants are combined using the bitwise or (`|`) operator.

| Constant | Description |
|----------|--------------------------------------|
| `SUPPORT_OPEN` | This lock supports opening the door latch.

## Methods

### Lock

```python
class MyLock(LockDevice):

    def lock(self, **kwargs):
        """Lock all or specified locks. A code to lock the lock with may optionally be specified."""
        
    async def async_lock(self, **kwargs):
        """Lock all or specified locks. A code to lock the lock with may optionally be specified."""
```

### Unlock

```python
class MyLock(LockDevice):

    def unlock(self, **kwargs):
        """Unlock all or specified locks. A code to unlock the lock with may optionally be specified."""
        
    async def async_unlock(self, **kwargs):
        """Unlock all or specified locks. A code to unlock the lock with may optionally be specified."""
```

### Open

Only implement this method if the flag `SUPPORT_OPEN` is set.

```python
class MyLock(LockDevice):

    def open(self, **kwargs):
        """Open (unlatch) all or specified locks. A code to open the lock with may optionally be specified."""
        
    async def async_open(self, **kwargs):
        """Open (unlatch) all or specified locks. A code to open the lock with may optionally be specified."""
```

### Set usercode

```python
class MyLock(LockDevice):

    def set_usercode(self, **kwargs):
        """Set a usercode on the lock."""
```

### Get usercode

```python
class MyLock(LockDevice):

    def get_usercode(self, **kwargs):
        """Retrive a usercode from the lock."""
```

### Clear usercode

```python
class MyLock(LockDevice):

    def clear_usercode(self, **kwargs):
        """Clear a usercode from the lock."""
```

