---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Support for config subentries"
---

Config entries now have a new data type called “config subentry”. [Config subentries](config_entries_index.md) are owned by a config entry and set up as part of `async_setup_entry`. Config subentries are created by [config subentry flows](config_entries_config_flow_handler.md#subentry-flows) and updated by config subentry reconfigure flows. This works similarly to how we create/edit config entries.

This makes it easier for integration authors to allow users to add, modify and remove pieces of configuration which share some common resource, for example a cloud account or an MQTT broker.

The [arcitecture discussion](https://github.com/home-assistant/architecture/discussions/1070) gives more background.