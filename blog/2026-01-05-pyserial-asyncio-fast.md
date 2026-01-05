---
author: epenet
authorURL: https://github.com/epenet
title: "Solving pyserial-asyncio blocking the event loop"
---

### Summary of changes

Starting in `2026.7`, installation of `pyserial-asyncio` will be blocked on Home Assistant.

Library maintainers and custom integrations are advised to migrate to `pyserial-asyncio-fast`.

### Background

`pyserial-asyncio` blocks the event loop because it does a blocking `sleep` and is not maintained.

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

async def connect():
    conn = await serial_asyncio.open_serial_connection(**self.serial_settings)

# New
import serial_asyncio_fast

async def connect():
    conn = await serial_asyncio_fast.open_serial_connection(**self.serial_settings)
```

More examples are available in [the tracking pull request](https://github.com/home-assistant/core/pull/116635).
