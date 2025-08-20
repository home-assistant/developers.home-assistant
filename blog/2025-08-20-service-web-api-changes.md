---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Service translations have been removed from WS get_services and REST /api/services"
---

Action translations specified in `strings.json` are no longer present in the response to the `get_services` WS command or the `/api/services` REST endpoint.
as they are ignored by frontend. 

Legacy untranslated action descriptions and names specified in `services.yaml` are still included both in the WS command and REST endpoint.

The reason for the change is that the action translations previously included in the response to the `get_services` WS command and the `/api/services` REST endpoint were incomplete and were ignored by the Home Assistant frontend.

Complete action translations can instead be fetched with the WS command `frontend/get_translations`.

For more details, refer to the core [PR 147120](https://github.com/home-assistant/core/pull/147120) which implemented the change.
