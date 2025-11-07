---
author: Erwin Douna
authorURL: https://github.com/erwindouna
title: "Added retry after mechanism to Data Update Coordinator"
---

Integrations using the [Data Update Coordinator](https://developers.home-assistant.io/docs/integration_fetching_data/#coordinated-single-api-poll-for-data-for-all-entities) can expand the `UpdateFailed` with a new parameter `retry_after` to defer the next scheduled refresh by a specificed amount of seconds and then resume the normal cadence once the API has recovered itself.

In situations where polling API's would return a sign of being overwhelmed, by throwing an HTTP 429 or providing a `Retry-After` in the response header, integrations can now honor these backoff signals.
It would be up to the integration and/or the API client to detect these signals and do the sanitionzation of the API's desired backoff period. The `UpdateFailed` accepts an additional `retry_after` parameter, where an integer in seconds can be provided to delay the next schedule. Once the API has recovered itself and thus the `UpdateFailed` is no longer triggered, the `update_interval` of the integration be applied again.

Example of the usage:
```py
try:
	request = await self.cient.get_information()
except APIClientRateLimited as err:
	raise UpdateFailed(
		retry_after=60 # This can also be retrieved from the API response itself, or provide a default
	) from err
```

#### ConfigEntryNotReady
The `retry_after parameter` is ignored during the setup phase (`async_config_entry_first_refresh`). If the first refresh fails, Home Assistant raises a `ConfigEntryNotReady`, allowing setup to retry automatically using the built-in retry. Once the setup succeeds, `retry_after` applies to following refreshes.
