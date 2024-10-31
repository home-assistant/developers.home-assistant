---
title: "Backup"
---

The backup platform consists of two parts; [Pre/Post backup hooks](#prepost-backup-hooks) and [Sync agents](#sync-agents).

## Pre/Post backup hooks

When Home Assistant is creating a backup, there might be a need to pause certain operations in the integration, or dumping data so it can properly be restored.

This is done by adding 2 functions (`async_pre_backup` and `async_post_backup`) to `backup.py`

### Adding support

The quickest way to add backup support to a new integration is by using our built-in scaffold template. From a Home Assistant dev environment, run `python3 -m script.scaffold backup` and follow the instructions.

If you prefer to go the manual route, create a new file in your integration folder called `backup.py` and implement the following method:

```python
from homeassistant.core import HomeAssistant


async def async_pre_backup(hass: HomeAssistant) -> None:
    """Perform operations before a backup starts."""

async def async_post_backup(hass: HomeAssistant) -> None:
    """Perform operations after a backup finishes."""
```

## Sync agents

Sync agents are used to dispatch a backup to a remote location. This is done by implementing the a `BackupSyncAgent` class.

To register your sync agent, you need to add a `async_get_backup_sync_agents` function to your integrations backup platform.

```python
async def async_get_backup_sync_agents(
    hass: HomeAssistant,
) -> list[BackupSyncAgent]:
    """Register the backup sync agents."""
    return [LoremIpsumBackupSyncAgent("syncer")]

class LoremIpsumBackupSyncAgent(BackupSyncAgent):
    ...
```

### Sync agent methods

The base class `BackupSyncAgent` has several methods that can needs to be implemented.

Method | Description
:--- | :---
`async_download_backup` | Download a backup from the remote location. The `id` parameter is the ID of the synced backup that was returned in `async_list_backups`. The `path` parameter is the full file path to download the synced backup to.
`async_upload_backup` | Upload a backup. The `path` parameter is the full file path to the backup that should be synced. The `metadata` parameter contains metadata about the backup that should be synced.
`async_list_backups` | List backups.

When a user creates a backup, Home Assistant will call the `async_upload_backup` method on the sync agent to store the backup in the remote location.
