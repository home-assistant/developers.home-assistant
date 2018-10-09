---
title: "Permissions"
---

> This is an experimental feature that is not enabled or enforced yet

Permissions limit the things a user has access to or can control. Permissions are attached to groups, of which a user can be a member. The combined permissions of all groups decides what a user can and cannot see or control.

## General permission structure

Policies are dictionaries that at the root level consist of different categories of permissions. In the current implementation this is limited to just entities.

```python
{
  "entities": …
}
```

Each category can further split into subcategories that describe parts of that category.

```python
{
  "entities": {
    "domains": …,
    "entity_ids": …
  }
}
```


If a category is ommitted, the user will not have permission to that category.

When defining a policy, any value at any place can be replaced with `True`, `False` or `None`. `True` means that permission is granted, `False` means that access is denied and `None` means no opinion.

Note that if we apply just a single policy, `False` and `None` result in the same result: access is denied. If a user is a member of multiple groups, the permission policies will be merged. In that case, a `False` overrules all other values of the other policies and access is denied:

 - `True` merged with `None` becomes `True`
 - `True` merged with `False` becomes `False`

## Entities

Entity permissions can be set on a per entity and per domain basis using the subcategories `entity_ids` and `domains`. Granting access to an entity means a user will be able to read the state and control it.

If an entity is specified in both the `entity_ids` and `domains` subcategory, the `entity_ids` result will be used, unless it is `None`. In the following example, the user will have access to all light entities except for `light.kitchen`.

```python
{
  "entities": {
    "domains": {
      "light": True
    },
    "entity_ids": {
      "light.kitchen": False
    }
  }
}
```
