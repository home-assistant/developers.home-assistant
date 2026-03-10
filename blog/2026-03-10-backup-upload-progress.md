---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?s=96&v=4
title: "Backup agents can now report upload progress"
---

The `BackupAgent.async_upload_backup` method now receives a new `on_progress` callback parameter. Backup agents can call this callback periodically during upload to report the number of bytes uploaded so far:

```python
from collections.abc import AsyncIterator, Callable, Coroutine
from typing import Any
from homeassistant.components.backup import BackupAgent, OnProgressCallback


class ExampleBackupAgent(BackupAgent):

    async def async_upload_backup(
        self,
        *,
        open_stream: Callable[[], Coroutine[Any, Any, AsyncIterator[bytes]]],
        backup: AgentBackup,
        on_progress: OnProgressCallback,
        **kwargs: Any,
    ) -> None:
        """Upload a backup."""
        ...
        bytes_uploaded = 0
        async for chunk in await open_stream():
            await do_upload(chunk)
            bytes_uploaded += len(chunk)
            on_progress(bytes_uploaded=bytes_uploaded)
        ...
```

The backup manager uses these progress reports to fire `UploadBackupEvent` events, enabling the frontend to display real-time upload progress to the user.

Check the [backup agent documentation](/docs/core/platform/backup#backup-agents) for more details.
