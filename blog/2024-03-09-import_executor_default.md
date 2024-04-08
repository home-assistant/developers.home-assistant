---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Integrations import in the executor to avoid blocking the event loop"
---

Starting from Home Assistant 2024.4, all integrations are imported in the executor to avoid blocking the event loop while the code is imported and executed.

In the rare event that an integration creates loop-bound objects at import time, this may fail because there is no running loop in the executor.

Custom integrations needing more time to adjust their code to avoid creating such objects can opt-out and continue to have their code imported in the event loop, understanding that system stability will be impacted.

To opt-out of importing in the executor, an integration can add:

`"import_executor": false` to their [`manifest.json`](/docs/creating_integration_manifest)