---
title: "Blocking operations with asyncio"
---

When writing asyncio code, it's essential to ensure that all blocking operations are done in a separate thread. If blocking operations happen in the event loop, nothing else can run until the operation is complete. For this reason, no blocking operations happen in the event loop, as the entire system will stall for the duration of the blocking operation.
Detailed examples of operations that might block, such as network I/O or heavy computation, are discussed below.

:::tip
Be sure to enable [`asyncio` debug mode](https://docs.python.org/3/library/asyncio-dev.html#debug-mode) and [Home Assistant's built-in debug mode](https://www.home-assistant.io/integrations/homeassistant/#debug) during development as many blocking I/O errors can be detected automatically.
:::

## Solving blocking I/O in the event loop

You may have reached this page because Home Assistant detected and reported a blocking call in the event loop. Beginning in version 2024.7.0, Home Assistant can detect more blocking operations in the event loop to prevent system instability. Before Home Assistant could detect these errors, they may have led to an unresponsive system or undefined behavior. Below are some tips on correcting blocking operations in the event loop.

## Running blocking calls in the executor

In Home Assistant this is usually accomplished by calling `await hass.async_add_executor_job`. In library code, `await loop.run_in_executor(None, ...)` is usually used. Review Python's documentation on [Running Blocking Code](https://docs.python.org/3/library/asyncio-dev.html#running-blocking-code) for tips to avoid pitfalls. Some specific calls may need different approaches.

```python
from functools import partial

def blocking_code(some_arg: str):
    ...

def blocking_code_with_kwargs(kwarg: bool = False):
    ...

# When calling a blocking function inside Home Assistant
result = await hass.async_add_executor_job(blocking_code, "something")

result = await hass.async_add_executor_job(partial(blocking_code_with_kwargs, kwarg=True))

# When calling a blocking function in your library code
loop = asyncio.get_running_loop()

result = await loop.run_in_executor(None, blocking_code, "something")

result = await loop.run_in_executor(None, partial(blocking_code_with_kwargs, kwarg=True))
```

### Specific function calls

Depending on the type of blocking call that was detected, the solution may be more nuanced.

#### open

`open` does blocking disk I/O and should be run in the executor with the standard methods above.

:::warning
When an `open` call running in the event loop is fixed, all the blocking reads and writes must also be fixed to happen in the executor. Home Assistant can only detect the `open` call and cannot detect the blocking reads and writes, which means if the blocking read and write calls are not fixed at the same time as the `open` call, they will likely torment users of the integration for a long time as they will be very hard to discover.
:::

#### import_module

When importing a module, the import machinery has to read the module from disk which does blocking I/O. Importing modules is both CPU-intensive and involves blocking I/O, so it is crucial to ensure these operations are executed in the executor.

Importing code in [cpython is not thread-safe](https://github.com/python/cpython/issues/83065). If the module will only ever be imported in a single place, the standard executor calls can be used. If there's a possibility of the same module being imported concurrently in different parts of the application, use the thread-safe `homeassistant.helpers.importlib.import_module` helper.

Example:

```python
platform = await async_import_module(hass, f"homeassistant.components.homeassistant.triggers.{platform_name}")
```

#### sleep

A blocking sleep should be replaced with `await asyncio.sleep` instead. The most common reported blocking `sleep` in the event loop is `pyserial-asyncio` which can be replaced with [`pyserial-asyncio-fast`](https://github.com/home-assistant-libs/pyserial-asyncio-fast) which does not have this issue.

#### putrequest

urllib does blocking I/O and should be run in the executor with the standard methods above. Consider converting the integration to use `aiohttp` or `httpx` instead.

#### glob

`glob.glob` does blocking disk I/O and should be run in the executor with the standard methods above.

#### iglob

`glob.iglob` does blocking disk I/O and should be run in the executor with the standard methods above.

#### walk

`os.walk` does blocking disk I/O and should be run in the executor with the standard methods above.

#### listdir

`os.listdir` does blocking disk I/O and should be run in the executor with the standard methods above.

#### scandir

`os.scandir` does blocking disk I/O and should be run in the executor with the standard methods above.

#### stat

`os.stat` does blocking disk I/O and should be run in the executor with the standard methods above.

#### write_bytes

`write_bytes` does blocking disk I/O and should be run in the executor with the standard methods above.

#### write_text

`write_text` does blocking disk I/O and should be run in the executor with the standard methods above.

#### read_bytes

`read_bytes` does blocking disk I/O and should be run in the executor with the standard methods above.

#### read_text

`read_text` does blocking disk I/O and should be run in the executor with the standard methods above.

#### load_default_certs

`SSLContext.load_default_certs` does blocking disk I/O to load the certificates from disk. 

The following helpers ensure that the blocking I/O will happen in the executor:

- `aiohttp`: `homeassistant.helpers.aiohttp_client.async_get_clientsession` to create the `aiohttp.ClientSession`.
- `httpx`: `homeassistant.helpers.httpx_client.get_async_client` to create the `httpx.AsyncClient`.
- Generic SSL: `homeassistant.util.ssl`

#### load_verify_locations

See [load_default_certs](#load_default_certs)

#### load_cert_chain

See [load_default_certs](#load_cert_chain)
