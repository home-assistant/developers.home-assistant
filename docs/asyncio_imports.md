---
title: "Importing code with asyncio"
---

Determining when it is safe to import code when using asyncio can be tricky because two constraints need to be considered:
Importing code can do blocking I/O to load the files from the disk
Importing code in [cpython is not thread-safe](https://github.com/python/cpython/issues/83065)

## Top-level imports

Suppose your imports happen at the top-level (nearly all code at indentation level 0). Home Assistant will import your code before the event loop starts or import it in the import executor when your integration is loaded. In this case, you likely do not need to consider whether your imports are safe.

## Imports outside of top-level

If your imports are not happening at top-level, you must carefully consider each import, as the import machinery has to read the module from disk which does blocking I/O. If possible, it's usually best to change to a top-level import, as it avoids much complexity and the risk of mistakes. Importing modules is both CPU-intensive and involves blocking I/O, so it is crucial to ensure these operations are executed in the executor.

If you can be sure that the modules have already been imported, using a bare [`import`](https://docs.python.org/3/reference/simple_stmts.html#import) statement is safe since Python will not load the modules again. If you are unsure, you can check if the module is already in [`sys.modules`](https://docs.python.org/3/library/sys.html#sys.modules). You should be aware that there is a race condition where the module may appear in `sys.modules` before they finish loading, and [cpython imports are not thread-safe](https://github.com/python/cpython/issues/83065).

If the module will only ever be imported in a single place, the standard executor calls can be used:
For imports inside of Home Assistant `hass.async_add_executor_job(_function_that_does_late_import)`
For imports outside of Home Assistant: [`loop.run_in_executor(None, _function_that_does_late_import)`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor)
If the same module may be imported concurrently in different parts of the application, use the thread-safe `homeassistant.helpers.importlib.import_module` helper.

Example:

```python
platform = await async_import_module(hass, f"homeassistant.components.homeassistant.triggers.{platform_name}")
```