---
author: Josef Zweck
authorURL: https://github.com/zweckj
authorImageURL: https://avatars.githubusercontent.com/u/24647999?v=4
title: "Shared config flow abort reasons are translated centrally"
---

Config flow abort reasons that every integration words the same way are now translated by the `homeassistant` integration. Integrations can delete these keys from the `abort` section of their `strings.json`.

## What changed

`FlowHandler.async_abort` accepts a `translation_domain`, so a flow can resolve its abort reason from another integration's translations. Whoever raises the abort passes it, which means an abort raised by core or by a helper no longer needs a string in the integration that owns the flow.

These reasons are already covered:

| Reason | Raised by |
| --- | --- |
| `single_instance_allowed` | core, in `config_entries` |
| `no_devices_found` | core discovery helpers |
| `cloud_not_connected` | `config_entry_flow` |
| `authorize_url_timeout`, `missing_credentials`, `no_url_available`, `oauth_error`, `oauth_failed`, `oauth_implementation_unavailable`, `oauth_timeout`, `oauth_unauthorized`, `user_rejected_authorize` | `AbstractOAuth2FlowHandler` |

An integration that still defines one of these keys keeps its own wording, so nothing breaks by leaving it in place. Removing it is the point: one less string to translate, and one less place for the wording to drift.


## Raising one yourself

Only keep an entry when the integration deliberately words it differently. A local definition still wins, since the central domain is only applied when the flow does not resolve the reason itself.

Most integrations never raise these directly. If yours does, name the domain that owns the string:

```python
return self.async_abort(
    reason="no_devices_found",
    translation_domain="homeassistant",
)
```
