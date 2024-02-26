---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Importing integrations that may block the event loop
---

Starting from Home Assistant 2024.3, `import_executor` can be specified in the `manifest.json` to facilitate importing an integration in the executor to avoid blocking the event loop. Setting this flag can significantly improve startup stability for integrations that do significant work at import time.

Debug logging is available by enabling the `homeassistant.loader` logger to help integration code owners determine import times. Consider enabling this flag if warnings are observed when using [asyncio debug mode](https://docs.python.org/3/library/asyncio-dev.html#asyncio-debug-mode) or import times take more than a few hundred milliseconds.

```yaml
# Example configuration.yaml entry
logger:
  default: info
  logs:
    homeassistant.loader: debug
    homeassistant.setup: debug
```