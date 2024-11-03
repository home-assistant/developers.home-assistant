---
author: epenet
authorURL: https://github.com/epenet
title: "Reauth and reconfigure flows need to be linked to a config entry"
---

Starting a reauth or a reconfigure flow without a link to the config entry has been deprecated, and will start failing in 2025.12.

Custom integrations should be updated to raise a `ConfigEntryAuthFailed` exception during the initialisation phase, or trigger the reauth flow manually using the `entry.async_start_reauth(hass)` helper.

Reconfigure flows are not expected to be triggered from code.

Sample during initialisation:
```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up integration from a config entry."""
    username = entry.data[CONF_USERNAME]
    password = entry.data[CONF_PASSWORD]

    if not _credentials_valid(username, password):
        raise ConfigEntryAuthFailed()
```

Sample outside initialisation:
```python
    async def async_press(self) -> None:
        """Handle the button press."""
        try:
            await self.device.press_button()
        except DevicePasswordProtected as ex:
            self.entry.async_start_reauth(self.hass)
 ```

More details can be found in the [reconfigure](/docs/config_entries_config_flow_handler#reconfigure) and [reauthentication](/docs/config_entries_config_flow_handler#reauthentication) documentation.
