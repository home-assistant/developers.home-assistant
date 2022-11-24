---
title: Repairs Issue Registry
---

The repairs issue registry is a registry where Home Assistant keeps track of repairs issues which should be brought to the user's attention.

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

## Issue life cycle

### Issue persistence

An issue will be kept in the issue registry until it's removed by the integration that created it or by the user [fixing](#fixing-an-issue) it.

The `is_persistent` flag controls if an issue should be shown to the user after a restart of Home Assistant:
- If the `is_persistent` flag is set on the issue, the issue will be shown again to the user after a restart. Use this for issues that can only be detected when they occur (update failed, unknown service in automation).
- If the `is_persistent` flag is not set on the issue, the issue will not be shown again to the user after a restart until it's created again by its integration. Use this for issues that can be checked for, like low disk space.

### Ignored issues

It's possible for the user to "ignore" issues. An ignored issue is ignored until it's explicitly deleted - either by the integration or by the user successfully walking through its [repair flow](#fixing-an-issue) - and then created again. Ignoring an issue takes effect across restarts of Home Assistant regardless of [issue persistence](#issue-persistence).

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
