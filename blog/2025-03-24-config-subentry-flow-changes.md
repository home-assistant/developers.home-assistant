---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to ConfigSubentryFlow"
---

`ConfigSubentryFlow._reconfigure_entry_id` has been renamed to `ConfigSubentryFlow._entry_id` and `ConfigSubentryFlow._get_reconfigure_entry` has been renamed to `ConfigSubentryFlow._get_entry`.

The reason for the change is that both sub entry user flows and subentry reconfigure flows need access to parent config entry, e.g. getting options, data, etc.

Custom integrations which call either of the renamed methods need to update their implementations.

The change is introduced in the [home assistant core PR #141017](https://github.com/home-assistant/core/pull/141017).
