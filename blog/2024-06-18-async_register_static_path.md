---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Making http path registration async safe with `async_register_static_path`
---

`hass.http.register_static_path` is deprecated because it does blocking I/O in the event loop, instead call `await hass.http.async_register_static_path([StaticPathConfig(url_path, path, cache_headers)])`

The arguments to `async_register_static_path` are the same as `register_static_path` except they are wrapped in the `StaticPathConfig` `dataclass` and an `Iterable` of them is accepted to allow registering multiple paths at once to avoid multiple executor jobs.

For example, if your integration called
`hass.http.register_static_path("/integrations/photos","/config/photos",True)`, it should now call `await hass.http.async_register_static_path([StaticPathConfig("/integrations/photos","/config/photos",True)])`

The `StaticPathConfig` `dataclass` should be imported from `homeassistant.components.http`

`hass.http.register_static_path` will be removed in 2025.7

## Example

```python
from pathlib import Path
from homeassistant.components.http import StaticPathConfig

should_cache = False
files_path = Path(__file__).parent / "static"
files2_path = Path(__file__).parent / "static2"

await hass.http.async_register_static_path([
    StaticPathConfig("/api/my_integration/static", str(files_path), should_cache),
    StaticPathConfig("/api/my_integration/static2", str(files2_path), should_cache)
])
```