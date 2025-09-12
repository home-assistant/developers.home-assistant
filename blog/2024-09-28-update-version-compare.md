---
author: Simone Chemelli
authorURL: https://github.com/chemelli74
title: "Version compare for Update platform can now be overwritten"
---

With the merge of [core PR #124797](https://github.com/home-assistant/core/pull/124797), which will land in Home Assistant Core 2024.10, there is a new method in the update platform: `version_is_newer()`.

Before this change, the compare logic between firmware installed version, new available version and beta version was hardcoded:

```python
def version_is_newer(self, latest_version: str, installed_version: str) -> bool:
    """Return True if latest_version is newer than installed_version."""
    return AwesomeVersion(latest_version) > installed_version
```

Now the new method allows developers to customize this comparison, writing their own method.
Here's an example (implemented for Shelly gen1 devices):

```python
def version_is_newer(self, latest_version: str, installed_version: str) -> bool:
    """Return True if available version is newer then installed version."""
    return AwesomeVersion(
        latest_version,
        find_first_match=True,
        ensure_strategy=[AwesomeVersionStrategy.SEMVER],
    ) > AwesomeVersion(
        installed_version,
        find_first_match=True,
        ensure_strategy=[AwesomeVersionStrategy.SEMVER],
    )
```
