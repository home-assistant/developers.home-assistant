---
author: Joakim Plate
authorURL: https://github.com/elupus
title: "Update coordinator now allows retriggering"
---

The update coordinator with debouncer active will now accept a request for an update
while an update is currently in progress. The request will be queued up to be performed
after the current update finishes.

Consider the following case:

```python
async def _update():
    a = await get_a()
    # A: User or other logic request a new update here through async_schedule_update()
    b = await get_b()
    return (a,b)
```

A user or code that request an update at timestamp `A` expects that the entities linked will
all get new data from that time. However, since we previously ignore that request, entities
would have data for the value of `a` that is from a time before update request that was ignored.

To make sure we avoid this case, the update coordinator will now schedule an additional
update, if a request is received while currently executing an update.

A side effect of this is that it is now possible to schedule an update from inside an update
function of the coordinator. That is useful if for example a connection is lost mid update,
and we want all entities to indicate directly as unavailable, yet we want to attempt a
re-connect as quick as possible but do that in the next update cycle.
