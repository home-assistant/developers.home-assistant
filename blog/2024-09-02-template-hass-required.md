---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Template.hass is no longer automatically set when rendering templates"
---

With the merge of [core PR #89242](https://github.com/home-assistant/core/pull/124656), which landed in Home Assistant Core 2023.4, `Template.hass` will be set on `Template` objects created during schema validation.

Before this change, it was necessary to check and set `Template.hass` before rendering templates, and this happened in numerous places throughout the codebase.
Such code has been removed from Home Assistant Core, which impacts custom integration authors:
- Custom integrations which create `Template` objects manually must pass a valid `hass` object to the constructor. This is in particular the case when creating templates for config entries. Not passing a `hass` object will trigger a deprecation warning and fail in Home Assistant Core 2025.10.
- The helper function `template.attach` no longer serves a purpose and is no longer used by core. It has been marked as deprecated, and scheduled for removal in Home Assistant Core 2025.10.
