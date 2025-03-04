---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the BackupAgent API"
---

The `BackupAgent` API has been adjusted such that the following methods should now raise `BackupNotFound` when a backup is not found:
- `BackupAgent.async_delete_backup`
- `BackupAgent.async_download_backup`
- `BackupAgent.async_get_backup`

Check the backup agent documentation](/docs/core/platform/backup#backup-agents), and the [home assistant core PR #139754](https://github.com/home-assistant/core/pull/139754) for additional background.
