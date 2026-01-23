---
author: Erwin Douna
authorURL: https://github.com/erwindouna
title: "OAuth 2.0 Helper Refresh Token Error Handling"
---

### Summary of changes

Starting as of `2026.x`, Home Assistant Core is introducing a deprecation related to how the OAuth 2.0 Helper handles token refresh failures.

Refresh token failures will now be surfaced to integrations via the exception `ConfigEntryRefreshTokenFailed`.

### Background

When an OAuth 2.0 refresh token failed, Home Assistant would allow the underlying `aiohttp.ClientResponseError` to propagate directly to the integration. This behavior is being deprecated.

In a future release, OAuth 2.0 token refresh failures will instead raise a dedicated Home Assistant exception: `ConfigEntryRefreshTokenFailed`

This provides a clearer and more consistent contract for integrations, and avoids coupling integration logic to `aiohttp` internals.


#### Update exception handling

Update the exception handling and then continue to work out if it's a (non-)recoverable error in the integration. For example:

```python
from homeassistant.exceptions import ConfigEntryRefreshTokenFailed, ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import UpdateFailed

except ConfigEntryRefreshTokenFailed as err:
    if isinstance((cause := err.__cause__), ClientResponseError):
        match cause.status:
            case HTTPStatus.TOO_MANY_REQUESTS:
                raise UpdateFailed("Being rate limited here") from err
            case HTTPStatus.UNAUTHORIZED:
                raise ConfigEntryAuthFailed("Not authorized") from err
    return self.async_abort(reason="oauth_failed")
```
