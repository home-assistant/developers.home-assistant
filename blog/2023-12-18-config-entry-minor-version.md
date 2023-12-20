---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Config entry now supports minor versions"
---

Config entry now supports minor versions.

If minor versions differ but major versions are same, integration setup will be allowed to continue even if the integration does not implement `async_migrate_entry`. This means a minor version bump is backwards compatible unlike a major version bump which causes the integration to fail setup if the user downgrades HA Core without restoring configuration from backup.

### Background

We have been very conservative with versioning config entry data because it breaks downgrading to an older version of Home Assistant Core. This means in most cases we don't version, and the integrations instead do a kind of soft upgrade where they may for example do `dict.get` on config entry data which was not in an initial version, transform the data during setup etc.

By introducting minor versions, similar to that already offered by the storage helper, this pattern is no longer recommended.
A bump of the minor version should be done instead whenever the newly added, or otherwise changed, data does not break older versions.

More details can be found in the [documentation on donfig entry migration](docs/config_entries_config_flow_handler#config-entry-migration) and in [core PR #105749](https://github.com/home-assistant/core/pull/105479).
