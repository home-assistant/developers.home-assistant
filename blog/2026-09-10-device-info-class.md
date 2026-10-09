---
author: epenet
authorURL: https://github.com/epenet
title: "DeviceInfo is now a class"
---

### Summary of changes

`DeviceInfo` and `ChildDeviceInfo` are no longer `TypedDict`s, they are classes with typed fields, which are read and written as attributes:

```python
device_info = DeviceInfo(identifiers={(DOMAIN, unique_id)}, name="My device")
device_info.sw_version = "1.2.3"
name = device_info.name
```

This change is included in Home Assistant Core 2026.X.

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
device_registry.async_get_or_create(config_entry_id=entry.entry_id, **device_info)

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

### What no longer works

**Keys which are not device info fields are rejected.** Previously they were silently kept, and either ignored or raised a `TypeError` later, when the device registry was called:

```python
# Raises TypeError: unexpected keyword argument 'id'
device_info = DeviceInfo(**device_payload)

# Raises KeyError: 'config_entry_id' is not a valid DeviceInfo field
device_info["config_entry_id"] = entry.entry_id
```

Arguments of `async_get_or_create` which are not device info fields, such as `config_entry_id`, are passed to the method directly.

**Some dict methods are gone**, as no integration was using them: `copy`, `setdefault`, `values`, `clear`, `popitem`, and `del device_info[key]`.

**A device info is no longer a `dict`.** `isinstance(device_info, dict)` returns `False`, and `dataclasses.asdict` no longer expands a device info held by a dataclass. Use `device_info.as_dict()` where a plain dictionary is needed. Serializing a device info to JSON with the Home Assistant helpers, for example in diagnostics or in a `Store`, is unchanged.

### Deprecated fields

`created_at`, `default_manufacturer`, `default_model`, `default_name`, `modified_at` and `via_device` are still accepted, and still log a deprecation warning when the device is created. They are not part of the typed fields, and will be removed in Home Assistant Core 2027.8 (`via_device`) and 2027.9 (the others). Use `manufacturer`, `model`, `name` and `via_device_id` instead.

### Child devices

`ChildDeviceInfo` is a class in the same way. An entity registers a child device by returning a `ChildDeviceInfo`, rather than by adding a `parent_device_id` key to a `DeviceInfo`:

```python
self._attr_device_info = ChildDeviceInfo(
    identifiers={(DOMAIN, unique_id)},
    name="Outlet 1",
    parent_device_id=parent.id,
)
```
