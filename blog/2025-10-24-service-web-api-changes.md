---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Service translations removed from WebSocket get_services and REST /api/services"
---

Action translations defined in `strings.json` are no longer included in responses from the WebSocket `get_services` command and the REST `/api/services` endpoint because they were incomplete and the Home Assistant frontend did not use them.

Legacy, untranslated action names and descriptions from `services.yaml` remain in both the WebSocket and REST responses.

Fetch complete action translations with the WebSocket command `frontend/get_translations`.

For details, see [core PR 147120](https://github.com/home-assistant/core/pull/147120).
