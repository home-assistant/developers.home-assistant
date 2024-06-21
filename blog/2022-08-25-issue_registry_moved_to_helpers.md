---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "The issue registry has been moved to homeassistant.helpers"
---

The issue registry has been moved from `homeassistant.components.repairs` to `homeassistant.helpers` and is now loaded together with the other registries very early during bootstrapping, before setup of any integrations.

This allows creating issues during validation of the configuration.
