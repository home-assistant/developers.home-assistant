---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: "Asking for a restart, without a repair issue"
---

As of Home Assistant Core 2026.11, integrations have one way to say "Home Assistant needs a restart to apply this". Home Assistant collects these into a single indicator for the user, with the list of integrations that asked. No more ten repair issues that all resolve with the same button.

For update entities, it is one attribute:

```python
class MyUpdate(UpdateEntity):
    _attr_post_restart_required = True
```

Once an install finishes, the update entity asks for the restart on your behalf.

For anything else, call the helper:

```python
from homeassistant.helpers import system_state

system_state.async_set_home_assistant_restart_required(hass, DOMAIN)
```

Once asked, it stays pending until Home Assistant restarts. There is no way to clear it.

## What to do

If your integration raises a repair issue that only tells the user to restart, replace it with one of the above.

Read more in the [asking for a restart](/docs/core/platform/restart_required) documentation.
