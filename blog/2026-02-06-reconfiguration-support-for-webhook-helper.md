---
author: tr4nt0r
authorURL: https://github.com/tr4nt0r
authorImageURL: https://avatars.githubusercontent.com/u/4445816
title: "Reconfiguration support for webhook helper"
---

Integrations that use the webhook config flow helper (`homeassistant.helpers.config_entry_flow.register_webhook_flow`) now support reconfiguration. This allows the integration to retrieve the webhook again, or obtain an updated webhook when the Home Assistant instance URL changes.

Custom integrations using the webhook config flow helper must add translation strings for the reconfiguration flow.

**Example translation strings for a reconfiguration flow:**

```json
{
  "config": {
    "abort": {
      "reconfigure_successful": "**Re-configuration was successful**\n\nIn Sleep as Android go to *Settings → Services → Automation → Webhooks* and update the webhook with the following URL:\n\n`{webhook_url}`"
    },
    "step": {
      "reconfigure": {
        "description": "Are you sure you want to re-configure the Sleep as Android integration?",
        "title": "Re-configure Sleep as Android"
      }
    }
  }
}
```

For more details, see [core PR #151729](https://github.com/home-assistant/core/pull/151729).
