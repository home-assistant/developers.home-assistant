---
author: epenet
authorURL: https://github.com/epenet
title: "New checks for config flow unique ID"
---

### Summary of changes

When a config flow creates an entry with a colliding unique ID, the old entry is currently automatically removed and replaced with the new config entry.
This can lead to unexpected behavior, and integrations should be adjusted to instead abort the flow.

In case of manual flows, integrations should implement options, reauth, reconfigure to allow the user to change settings.
In case of non user visible flows, the integration should optionally update the existing entry before aborting.

More details can be found in the [config flow](/docs/config_entries_config_flow_handler#unique-id-requirements) documentation.
