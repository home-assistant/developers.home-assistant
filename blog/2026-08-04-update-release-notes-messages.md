---
author: Jan-Philipp Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "Translated release notes messages for update entities"
---

Update entities can now provide translated alert messages that Home Assistant shows before the full release notes. Integrations can use these messages for static update guidance, such as warning users not to interrupt a firmware update or explaining that battery powered devices may need to be woken up before an update can start.

Previously, integrations that needed this kind of guidance often built `<ha-alert>` markup directly inside `release_notes()` or `async_release_notes()`. That duplicated wording across integrations, kept the text in English, and mixed static guidance with the actual release notes returned by the device or service.

You can now use `release_notes_messages` for this guidance. Shared messages are available for common cases, and integration-specific messages can be defined with `UpdateReleaseNotesMessage`.

<!--truncate-->

## Shared messages

For common update guidance, use the predefined messages exported by the update platform:

```python
from homeassistant.components.update import (
    RELEASE_NOTES_MESSAGE_BATTERY_POWERED,
    RELEASE_NOTES_MESSAGE_DO_NOT_INTERRUPT,
    UpdateEntity,
)


class MyFirmwareUpdate(UpdateEntity):
    _attr_release_notes_messages = (
        RELEASE_NOTES_MESSAGE_BATTERY_POWERED,
        RELEASE_NOTES_MESSAGE_DO_NOT_INTERRUPT,
    )
```

These messages are translated by the update platform and rendered before the release notes returned by `release_notes()` or `async_release_notes()`.

## Entity description support

For static update entities, messages can also be defined on `UpdateEntityDescription`:

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

## Integration-specific messages

Integrations can define their own translated messages when the guidance is specific to the integration:

```python
from homeassistant.components.update import (
    UpdateReleaseNotesMessage,
    UpdateReleaseNotesMessageSeverity,
)

from .const import DOMAIN

RELEASE_NOTES_MESSAGE_NON_MAIN_NET_UPDATE_SOURCE = UpdateReleaseNotesMessage(
    translation_domain=DOMAIN,
    translation_key="non_main_net_update_source",
    severity=UpdateReleaseNotesMessageSeverity.WARNING,
)
```

The translation lives in the integration's `strings.json` under `entity.update.release_notes_messages`:

```json
{
  "entity": {
    "update": {
      "release_notes_messages": {
        "non_main_net_update_source": "This update is not provided by the device's main update source. Only install it if you trust the source."
      }
    }
  }
}
```

Messages support `translation_placeholders` for values such as documentation URLs.

## Rendering

Home Assistant renders each message as an `<ha-alert>` before the release notes and returns the same markdown/html string over the existing `update/release_notes` websocket command.
Integrations should return only the actual release notes from `release_notes()` or `async_release_notes()` and put static guidance in `release_notes_messages`.

See the [update entity developer documentation](/docs/core/entity/update#release-notes-messages) for details.
