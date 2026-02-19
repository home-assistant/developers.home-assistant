---
author: Erwin Douna
authorURL: https://github.com/erwindouna
title: "Data Update Coordinator now supports Retry After"
---

Integrations using the [Data Update Coordinator](https://developers.home-assistant.io/docs/integration_fetching_data/#coordinated-single-api-poll-for-data-for-all-entities) can enhance the `UpdateFailed` exception with a new parameter `retry_after` to defer the next scheduled refresh by a specified number of seconds and then resume the normal cadence once the API has recovered.

In situations where polling API's would return a sign of being overwhelmed, by throwing an HTTP 429 or providing a `Retry-After` in the response header, integrations can now honor these backoff signals.
The integration and API client must detect these backoff signals and sanitize the API's desired backoff period. The `UpdateFailed` exception accepts a `retry_after` parameter (a float in seconds) to delay the next scheduled refresh. Once the API recovers and `UpdateFailed` is no longer raised, the integration resumes its normal `update_interval`.

Example of the usage:
```python
try:
    request = await self.client.get_information()
except APIClientRateLimited as err:
    raise UpdateFailed(
        retry_after=60  # This can also be retrieved from the API response itself, or provide a default
    ) from err
```

#### ConfigEntryNotReady
The `retry_after` parameter is ignored during the Update Coordinator setup phase (`async_config_entry_first_refresh`). If the first refresh fails, Home Assistant raises a `ConfigEntryNotReady` exception, allowing config entry setup to retry automatically using the built-in retry. Once the coordinator setup succeeds, `retry_after` applies to following refreshes.
