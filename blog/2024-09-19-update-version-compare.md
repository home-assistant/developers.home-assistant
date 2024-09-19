---
author: Simone Chemelli
authorURL: https://github.com/chemelli74
title: "Version compare for Update platform can now be overwritten"
---

With the merge of [core PR #124797](https://github.com/home-assistant/core/pull/124797), which landed in Home Assistant Core 2024.10, there is a new method in the update platform: "".

Before this change, he compare logic between firmware installed version, new available version and beta version was hardcoded.

Now the new method allows developers to customize this comparison writing their own method.
Here an example (implemented for Shelly gen1 devices):

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
