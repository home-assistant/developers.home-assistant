---
title: Update Entity
sidebar_label: Update
---

An update entity is an entity that indicates if an update is available for a
device or service. This can be any update, including update of a firmware
for a device like a light bulb or router, or software updates for things like
add-ons or containers.

It can be used for:

- Providing an indicator if an update is available for a device or service.
- An install method to allow installing an update or a specific version
  of the software.
- Allow for offering backups before installing a new update.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_version | str | `None` | The current version of the software installed.
| in_progress | bool, int | `None` | Update installation progress. Can either return a boolean (True if in progress, False if not) or an integer to indicate the progress from 0 to 100%.
| latest_version | str | `None` | The latest version of the software available.
| release_summary | str | `None` | Summary of the release notes or changelog. This is not suitable for long changelogs but merely suitable for a short excerpt update description of max 255 characters.
| release_url | str | `None` | URL to the full release notes of the latest version available.
| title | str | `None` | Title of the software. This helps to differentiate between the device or entity name versus the title of the software installed.

Other properties that are common to all entities such as `device_class`, `entity_category`, `icon`, `name` etc are still applicable.

## Supported Features

| Constant | Description |
|----------|--------------------------------------|
| 'UpdateEntityFeature.BACKUP' | A backup can be made automatically, before installing an update.
| 'UpdateEntityFeature.INSTALL' | The update can be installed from Home Assistant. 
| 'UpdateEntityFeature.PROGRESS' | This integration is able to provide progress information. If omitted, Home Assistant will try to provide a progress status; although it is better if the progress can be extracted from the device or service API.
| 'UpdateEntityFeature.SPECIFIC_VERSION' | A specific version of an update can be installed using the `update.install` service.

## Methods

### Install

This method can be implemented so users can install an offered update directly
from within Home Assistant.

This method requires `SUPPORT_INSTALL` to be set. Additionally, if this
integration supports installing specific version or is capable of backing up
before starting the update installation process, `SUPPORT_SPECIFIC_VERSION` and
`SUPPORT_BACKUP` can be set respectively.

```python
class MyUpdate(UpdateEntity):
    # Implement one of these methods.

    async def async_install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        """Install an update."""

    def install(
        self,
        version: str | None = None,
        backup: bool | None = None,
        **kwargs: Any,
    ) -> None:
        """Install an update.

        Version can be specified to install a specific version. When `None`, the
        latest version needs to be installed.

        The backup parameter indicates a backup should be taken before
        installing the update.
        """
```

### Available device classes

Optionally specifies what type of entity it is.

| Value | Description
| ----- | -----------
| firmware | The update is a firmware update for a device.
