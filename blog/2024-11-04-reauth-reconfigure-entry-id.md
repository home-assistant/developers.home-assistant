---
author: epenet
authorURL: https://github.com/epenet
title: "Reauth and reconfigure flows need to be linked to a config entry"
---

Starting a reauth or a reconfigure flow without a link to the config entry has been deprecated, and will start failing in 2025.12.

Custom integrations should be updated to trigger the reauth flow using the `entry.async_start_reauth(hass)` helper.
```python
    async def async_press(self) -> None:
        """Handle the button press."""
        try:
            await self.device.press_button()
        except DevicePasswordProtected as ex:
            self.entry.async_start_reauth(self.hass)
```

Old incorrect code:
```python
    async def async_press(self) -> None:
        """Handle the button press."""
        try:
            await self.device.press_button()
        except DevicePasswordProtected as ex:
            # old incorrect code:
            self.hass.async_create_task(
                hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_REAUTH}
            )
    )
```

Custom integrations can also raise a `ConfigEntryAuthFailed` exception during the initialization phase, or within the update method of a data update coordinator.

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up integration from a config entry."""
    username = entry.data[CONF_USERNAME]
    password = entry.data[CONF_PASSWORD]

    if not _credentials_valid(username, password):
        raise ConfigEntryAuthFailed()
```

Starting a reconfigure flow is only done by the frontend and custom integrations should not need to change anything for these flows.

More details can be found in the [reconfigure](/docs/config_entries_config_flow_handler#reconfigure) and [reauthentication](/docs/config_entries_config_flow_handler#reauthentication) documentation.
