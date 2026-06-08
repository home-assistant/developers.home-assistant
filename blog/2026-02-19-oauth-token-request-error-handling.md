---
author: Erwin Douna
authorURL: https://github.com/erwindouna
authorImageURL: https://avatars.githubusercontent.com/u/5011203?s=96&v=4
title: "Changes in OAuth 2.0 helper error handling"
---

## Summary of changes

Starting as of `2026.3`, we're enhancing how the OAuth 2.0 helper handles token request and refresh token failures. This change makes error handling more robust, decoupled from the aiohttp library and helps integrations, that utilize the [Data Update Coordinator](https://developers.home-assistant.io/docs/integration_fetching_data/#coordinated-single-api-poll-for-data-for-all-entities), to automatically trigger the right error handling.

## What changes

When an OAuth 2.0 token request or token refresh failed, Home Assistant would allow the underlying `aiohttp.ClientResponseError` to propagate directly to the integration. This behavior is being changed and enhanced. 

We're introducing three new exceptions that provide clearer semantics:
- `OAuth2TokenRequestTransientError` - Recoverable errors, that can be retried.
- `OAuth2TokenRequestReauthError` - Non-recoverable errors, that require a reauthentication.
- `OAuth2TokenRequestError` - Base exception for when the above two criteria aren't met or to enable the integration to catch all token request exceptions.

### Data Update Coordinator

Most integrations that use the OAuth 2.0 helper, also use the Data Update Coordinator. When a token request or refresh token fails, the exceptions will bubble up in the Data Update Coordinator and now triggers the following error handling:

For unrecoverable errors (400+, except 429 (rate limit)):

- `OAuth2TokenRequestReauthError`: Data Update Coordinator raises `ConfigEntryAuthFailed` if exceptions should be raised or starts a reauthentication flow.

For transient errors (500+ and 429):

- `OAuth2TokenRequestTransientError`: Data Update Coordinator treats it as an `UpdateFailed` and the retry mechanism will be triggered.

This means that integrations that use the OAuth 2.0 helper in combination with the Data Update Coordinator don’t need to do any special handling of the new exceptions.

### Migration

Integrations that today use the OAuth 2.0 helper and handle `aiohttp.ClientResponseError` explicitly should adjust their error handling to deal with the new exceptions. To ease this transition, we have added a compatibility layer by having the new OAuth exceptions inherit from `aiohttp.ClientResponseError`. Existing code that catches this exception type should continue to work. It is however encouraged to refactor the code to use the new exceptions. See the code example for details.

#### Code example of migration

Update the exception handling and then continue to work out if it's a (non-)recoverable error in the integration. For example:

```python
    try:
        await auth.async_get_access_token()
    except OAuth2TokenRequestReauthError as err:
        raise ConfigEntryAuthFailed(
            translation_domain=DOMAIN, translation_key="reauth_required"
        ) from err
    except (OAuth2TokenRequestError, ClientError) as err:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN, translation_key="auth_server_error"
        ) from err
```
