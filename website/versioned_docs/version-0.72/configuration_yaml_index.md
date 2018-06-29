---
title: Configuration.yaml
sidebar_label: Introduction
id: version-0.72-configuration_yaml_index
original_id: configuration_yaml_index
---

`configuration.yaml` is a configuration file defined by the user. It is automatically created by Home Assistant on first launch. It defines which components to load.

## Pre-processing

Home Assistant will do some pre-processing on the config based on the components that are specified to load.

### CONFIG_SCHEMA

If a component defines a variable `CONFIG_SCHEMA`, the config object that is passed in will be the result of running the config through `CONFIG_SCHEMA`. `CONFIG_SCHEMA` should be a voluptuous schema.

### PLATFORM_SCHEMA

If a component defines a variable `PLATFORM_SCHEMA`, the component will be treated as an entity component. The configuration of entity components is a list of platform configurations.

Home Assistant will gather all platform configurations for this component. It will do so by looking for configuration entries under the domain of the component (ie `light`) but also under any entry of domain + extra text.

While gathering the platform configs, Home Assistant will validate them. It will see if the platform exists and if the platform defines a PLATFORM_SCHEMA, validate against that schema. If not defined, it will validate the config against the PLATFORM_SCHEMA defined in the component. Any configuration that references non existing platforms or contains invalid config will be removed.

The following `configuration.yaml`:

```yaml
unrelated_component:
  some_key: some_value

switch:
  platform: example1

switch living room:
  - platform: example2
    some_config: true
  - platform: invalid_platform
```

will be passed to the component as

```python
{
    "unrelated_component": {
        "some_key": "some_value"
    },
    "switch": [
        {
            "platform": "example1"
        },
        {
            "platform": "example2,
            "some_config": True
        }
    ]
}
```
