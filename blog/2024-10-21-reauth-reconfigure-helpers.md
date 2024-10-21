---
author: epenet
authorURL: https://github.com/epenet
title: "New helpers and best practises for reauth and reconfigure flows"
---

New helper methods have been added to the ConfigFlow to facilitate management of reauth and reconfigure flows:
- `self._get_reauth_entry()` and `self._get_reconfigure_entry()` give access at any time to the corresponding config entry
  - these should be used over `self.hass.config_entries.async_get_entry(self.context["entry_id"])`
  - these should be requested when needed (local variable, once per step) and not cached as class attributes
  - if the steps are shared with discovery or user flows, `self.source` should be checked against `SOURCE_REAUTH` and `SOURCE_RECONFIGURE` before accessing the entry
- `self._abort_if_unique_id_mismatch` allows you to abort if the `unique_id` does not match the `unique_id` of the entry
  - this should be used after a call to `self.async_set_unique_id`
  - if the steps are shared with discovery or user flows, `self.source` should be checked against `SOURCE_REAUTH` and `SOURCE_RECONFIGURE`
  - other sources should continue to use `self._abort_if_unique_id_configured`
- `self.async_update_reload_and_abort` has been adjusted to update the default message for reconfigure flows
  - the new message `reconfigure_successful` must be present in `strings.json`
- `self.async_update_reload_and_abort` has a new argument `data_updates` to merge the data updates with the pre-existing data
  - this is preferred over the `data` argument, as it reduces the risk of data loss if the schema is updated

More details can be found in the [reconfigure](/docs/config_entries_config_flow_handler#reconfigure) and [reauthentication](/docs/config_entries_config_flow_handler#reauthentication) documentation.
