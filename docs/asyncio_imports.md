---
title: "Importing code with asyncio"
---

Determining when it is safe to import code when using asyncio can be tricky because two constraints need to be considered:

- Importing code can do blocking I/O to load the files from the disk
- Importing code in [cpython is not thread-safe](https://github.com/python/cpython/issues/83065)

## Module level imports

If your imports are at the **module level** (also called **top-level imports**) and all the necessary modules are imported in `__init__.py`, Home Assistant will load your integration either **before the event loop starts** or in a background thread using the **import executor**.

In this scenario, your imports are generally handled safely, so you **don’t need to worry** about whether they’re event-loop safe.

## Imports outside of module level

If your imports are not happening at module level, you must carefully consider each import, as the import machinery has to read the module from disk which does blocking I/O. If possible, it's usually best to change to a module level import, as it avoids much complexity and the risk of mistakes. Importing modules is both CPU-intensive and involves blocking I/O, so it is crucial to ensure these operations are executed in the executor.

If you can be sure that the modules have already been imported, using a bare [`import`](https://docs.python.org/3/reference/simple_stmts.html#import) statement is safe since Python will not load the modules again.

If the integration will always use the module, it's usually best to include a module-level import in `__init__.py` to ensure the module is loaded. However, if this creates a circular import, one of the solutions below will need to be used instead.

If the module is only used conditionally, and will only ever be imported in a single place, the standard executor calls can be used:

- For imports inside of Home Assistant `hass.async_add_executor_job(_function_that_does_late_import)`
- For imports outside of Home Assistant: [`loop.run_in_executor(None, _function_that_does_late_import)`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor)
If the same module may be imported concurrently in different parts of the application, use the thread-safe `homeassistant.helpers.importlib.import_module` helper.

If its possible the module may be imported from multiple different paths, use `async_import_module`:

Example:

```python
from homeassistant.helpers.importlib import async_import_module

platform = await async_import_module(hass, f"homeassistant.components.homeassistant.triggers.{platform_name}")
```

## Determining if a module is already loaded

If you are unsure if a module is already loaded, you can check if the module is already in [`sys.modules`](https://docs.python.org/3/library/sys.html#sys.modules). You should know that the module will appear in `sys.modules` as soon as it begins loading, and [cpython imports are not thread-safe](https://github.com/python/cpython/issues/83065). For this reason, it's important to consider race conditions when code may be imported from multiple paths.

## Avoiding imports that are only used for type-checking

IIf an imported module is only used for type checking, it is recommended to guard it with an `if TYPE_CHECKING:` block to avoid it being imported at runtime.

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from some_module import SomeClass  # Only imported for type checking

def some_function() -> SomeClass:
    # Function implementation
    pass
```