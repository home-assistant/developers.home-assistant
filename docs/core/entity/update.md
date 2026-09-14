---
title: Update entity
sidebar_label: Update
---

An update entity is an entity that indicates if an update is available for a
device or service. This can be any update, including update of a firmware
for a device like a light bulb or router, or software updates for things like
apps (formerly known as add-ons) or containers.

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
| auto_update | bool | `False` | The device or service that the entity represents has auto update logic. When this is set to `True` you cannot skip updates.
| display_precision | int | `0` | Number of decimal digits for display of update progress.
| in_progress | bool | `False` | Update installation progress. Should return a boolean (True if in progress, False if not).
| installed_version | str | `None` | The currently installed and used version of the software.
| latest_version | str | `None` | The latest version of the software available.
| release_summary | str | `None` | Summary of the release notes or changelog. This is not suitable for long changelogs but merely suitable for a short excerpt update description of max 255 characters.
| release_url | str | `None` | URL to the full release notes of the latest version available.
| release_notes_messages | tuple[UpdateReleaseNotesMessage, ...] | `()` | Translated alert messages shown before the full release notes. This is for static update guidance, not for translating the release notes themselves.
| title | str | `None` | Title of the software. This helps to differentiate between the device or entity name versus the title of the software installed.
| update_percentage | int, float | `None` | Update installation progress. Can either return a number to indicate the progress from 0 to 100% or None.

Other properties that are common to all entities such as `device_class`, `entity_category`, `icon`, `name` etc are still applicable.

## Supported features

Supported features are defined by using values in the `UpdateEntityFeature` enum.

| Value | Description |
|----------|--------------------------------------|
| 'BACKUP' | A backup can be made automatically, before installing an update.
| 'INSTALL' | The update can be installed from Home Assistant.
| 'PROGRESS' | This integration is able to provide progress information. If omitted, Home Assistant will try to provide a progress status; although it is better if the progress can be extracted from the device or service API.
| 'SPECIFIC_VERSION' | A specific version of an update can be installed using the `update.install` service action.
| 'RELEASE_NOTES' | The entity provides methods to fetch a complete changelog.

## Methods

### Compare versions

This method should be implemented when needed to override the default version comparison logic.
Here's an example:

```python
def version_is_newer(self, latest_version: str, installed_version: str) -> bool:
    """Return True if latest_version is newer than installed_version."""
    return AwesomeVersion(
        latest_version,
        find_first_match=True,
        ensure_strategy=[AwesomeVersionStrategy.SEMVER],
    ) > AwesomeVersion(
        installed_version,
        find_first_match=True,
        ensure_strategy=[AwesomeVersionStrategy.SEMVER],
    )
```

It allows developers to specify custom logic for determining if one version is newer than another. First attempt should be based on the strategies provided by the [AwesomeVersion library](https://github.com/ludeeus/awesomeversion?tab=readme-ov-file#awesomeversion-class).

### Install

This method can be implemented so users can install an offered update directly
from within Home Assistant.

This method requires `UpdateEntityFeature.INSTALL` to be set. Additionally, if this
integration supports installing specific version or is capable of backing up
before starting the update installation process, `UpdateEntityFeature.SPECIFIC_VERSION` and
`UpdateEntityFeature.BACKUP` can be set respectively.

```python
class MyUpdate(UpdateEntity):
    # Implement one of these methods.

    def install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        """Install an update."""

    async def async_install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        """Install an update.

        Version can be specified to install a specific version. When `None`, the
        latest version needs to be installed.

        The backup parameter indicates a backup should be taken before
        installing the update.
        """
```

### Release notes

This method can be implemented so users can get the full release notes in the more-info dialog of the Home Assistant Frontend before they install the update.

The returned string can contain markdown, and the frontend will format that correctly.

This method requires `UpdateEntityFeature.RELEASE_NOTES` to be set.

```python
class MyUpdate(UpdateEntity):
    # Implement one of these methods.

    def release_notes(self) -> str | None:
        """Return the release notes."""
        return "Lorem ipsum"

    async def async_release_notes(self) -> str | None:
        """Return the release notes."""
        return "Lorem ipsum"
```

#### Release notes messages

Use `release_notes_messages` when the update needs static guidance shown before the release notes, for example that a battery-powered device may need to be woken up or that power must not be removed during installation. Home Assistant renders these messages as alerts before the value returned by `release_notes()` or `async_release_notes()`.

This is only for guidance that accompanies release notes. The release notes themselves should still be returned by `release_notes()` or `async_release_notes()`.

For shared update guidance, use the predefined messages exported by the update platform:

```python
from homeassistant.components.update import (
    RELEASE_NOTES_MESSAGE_BATTERY_POWERED,
    RELEASE_NOTES_MESSAGE_DO_NOT_INTERRUPT,
    UpdateEntity,
)


class MyUpdate(UpdateEntity):
    _attr_release_notes_messages = (
        RELEASE_NOTES_MESSAGE_BATTERY_POWERED,
        RELEASE_NOTES_MESSAGE_DO_NOT_INTERRUPT,
    )
```

For static cases, `UpdateEntityDescription` also accepts `release_notes_messages`:

```python
from homeassistant.components.update import (
    RELEASE_NOTES_MESSAGE_DO_NOT_INTERRUPT,
    UpdateEntityDescription,
)

UPDATE_DESCRIPTION = UpdateEntityDescription(
    key="firmware",
    release_notes_messages=(RELEASE_NOTES_MESSAGE_DO_NOT_INTERRUPT,),
)
```

Integrations can define their own translated messages with `UpdateReleaseNotesMessage`:

```python
from homeassistant.components.update import (
    UpdateReleaseNotesMessage,
    UpdateReleaseNotesMessageSeverity,
)

from .const import DOMAIN

RELEASE_NOTES_MESSAGE_NETWORK_RELIABILITY = UpdateReleaseNotesMessage(
    translation_domain=DOMAIN,
    translation_key="network_reliability",
    severity=UpdateReleaseNotesMessageSeverity.WARNING,
    translation_placeholders={
        "zha_docs_network_reliability": (
            "https://www.home-assistant.io/integrations/zha/"
            "#zigbee-interference-avoidance-and-network-rangecoverage-optimization"
        ),
    },
)
```

Integration-specific messages are translated from the integration's `strings.json` under `entity.update.release_notes_messages`:

```json
{
  "entity": {
    "update": {
      "release_notes_messages": {
        "network_reliability": "If you are having issues updating a specific device, make sure that you have eliminated [common environmental issues]({zha_docs_network_reliability}) that could affect network reliability. OTA updates require a reliable network."
      }
    }
  }
}
```

By default, messages render as informational alerts. Set `severity` to `UpdateReleaseNotesMessageSeverity.WARNING` or `UpdateReleaseNotesMessageSeverity.ERROR` when the message needs stronger emphasis.

### Available device classes

Optionally specifies what type of entity it is.

| Constant | Description
| ----- | -----------
| `UpdateDeviceClass.FIRMWARE` | The update is a firmware update for a device.
