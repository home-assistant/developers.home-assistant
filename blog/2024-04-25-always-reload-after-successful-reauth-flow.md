---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Always reload after a successful re-auth flow
---

## Always reload after successful reauthentication

To update and reload the entry after a successful reauthentication flow, the helper `async_update_reload_and_abort` can be used. The default behavior of the helper has been changed. By default the entry will always reload if the helper is called. If an entry needs reauthentication, it is not always needed to update the entry if an account was temporary disabled or an API-key was temporary disallowed.

For cases where reloading is not wanted in case the entry is not changed, the `always_reload=False` parameter can be passed to the helper.

More about this helper can be found here [here](/docs/config_entries_config_flow_handler/#reauthentication).

### Example

```python
class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """Config flow to handle OAuth2 authentication."""

    reauth_entry: ConfigEntry | None = None

    async def async_step_reauth(self, user_input=None):
        """Perform reauth upon an API authentication error."""
        self.reauth_entry = self.hass.config_entries.async_get_entry(
            self.context["entry_id"]
        )
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(self, user_input=None):
        """Dialog that informs the user that reauth is required."""
        if user_input is None:
            return self.async_show_form(
                step_id="reauth_confirm",
                data_schema=vol.Schema({}),
            )
        return await self.async_step_user()

    async def async_oauth_create_entry(self, data: dict) -> dict:
        """Create an oauth config entry or update existing entry for reauth."""
        if self.reauth_entry:
            # Only reload if the entry was updated
            return self.async_update_reload_and_abort(
                self.reauth_entry,
                data=data,
                always_reload=False,
            )
        return await super().async_oauth_create_entry(data)
```
