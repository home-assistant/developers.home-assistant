---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Service translations have been removed from WS get_services and REST /api/services"
---

Action translations defined in `strings.json` are no longer included in responses from the WebSocket `get_services` command and the REST `/api/services` endpoint because they were incomplete and the Home Assistant frontend did not use them.

Legacy untranslated action descriptions and names specified in `services.yaml` are still included both in the WS command and REST endpoint.

Complete action translations can instead be fetched with the WS command `frontend/get_translations`.

For more details, refer to the core [PR 147120](https://github.com/home-assistant/core/pull/147120) which implemented the change.
