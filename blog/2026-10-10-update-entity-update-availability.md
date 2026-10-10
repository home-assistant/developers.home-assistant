---
author: Tomer
authorURL: https://github.com/tomer-w
title: "Update entities can customize update availability"
---

As of Home Assistant Core 2026.11, update entities can override the new
`has_update` method to determine whether an update is available.

Previously, update entities determined availability by comparing
`installed_version` and `latest_version`. Integrations can still customize that
comparison by overriding `version_is_newer`, and existing implementations
continue to work unchanged.

Integrations whose device or service provides update availability directly can
now override `has_update` instead:

```python
def has_update(self) -> bool:
    """Return whether an update is available."""
    return self.device.update_available
```

Home Assistant calls `has_update` only when both versions are known and differ,
and the latest version has not been skipped. The default implementation calls
`version_is_newer`, preserving the existing behavior.

For more details, see the
[update entity documentation](/docs/core/entity/update#determine-update-availability).
