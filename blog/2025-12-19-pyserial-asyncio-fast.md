---
author: epenet
authorURL: https://github.com/epenet
title: "Block pyserial-asyncio in favor of pyserial-asyncio-fast"
---

### Summary of changes

Starting in `2026.4`, installation of `pyserial-asyncio` will be blocked on Home Assistant.

Library maintainers and custom integrations are advised to migrate to `pyserial-asyncio-fast`.

### Background

`pyserial-asyncio` does blocking I/O (actually it's a `sleep`, but falls under the same class of issue) in asyncio loop and is not maintained.

`pyserial-asyncio-fast` was created as a drop-in replacement (see [the repository](https://github.com/home-assistant-libs/pyserial-asyncio-fast)), and all core integrations have now been migrated.

### Migration

`pyserial-asyncio-fast` was designed as a drop-in replacement of `pyserial-asyncio`, and the necessary changes are trivial.

#### Requirements

```python
# Old
  install_requires=[
    "pyserial-asyncio"
  ]

# New
  install_requires=[
    "pyserial-asyncio-fast"
  ]
```


#### Usage

```python
# Old
import serial_asyncio

def connect():
    conn = serial_asyncio.open_serial_connection(**self.serial_settings)

# New
import serial_asyncio_fast

def connect():
    conn = serial_asyncio_fast.open_serial_connection(**self.serial_settings)
```

More examples can be seen in the linked pull requests linked to https://github.com/home-assistant/core/pull/116635
