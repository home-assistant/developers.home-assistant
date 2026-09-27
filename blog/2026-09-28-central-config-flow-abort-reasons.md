---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?v=4
title: "Shared config flow abort reasons are translated centrally"
---

As of Home Assistant Core 2026.10, the `homeassistant` integration translates the abort reasons that every integration words the same way. You can delete them from your `strings.json`.

## What to do

* Delete the keys below from the `abort` sections of `strings.json`, including those under `config_subentries`.
* If your own code raises one of them, pass the translation domain first. See [Raise one yourself](#raise-one-yourself).

Keys left in place are no longer used, because the frontend resolves the reason from the domain passed with the abort.

## Covered reasons

| Reason                    | Raised by                                                                      |
|---------------------------|--------------------------------------------------------------------------------|
| `already_in_progress`     | `async_set_unique_id`, discovery without a unique ID                           |
| `single_instance_allowed` | `single_config_entry`, `DiscoveryFlowHandler`, `WebhookFlowHandler`            |
| `no_devices_found`        | `DiscoveryFlowHandler`                                                         |
| `cloud_not_connected`     | `WebhookFlowHandler`                                                           |
| `reauth_successful`       | `async_update_reload_and_abort`, `async_update_and_abort`                      |
| `reconfigure_successful`  | `async_update_reload_and_abort`, `async_update_and_abort`, also for subentries |

The nine OAuth2 reasons of `AbstractOAuth2FlowHandler` are covered too: `authorize_url_timeout`, `missing_credentials`, `no_url_available`, `oauth_error`, `oauth_failed`, `oauth_implementation_unavailable`, `oauth_timeout`, `oauth_unauthorized`, `user_rejected_authorize`.

## Raise one yourself

Pass the domain that owns the string. Both `async_abort` and `AbortFlow` accept it.

```python
from homeassistant.core import DOMAIN as HOMEASSISTANT_DOMAIN

return self.async_abort(
    reason="no_devices_found",
    translation_domain=HOMEASSISTANT_DOMAIN,
)
```

This works in config flows and subentry flows. Options flows look in the `options` section, which the `homeassistant` integration does not have.

## Keep your own wording

Only needed if you word a reason differently on purpose:

* Pass `reason` to `async_update_reload_and_abort` or `async_update_and_abort`, even with the default name.
* In an OAuth2 flow, pass `translation_domain=DOMAIN`.

Aborts that core raises by itself, like `already_in_progress`, always use the central string, to keep a customized string there, overwrite the steps that produce the strings upstream.
