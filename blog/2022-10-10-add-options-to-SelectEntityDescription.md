---
author: epenet
authorURL: https://github.com/epenet
title: "Add options to SelectEntityDescription"
---

As of Home Assistant Core 2022.11, `options` is available as a standard property of `SelectEntityDescription`.
This might cause issues in custom integrations if a custom `options` property was previously implemented.

Please adjust the custom integration by either dropping or renaming the custom `options` property.
