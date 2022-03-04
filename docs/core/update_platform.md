---
title: Update platform
---

The update platform allow you to provide updates that the user can manage in the configuration panel of the Home Assistant UI[^1].

Add a new `update.py` file to your integration with the 2 public functions
described below to enable this feature.

:::tip

You can also use the `update` scaffold template.

```shell
python3 -m script.scaffold --integration [domain] update
```

:::

## Public functions

The update platform needs 2 public functions to be present in 

### `async_list_updates`

This is where you gather all the updates the integration provides, and return that as a list of `UpdateDescription` objects.

```python
async def async_list_updates(hass: HomeAssistant) -> list[UpdateDescription]:
```

### `async_perform_update`

This is the function that will be called when an user starts an update.
The `identifier` and the  `version` attributes you declared for the `UpdateDescription`  in  `async_list_updates` will be passed to the function.

```python
async def async_perform_update(
    hass: HomeAssistant,
    identifier: str,
    version: str,
    **kwargs: Any,
) -> None:
```

If you set `supports_backup`  to `True` in `UpdateDescription` a `backup` key will be present in `kwargs` with a `bool` that represent the choice the user made.

If the update failed raise `IntegrationUpdateFailed`.

## UpdateDescription

The update description provides a interface to describe the update.

Attribute | Type | Description
-- | -- | --
`identifier` | `str` | This identifies the update, this attribute is passed to the `async_perform_update` function when the user starts the update.
`name` | `str` | This is the name of the update that will be show to the user
`current_version` | `str` | This represent the current version (the version the user updates from)
`available_version` | `str` | This represents the version that are available (the version the user updates to), this attribute is passed to the `async_perform_update` function as `version` when the user starts the update.
`changelog_url` | `str` (Optional) | An URL to where the user can get to the changelog for the update.
`changelog_content` | `str` (Optional) | Markdown formatted changelog content that will be displayed in the update dialog.
`icon_url` | `str` (Optional) | URL to an icon that will be shown in the UI, if not present it will use the [brands](https://github.com/home-assistant/brands) icon for the integration.
`supports_backup` | `bool` (Optional) | Set this to `True` if the integration have a way to perform backup before an update take place.

[^1]: _This require the user to have enabled the `update` integration._
