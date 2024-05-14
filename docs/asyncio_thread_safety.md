---
title: "Thread Safety with asyncio"
---

Developing with asyncio requires careful attention to thread safety, as nearly all asyncio objects are not thread-safe. If you are just getting started with asyncio, review Python's documentation on [Developing with asyncio](https://docs.python.org/3/library/asyncio-dev.html) for tips to avoid pitfalls. 

Home Assistant has some conventions for handling async and non-async code in the same code base. The top highlights are:

- Deciding how to run a function from a helper depends on whether it is decorated with `@callback` to indicate it will not block and is safe to run in the event loop; for more details, see [Working with Async](asyncio_working_with_async).
- Most APIs have a sync and async version when calling a function from a thread. The async APIs are prefixed with `async_`. For example, when firing an event from a thread other than the event loop, use `hass.bus.fire` instead of `hass.bus.async_fire`.

Be sure to enable [`asyncio` debug mode](https://docs.python.org/3/library/asyncio-dev.html#debug-mode) and [Home Assistant's built-in debug mode](https://www.home-assistant.io/integrations/homeassistant/#debug) during development as many thread safety errors can be detected automatically.

## Solving thread safety errors

You may have reached this page because Home Assistant detected and reported a thread safety error. Beginning in version 2024.5.0, Home Assistant can detect, report, and block some non-thread-safe operations to prevent system instability. Before Home Assistant could detect these errors, they may have led to unexpected restarts or undefined behaviors, as they can corrupt the internal asyncio state. Below are some tips on how to correct non-threaded operations.

### Ensuring code is run in the correct thread

#### Built-in helpers that take a callback

When using Home Assistant's built-in helpers such as `event.async_track_state_change_event` or `event.track_state_change_event`, it's important to call the correct API based on which thread the code runs in. If the code runs in a thread other than the event loop, use the non-`async` version.

In the below example, everything will run in the event loop thread, and when `async_track_state_change_event` fires,
`async_update_event_state_callback` will also be run in the event loop thread because it is decorated with `@callback`. If the `@callback` decorator is missing, `async_update_event_state_callback` would be run in the executor, which would make a non-thread-safe call to `async_write_ha_state`.

```python

    async def async_added_to_hass(self) -> None:
        """Entity has been added to hass."""
        self.async_on_remove(
            async_track_state_change_event(
                self.hass,
                ["light.other"],
                self.async_update_event_state_callback,
            )
        )

    @callback
    def async_update_event_state_callback(self, event: Event[EventStateChangedData]) -> None:
        """Call when entity state changes."""
        new_state = event.data["new_state"]
        if new_state is None or new_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return
        self.async_write_ha_state()

```

#### Specific API calls

You may find you need to call one of the async API calls from a thread other than the event loop thread. In most cases, `hass.add_job` can safely call an async API from another thread. Some helpers have specific sync APIs to use when calling from another thread. Below is a list of the most commonly called async APIs and the method to call them from another thread.

##### hass.async_create_task

When creating a task from a thread other than the event loop thread, instead use `hass.create_task`

##### hass.bus.async_fire

When firing an event from a thread other than the event loop thread, instead use `hass.bus.fire`

##### hass.services.async_register

When registering a services from a thread other than the event loop thread, instead use `hass.services.register`

##### hass.services.async_remove

When removing a services from a thread other than the event loop thread, instead use `hass.services.remove`

##### async_write_ha_state

When writing the state of an entity from a thread other than the event loop thread, instead use `self.schedule_update_ha_state`

##### hass.config_entries.async_update_entry

Updating config entry must be done in the event loop thread. There is no sync API to update config entries. If it is not a mistake that the calling function is running in another thread, use `hass.add_job` to schedule a function in the event loop that calls `hass.config_entries.async_update_entry`.

##### async_dispatcher_send

When calling the dispatcher from a thread other than the event loop thread, instead use `dispatcher_send`.

##### async_render_to_info

Templates must be rendered in the event loop thread. There is no sync API to render templates. Use `hass.add_job` to schedule a function in the event loop that calls `async_render_to_info`.

##### area_registry.async_create

The area registry must be modified in the event loop thread. There is no sync API for the area registry. Use `hass.add_job` to schedule a function in the event loop that calls `area_registry.async_create`.

##### area_registry.async_delete

The area registry must be modified in the event loop thread. There is no sync API for the area registry. Use `hass.add_job` to schedule a function in the event loop that calls `area_registry.async_delete`.

##### area_registry.async_update

The area registry must be modified in the event loop thread. There is no sync API for the area registry. Use `hass.add_job` to schedule a function in the event loop that calls `area_registry.async_update`.

##### category_registry.async_create

The category registry must be modified in the event loop thread. There is no sync API for the category registry. Use `hass.add_job` to schedule a function in the event loop that calls `category_registry.async_create`.

##### category_registry.async_delete

The category registry must be modified in the event loop thread. There is no sync API for the category registry. Use `hass.add_job` to schedule a function in the event loop that calls `category_registry.async_delete`.

##### category_registry.async_update

The category registry must be modified in the event loop thread. There is no sync API for the category registry. Use `hass.add_job` to schedule a function in the event loop that calls `category_registry.async_update`.

##### device_registry.async_update_device

The device registry must be modified in the event loop thread. There is no sync API for the device registry. Use `hass.add_job` to schedule a function in the event loop that calls `device_registry.async_update_device`.

##### device_registry.async_remove_device

The device registry must be modified in the event loop thread. There is no sync API for the device registry. Use `hass.add_job` to schedule a function in the event loop that calls `device_registry.async_remove_device`.

##### entity_registry.async_get_or_create

The entity registry must be modified in the event loop thread. There is no sync API for the entity registry. Use `hass.add_job` to schedule a function in the event loop that calls `entity_registry.async_get_or_create`.

##### entity_registry.async_remove

The entity registry must be modified in the event loop thread. There is no sync API for the entity registry. Use `hass.add_job` to schedule a function in the event loop that calls `entity_registry.async_remove`.

##### entity_registry.async_update_entity

The entity registry must be modified in the event loop thread. There is no sync API for the entity registry. Use `hass.add_job` to schedule a function in the event loop that calls `entity_registry.async_update_entity`.

##### floor_registry.async_create

The floor registry must be modified in the event loop thread. There is no sync API for the floor registry. Use `hass.add_job` to schedule a function in the event loop that calls `floor_registry.async_create`.

##### floor_registry.async_delete

The floor registry must be modified in the event loop thread. There is no sync API for the floor registry. Use `hass.add_job` to schedule a function in the event loop that calls `floor_registry.async_delete`.

##### floor_registry.async_update

The floor registry must be modified in the event loop thread. There is no sync API for the floor registry. Use `hass.add_job` to schedule a function in the event loop that calls `floor_registry.async_update`.

##### issue_registry.async_get_or_create

The issue registry must be modified in the event loop thread. Call `issue_registry.create_issue` instead.

##### issue_registry.async_delete

The issue registry must be modified in the event loop thread. Call `issue_registry.delete_issue` instead.

##### issue_registry.async_ignore

The issue registry must be modified in the event loop thread. There is no sync API to ignore an issue in the issue registry. Use `hass.add_job` to schedule a function in the event loop that calls `issue_registry.async_ignore_issue`.

##### label_registry.async_create

The label registry must be modified in the event loop thread. There is no sync API for the label registry. Use `hass.add_job` to schedule a function in the event loop that calls `label_registry.async_create`.

##### label_registry.async_delete

The label registry must be modified in the event loop thread. There is no sync API for the label registry. Use `hass.add_job` to schedule a function in the event loop that calls `label_registry.async_delete`.

##### label_registry.async_update

The label registry must be modified in the event loop thread. There is no sync API for the label registry. Use `hass.add_job` to schedule a function in the event loop that calls `label_registry.async_updat`.
