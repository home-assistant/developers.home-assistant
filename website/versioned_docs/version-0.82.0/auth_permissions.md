---
title: Permissions
id: version-0.82.0-auth_permissions
original_id: auth_permissions
---

> This is an experimental feature that is not enabled or enforced yet

Permissions limit the things a user has access to or can control. Permissions are attached to groups, of which a user can be a member. The combined permissions of all groups a user is a member of decides what a user can and cannot see or control.

Permissions do not apply to the user that is flagged as "owner". This user  will always have access to everything.

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

If a category is omitted, the user will not have permission to that category.

When defining a policy, any dictionary value at any place can be replaced with `True` or `None`. `True` means that permission is granted and `None` means use default, which is deny access.

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

## Merging policies

If a user is a member of multiple groups, the groups permission policies will be combined into a single policy at runtime. When merging policies, we will look at each level of the dictionary and compare the values for each source using the following methodology:

1. If any of the values is `True`, the merged value becomes `True`.
2. If any value is a dictionary, the merged value becomes a dictionary created by recursively checking each value using this methodology.
3. If all values are `None`, the merged value becomes `None`.

Let's look at an example:

```python
{
  "entities": {
    "entity_ids": {
      "light.kitchen": True
    }
  }
}
```

```python
{
  "entities": {
    "entity_ids": True
  }
}
```

Once merged becomes

```python
{
  "entities": {
    "entity_ids": True
  }
}
```
