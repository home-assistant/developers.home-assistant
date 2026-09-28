---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?v=4
title: "Shared config flow abort reasons are translated centrally"
---

As of Home Assistant Core 2026.10, the `homeassistant` integration can translate abort reasons that every integration words the same way. If you're today linking from a local translation key, for an abort reason, to a shared translation key under the `homeassistant` integration, you can instead just rely on the shared translation key under the `homeassistant` domain directly. This is done by default in some helpers and can also be done explicitly by setting the `translation_domain` parameter when aborting the flow.

## What to do

* Delete the keys below from the `abort` sections of `strings.json`, including those under `config_subentries`, only when the abort uses the `homeassistant` translation domain.
* The helpers listed below use the central translation domain automatically.
* If your code passes one of these reasons to `async_abort` or `AbortFlow`, pass the `homeassistant` translation domain before deleting the local key. Without that domain, retain the local key. See [Raise one yourself](#raise-one-yourself).

When an abort uses the central translation domain, the frontend resolves the reason from that domain and does not use a local key.

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
