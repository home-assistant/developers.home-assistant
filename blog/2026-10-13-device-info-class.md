---
author: epenet
authorURL: https://github.com/epenet
title: "DeviceInfo is now a dataclass"
---

### Summary of changes

`DeviceInfo` and `ChildDeviceInfo` are no longer `TypedDict`s. They are dataclasses with typed fields, which are read and written as attributes:

```python
device_info = DeviceInfo(identifiers={(DOMAIN, unique_id)}, name="My device")
device_info.sw_version = "1.2.3"
name = device_info.name
```

This change is included in Home Assistant Core 2026.11.

Dict-style access still works for now, so your integration keeps running, but it is a compatibility layer which will be deprecated and removed in a later version. Integrations should move to attributes.

### Migrating your integration

```python
# Old
device_info["sw_version"] = "1.2.3"
device_info.update({"model": "My model", "manufacturer": "My manufacturer"})

# New
device_info.sw_version = "1.2.3"
device_info.model = "My model"
device_info.manufacturer = "My manufacturer"
```

Reading a field which has not been set returns `UNDEFINED`, where `.get()` returned `None`. See [unset fields](#unset-fields).

```python
# Old
name = device_info.get("name")

# New
name = device_info.name
```

```python
# Old
self._attr_device_info: DeviceInfo = {
    ATTR_IDENTIFIERS: {(DOMAIN, unique_id)},
    ATTR_NAME: "My device",
}

# New
self._attr_device_info = DeviceInfo(
    identifiers={(DOMAIN, unique_id)},
    name="My device",
)
```

```python
# Old
new_device_info = device_info.copy()
new_device_info["name"] = "Other name"

# New
new_device_info = copy.copy(device_info)
new_device_info.name = "Other name"
```

```python
# Old
device_registry.async_get_or_create(
    config_entry_id=entry.entry_id, **device_info
)

# New
device_registry.async_get_or_create(
    config_entry_id=entry.entry_id, **device_info.as_dict()
)
```

### Unset fields

A field which has not been set reads as `UNDEFINED`, not as `None`, and `None` is a value like any other. Note that `UNDEFINED` is truthy, so test it explicitly:

```python
from homeassistant.helpers.typing import UNDEFINED

# Old
if "name" not in device_info:
    device_info["name"] = "My device"

# New
if device_info.name is UNDEFINED:
    device_info.name = "My device"
```

A field is unset again by assigning `UNDEFINED` to it:

```python
# Old
del device_info["name"]

# New
device_info.name = UNDEFINED
```

Only the fields which are set are passed on to the device registry, so an unset field leaves the corresponding value on the device unchanged.

### Serializing a device info

A dataclass is serialized field by field, unset fields included. orjson, which the Home Assistant JSON helpers use, writes every unset field as `0`. `dataclasses.asdict` keeps them as `UNDEFINED`. Whenever a device info is stored, sent in event data or a WebSocket message, or held by a dataclass which is serialized, use `device_info.as_dict()`, which returns the fields which are set:

```python
# Old
await store.async_save({"device_info": device_info})

# New
await store.async_save({"device_info": device_info.as_dict()})
```

### What no longer works

#### Keys which are not device info fields

Keys which are not device info fields are rejected. Previously they were silently kept, and either ignored or raised a `TypeError` later, when the device registry was called:

```python
# Raises TypeError: unexpected keyword argument 'id'
device_info = DeviceInfo(**device_payload)

# Raises KeyError: 'config_entry_id' is not a valid DeviceInfo field
device_info["config_entry_id"] = entry.entry_id
```

Arguments of `async_get_or_create` which are not device info fields, such as `config_entry_id`, are passed to the method directly.

#### Building from a mapping

`DeviceInfo({...})` raises a `TypeError`: pass the fields as keyword arguments.

#### Dict behavior

Some rarely used dict behavior is gone: `copy`, `setdefault`, `values`, `clear`, `popitem`, `pop`, `del device_info[key]`, merging with `|` or `|=`, iterating over a device info, and `len()`. Testing a field with `in` keeps working.

A device info is no longer a `dict`: `isinstance(device_info, dict)` returns `False`. Use `isinstance(device_info, DeviceInfo)`, or `device_info.as_dict()` where a plain dictionary is needed. An empty `DeviceInfo()` is no longer falsy either.

To check whether a field exists, for example to support older Home Assistant versions, use `"via_device_id" in DeviceInfo.__annotations__`. `__optional_keys__` and `__required_keys__` still work, but are part of the compatibility layer.

#### Modifying a converted sensor device info

`sensor_device_info_to_hass_device_info()` now returns a cached device info, shared by all devices with the same name, manufacturer, and model. It cannot be modified, and raises a `TypeError` if you try. Copy it first, with `copy.copy(device_info)`. If you add the same fields for every advertisement, build and cache your own `DeviceInfo` instead, so that it is not copied every time.

### Deprecated fields

`created_at`, `default_manufacturer`, `default_model`, `default_name`, `modified_at`, and `via_device` are still accepted, and still log a deprecation warning when the device is created. They are not part of the typed fields, and will be removed in Home Assistant Core 2027.8 (`via_device`) and 2027.9 (the others). Use `manufacturer`, `model`, `name`, and `via_device_id` instead.

### Child devices

`ChildDeviceInfo` is a dataclass in the same way. An entity registers a child device by returning a `ChildDeviceInfo`, rather than by adding a `parent_device_id` key to a `DeviceInfo`:

```python
self._attr_device_info = ChildDeviceInfo(
    identifiers={(DOMAIN, unique_id)},
    name="Outlet 1",
    parent_device_id=parent.id,
)
```
