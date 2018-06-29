---
title: Checklist for creating a platform
id: version-0.72-creating_platform_code_review
original_id: creating_platform_code_review
---

A checklist of things to do when you're adding a new platform.

> Not all existing platforms follow the requirements in this checklist. This cannot be used as a reason to not follow them!

### 1. Requirements

 1. Requirement version should be pinned: `REQUIREMENTS = ['phue==0.8.1']`
 2. We no longer want requirements hosted on GitHub. Please upload to PyPi.
 3. Requirements should only be imported inside functions. This is necessary because requirements are installed on the fly.

### 2. Dependencies

 1. If you depend on a component for the connection, add it to your dependencies: `DEPENDENCIES = ['nest']`

### 3. Configuration

 1. Voluptuous schema present for config validation
 2. Voluptuous schema extends schema from component<br>(e.g., `light.hue.PLATFORM_SCHEMA` extends `light.PLATFORM_SCHEMA`)
 3. Default parameters specified in voluptuous schema, not in `setup_platform(…)`
 4. Your `PLATFORM_SCHEMA` should use as many generic config keys as possible from `homeassistant.const`
    ```python
    import voluptuous as vol

    from homeassistant.const import CONF_FILENAME, CONF_HOST
    from homeassistant.components.light import PLATFORM_SCHEMA
    import homeassistant.helpers.config_validation as cv

    CONF_ALLOW_UNREACHABLE = 'allow_unreachable'
    DEFAULT_UNREACHABLE = False

    PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
        vol.Required(CONF_HOST): cv.string,
        vol.Optional(CONF_ALLOW_UNREACHABLE,
                    default=DEFAULT_UNREACHABLE): cv.boolean,
        vol.Optional(CONF_FILENAME): cv.string,
    })
    ```
 5. Never depend on users adding things to `customize` to configure behavior inside your platform.

### 4. Setup Platform

 1. Test if passed in info (user/pass/host etc.) works.
 2. Group your calls to `add_devices` if possible.
 3. If platform adds extra services, format should be `<component>.<platform>_<service name>`.

### 5. Entity

 1. Extend entity from component, e.g., `class HueLight(Light)`.
 2. Avoid passing in `hass` as a parameter to the entity. When the entity has been added to Home Assistant, `hass` will be set on the entity by the helper in entity_platform.py. This means you can access `hass` as `self.hass` inside the entity.
 3. Do not call `update()` in constructor, use `add_devices(devices, True)` instead.
 4. Do not do any I/O inside properties. Cache values inside `update()` instead.
 5. The state and/or attributes should not contain relative time since something happened. Instead it should store UTC timestamps.

### 6. Communication with devices/services

 1. All API specific code has to be part of a third party library hosted on PyPi. Home Assistant should only interact with objects and not make direct calls to the API.

```python
# bad
status = requests.get(url('/status'))

# good
from phue import Bridge
bridge = Bridge(…)
status = bridge.status()
```
