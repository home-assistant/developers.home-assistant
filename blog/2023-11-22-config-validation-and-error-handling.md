---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Config processing and error handling
---

## Changes in component config processing and error handling

The way component YAML configuration is processed has been changed. Now it is possible to raise if an error occurs. Some custom integrations might break if they are using `config.async_process_component_and_handle_errors`.
Instead they can use `config.async_process_component_and_handle_errors` now. This new method supports raising when an error occurs during config processing.
From now on failures will no longer be notified as a persistent message, so integrations need to implement error handling to notify users in case of a failure. Notification are still added during setup in case of a config issue.

```python
async def async_process_component_and_handle_errors(
    hass: HomeAssistant,
    config: ConfigType,
    integration: Integration,
    raise_on_failure: bool = False,
) -> ConfigType | None:
...
```

```python
During a reload integrations can use the  `helpers.reload.async_integration_yaml_config`. This helper now also has the ability to raise in case of a failure.

async def async_integration_yaml_config(
    hass: HomeAssistant, integration_name: str, *, raise_on_failure: bool = False
) -> ConfigType | None:
...
```

## Translation support for Exceptions on config validation

A new `ConfigValidationError` exception class is introduced. It will be raised  in case an error occurs during config error handling and `raise_on_failure` is set to `True`. It can be re-raised to a `ServiceValidationError` in case this error is raised during the execution of a service call and a stack trace is not warranted. Translation keys are added to allow localization or the error messages.

### Background

- Background [discussion](https://github.com/home-assistant/architecture/discussions/992).
- Implementation [Core PR #102410](https://github.com/home-assistant/core/pull/102410).
