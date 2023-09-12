---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "The websocket command entity/source has been modified"
---

The websocket command `entity/source` has been greatly simplified:
- It's no longer possible to get information for a single entity
- Only the domain of the entities is included in the response, the `custom_component` flag and `source` are no longer present.

The change was introduced in [core PR#99439](https://github.com/home-assistant/core/pull/99439)
