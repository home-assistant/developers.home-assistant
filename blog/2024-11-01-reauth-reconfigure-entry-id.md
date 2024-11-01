---
author: epenet
authorURL: https://github.com/epenet
title: "Reauth and reconfigure flows need to be linked to a config entry"
---

Starting a reauth or a reconfigure flow without a link to the config entry has been deprecated.

The correct linking will be done automatically in the following cases:
- reauth flows triggered when raising a `ConfigEntryAuthFailed` exception
- reauth flows triggered manually when calling `entry.async_start_reauth()`
- reconfigure flows started from the frontend

