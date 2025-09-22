---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecate hass argument in service helpers"
---

### Summary of changes

Providing `hass` argument to the following service helpers is deprecated:
`verify_domain_control`, `extract_entity_ids`, `async_extract_entities`, 
`async_extract_entity_ids`, and `async_extract_config_entry_ids`.

Since release `2025.1` (via core PR [#133062](https://github.com/home-assistant/core/pull/133062)),
a reference to `HomeAssistant` is available as a property of the `ServiceCall` object,
and it became redundant to pass the `hass` object to the above helpers.

To update your integration, just remove the `hass` argument.

Support for the `hass` argument will be removed in Home Assistant 2026.10.

### Examples

#### ID extraction helpers

```python
# Old
# target_entry_ids = await async_extract_config_entry_ids(hass, service_call)
# entity_ids = await async_extract_entity_ids(hass, service_call)
# entities = await service.async_extract_entities(hass, platform_entities.values(), service_call)

# New
target_entry_ids = await async_extract_config_entry_ids(service_call)
entity_ids = await async_extract_entity_ids(service_call)
entities = await service.async_extract_entities(platform_entities.values(), service_call)
```

#### Decorator helper

```python
# Old
# @verify_domain_control(hass, DOMAIN)
# async def do_action(call: ServiceCall) -> None:
#     ...

# New
@verify_domain_control(DOMAIN)
async def do_action(call: ServiceCall) -> None:
    ...
```
