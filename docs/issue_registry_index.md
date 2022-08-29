---
title: Issue Registry
---

The issue registry is a registry where Home Assistant keeps track of issues which should be brought to the user's attention.

## Issue properties

| Attribute |  Type    | Default | Description |
| --------- | -------- | ------- | ----------- |
| domain | string | | Domain raising the issue
| issue_id | string | | An identifier for the issue, must be unique within `domain`
| breaks_in_ha_version | string | `None` | The version in which the issue is breaking
| data | dict | `None` | Arbitrary data, not shown to the user
| is_fixable | boolean | | True if the issue can be automatically fixed
| is_persistent | boolean | | True if the issue should persists across restarts of Home Assistant
| issue_domain | string | `None` | Set by integrations creating issues on behalf of other integrations
| learn_more_url | string | `None` | URL where the user can find more details about an issue
| severity | IssueSeverity |  | Severity of the issue
| translation_key | str |  | Translation key with a brief explanation of the issue
| translation_placeholders | dict | `None` | Placeholders which will be injected in the translation

## Creating an issue

```python
from homeassistant.helpers import issue_registry as ir

ir.async_create_issue(
    hass,
    DOMAIN,
    "manual_migration",
    breaks_in_ha_version="2022.9.0",
    is_fixable=False,
    severity=IssueSeverity.ERROR,
    translation_key="manual_migration",
)
```

## Deleting an issue

Integrations typically don't need to delete issues, but it may be useful in some cases.

```python
from homeassistant.helpers import issue_registry as ir

ir.async_delete_issue(hass, DOMAIN, "manual_migration")
```

## Fixing an issue

If an issue has the `is_fixable` issue set to `True`, the user will be allowed to fix the issue. An issue which is succesfully fixed will be removed from the issue registry.

If the integration can perform some steps to fix an issue or to verify that the user has made the necessary manual steps, it should implement a [`repairs` platform](/docs/core/platform/repairs.md).
In some cases, fixing an issue may be done by the user by performing some manual steps which can't be verified by the integration, and no repairs platform is needed.
