---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Removal of RestoreStateData.last_states"
---

## Summary

As of Home Assistant Core 2026.11, states stored by the restore state helper are indexed by the entity's entity registry ID instead of by its entity ID. A stored state now follows its entity when the user changes the entity ID, and a stored state is never restored to a different entity which happens to reuse the entity ID.

As a consequence, `RestoreStateData.last_states` has been removed. Integrations which read stored states directly from `RestoreStateData` must use the new `RestoreStateData.async_get_stored_state` method instead.

Integrations which restore state by extending `RestoreEntity`, or one of its subclasses such as `RestoreSensor`, and call `async_get_last_state` or `async_get_last_extra_data` are not affected.

### `RestoreStateData.async_get_stored_state`

`RestoreStateData.async_get_stored_state` takes an entity ID and returns the `StoredState` of the entity, or `None` if there is no stored state. If the entity has an entity registry entry, the state is looked up by the entity registry ID, and the returned `StoredState.state` has the entity's current entity ID.

Before:

```python
from homeassistant.helpers import restore_state

stored_state = restore_state.async_get(hass).last_states.get(entity_id)
```

After:

```python
from homeassistant.helpers import restore_state

stored_state = restore_state.async_get(hass).async_get_stored_state(entity_id)
```

For more details, see [core PR #183906](https://github.com/home-assistant/core/pull/183906).
