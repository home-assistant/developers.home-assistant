---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecate verify_domain_control service helper"
---

### Summary of changes

The `homeassistant.helpers.service.verify_domain_control` helper function is deprecated,
and has been replaced with `verify_domain_entity_control`.

Since release `2025.1` (via core PR https://github.com/home-assistant/core/pull/133062),
a reference to `HomeAssistant` is available as a property of the `ServiceCall` object,
and it became redundant to pass `hass` object to `verify_domain_control`.

To update your integration:
1. Replace the decorator as shown in the first example below
2. (Optional) Move the nested functions to be module-level as shown in the second example below
3. Test the changes

The old `verify_domain_control` function will be removed in Home Assistant 2026.7.


### Examples

Minimum change is to simply adjust the decorator

```python
# Old
# def register_services(hass: HomeAssistant) -> None:
#   @verify_domain_control(hass, DOMAIN)
#   async def do_action(hass: HomeAssistant, call: ServiceCall) -> None:
#     ...
#   hass.services.async_register(...)

# New
def register_services(hass: HomeAssistant) -> None:
  @verify_domain_entity_control(DOMAIN)
  async def do_action(call: ServiceCall) -> None:
    ...

  hass.services.async_register(...)
```

To reduce code complexity, it is now recommended to move the service functions to be module-level functions

```python
# Old
# def register_services(hass: HomeAssistant) -> None:
#   @verify_domain_control(hass, DOMAIN)
#   async def do_action(call: ServiceCall) -> None:
#     entries = hass.config_entries.async_entries(DOMAIN)
#     ...
#   hass.services.async_register(...)

# New
@verify_domain_entity_control(DOMAIN)
async def do_action(call: ServiceCall) -> None:
  entries = call.hass.config_entries.async_entries(DOMAIN)
  ...

def register_services(hass: HomeAssistant) -> None:
  hass.services.async_register(...)
```
