---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "The result attribute has been removed from the FlowResult typed dict"
---

The result attribute has been removed from the `homeassistant.data_entry_flow.FlowResult` typed dict, and is now present only when needed, i.e. `homeassistant.auth.models.AuthFlowResult` and `homeassistant.config_entries.ConfigFlowResult`.

The change is not expected to affect runtime behavior of custom integrations, but custom integration authors may need to update tests and any classes derived from `homeassistant.data_entry_flow.FlowResult` that use a `result` attribute, to silence type-checker warnings.