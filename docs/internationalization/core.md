---
title: "Backend localization"
---

## Translation strings

Platform translation strings are stored as JSON in the [core](https://github.com/home-assistant/core) repository. These files must be located adjacent to the component/platform they belong to. Components must have their own directory, and the file is simply named `strings.json` in that directory. This file will contain the different strings that will be translatable.

The `strings.json` contains translations for different things that the integration offers that need to be translated.

| Category            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `title`             | Title of the integration.                         |
| `common`            | Shared strings.                                   |
| `config`            | Translations for the config flow.                 |
| `device`            | Translations for devices.                         |
| `device_automation` | Translations for device automations.              |
| `entity`            | Translations for entities.                        |
| `entity_component`  | Translations for entity components.               |
| `exceptions`        | Translations for error messages.                  |
| `issues`            | Translations for repairs issues.                  |
| `options`           | Translations for the options flow.                |
| `selectors`         | Selectors of the integration.                     |
| `services`          | Service actions of the integration.               |

### Title

This category is just a string: the translation of the integration name. This key is optional and Home Assistant will fallback to the integration name if it is omitted. Only include this if it's not a product brand.

### Shared strings

Strings which are used more than once should be not be duplicated, instead references should be used to refer to the single definition. The reference can be any valid translation key. Optionally, shared strings can be placed in a `common` section.

```json
{
  "common": {
    "error_stale_api_key": "This message will be displayed if `stale_api_key` is returned as the abort reason."
  },
  "config": {
    "error": {
      "invalid_api_key": "This message will be displayed if `invalid_api_key` is returned as a flow error.",
      // Reference to the common section
      "stale_api_key": "[%key:component::new_integration::common::error_stale_api_key%]"
    },
  }
  "options": {
    "error": {
      // Reference to another section in the same file
      "invalid_api_key": "[%key:component::new_integration::config::error::invalid_api_key%]",
      // Reference to the common section in the same file
      "stale_api_key": "[%key:component::new_integration::common::error_stale_api_key%]"
    },
  }
}
```

### Config / Options / Subentry flows

The translation strings for the configuration flow handler, the option flow handler and config subentry handlers are defined under the `config`, `options` and `config_subentries` keys respectively.

Note that `config_subentries` is a map of maps, where the keys are the subentry types supported by the integration.

The example strings file below describes the different supported keys. Although the example shows translations for a configuration flow, the options and subentry flow translations follow the same format.

```json
{
  "config": {
    // Optional. Title to show in list. Only will be rendered if placeholders required
    "flow_title": "Discovered Device ({host})",
    // Optional, only needed if the default translations in frontend are misleading
    "entry_type": "Label explaining what an entry represents",
    // Optional, only needed if the default translations in frontend are misleading
    "initiate_flow": {
        "reconfigure": "Menu or button label for starting a reconfigure flow",
        "user": "Menu or button label for starting a user flow"
    },
    "step": {
      "init": {
        // Optional. Will show the integration name if omitted
        "title": "The user visible title of the `init` step.",
        // Optional
        "description": "Markdown that is shown with the step.",
        "data": {
          "api_key": "The label for the `api_key` input field"
        },
        // Only needed if the form has sections
        "sections": {
          "auth_options": {
            "name": "The label for the `auth_options` section"
          }
        }
      }
    },
    "error": {
      "invalid_api_key": "This message will be displayed if `invalid_api_key` is returned as a flow error."
    },
    "abort": {
      "stale_api_key": "This message will be displayed if `stale_api_key` is returned as the abort reason. Supports Markdown."
    },
    "progress": {
      "slow_task": "This message will be displayed if `slow_task` is returned as `progress_action` for `async_show_progress`. Supports Markdown."
    },
    "create_entry": {
       "default": "This message will be displayed in the success dialog if `async_create_entry` is called with `description=None`. Supports Markdown.",
       "custom": "This message will be displayed in the success dialog if `async_create_entry` is called with `description='custom'`. Supports Markdown."
    }
  },
  "options": {
    // Same format as for config flow
  },
  "config_subentries": {
    "subentry_type_1": {
      // Same format as for config flow
    },
    "subentry_type_2": {
      // Same format as for config flow
    }
  }
}
```

### Selectors

The translation for selectors are defined under the `selector` key. It supports option label translations for the selector `select`. The integration should set the `translation_key` on the selector select configuration. This allows translations on select selectors used in config and options flows. An example strings file below describes the different supported keys.

```json
{
  "config": {
    "flow_title": "Discovered Device ({host})",
    "step": {
      "init": {
        "title": "The user visible title of the `init` step.",
        "description": "Markdown that is shown with the step.",
        "data": {
          // Config flow selector select with options that support translations
          "set_ca_cert": "Broker certificate validation"
        }
      }
    }
  },
  // Translations for selector select to be used in option and config flows
  "selector": {
    // The key is linked to the `translation_key` that needs to be set
    // using the SelectSelectorConfig class
    "set_ca_cert": {
      // The translations for the selector select option labels
      "options": {
        "off": "Off",
        "auto": "Auto",
        "custom": "Custom"
      }
    }
  }
}

```

The `unit_of_measurement` of a number selector may also be translated with a translation key:
```json
{
  // Translations for number selector to be used in option and config flows
  "selector": {
    // The key is linked to the `translation_key` that needs to be set
    // using the NumberSelectorConfig class
    "round_digits": {
      // The translations for the number selector unit_of_measurement
      "unit_of_measurement": {
        "decimals": "decimals"
      }
    }
  }
}
```

### Service Actions

The translations of service actions strings are defined under the `services` key.

It supports translating the `name` and `description` of each action,
`name` and `description` of each action's `fields`, and the `name` and `description` of
each collapsible section of fields.

Note that also the translations for `name` and `description` of fields which
are displayed in a collapsible section should be under the `fields` key.

```json
{
  "selector": {
    "fan_speed": {
      "options": {
        "high": "High",
        "low": "Low",
        "medium": "Medium",
        "off": "Off",
      }
    }
  },
  "services": {
    "set_speed": {
      "name": "Set speed",
      "description": "Sets fan speed.",
      "fields": {
        "speed": {
          "name": "Speed",
          "description": "The speed to set."
        }
      },
      "sections": {
        "advanced_fields": {
          "name": "Advanced options"
        }
      }
    }
  }
}
```

:::note
Service actions may use selectors in their `fields`. The translation of those selectors can be provided using the `translation_key` property on the selector definition in the services.yaml file. See the [Selectors](#selectors) section and the [Service action description](/docs/dev_101_services.md#service-action-descriptions) page for more information.
:::

### Device automations

The translation strings for device automations are defined under the `device_automation` key. An example strings file below describes the different supported keys.

```json
{
  "device_automation": {
    // Translations for supported device actions
    "action_type": {
      "open": "Open {entity_name}"
    }
    // Translations for supported device conditions
    "condition_type": {
      "is_open": "{entity_name} is open"
    }
    // Translations for supported device triggers
    "trigger_type": {
      "opened": "{entity_name} opened",
      "remote_button_short_press": "\"{subtype}\" button pressed",
    }
    // Translations for device trigger sub types, typically used for names of buttons
    "trigger_subtype": {
      "button_1": "First button"
    }
  }
}

```

### Exceptions

Localization is supported for `HomeAssistantError` and its subclasses.
The translation strings for exceptions are defined under the `exception` key in a `strings.json` file. The example below describes the different supported keys.

```json
{
  "exceptions": {
    // Translations for known exceptions
    "invalid_index": {
      "message": "Invalid index selected, expected [0,1,2]. Got {index}"
    }
  }
}

```

Example of raising an exception with localization during a service action call:

```python
async def async_select_index(hass: HomeAssistant, index: int) -> None:
    """Setup the config entry for my device."""
    try:
        check_index(index)
    except ValueError as exc:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_index",
            translation_placeholders={
                "index": index,
            },
        ) from exc
```

### Issues

The translation strings for repairs issues are defined under the `issues` key. An example strings file below describes the different supported keys.

```json
{
  "issues": {
    "cold_tea": {
      // The title of the issue
      "title": "The tea is cold",
      // Translations for a fixable issue's repair flow, defined in the same way as translation for a configuration flow.
      // Exactly one of `fix_flow` or `description`. must be present.
      "fix_flow": {
        "abort": {
          "not_tea_time": "Can not re-heat the tea at this time"
        }
      }
    },
    "unfixable_problem": {
      "title": "This is not a fixable problem",
      // Description of the issue, exactly one of `fix_flow` or `description`. must be present.
      "description": "This issue can't be fixed by a flow."
    }
  }
}
```

### Devices

#### Name of devices
Integrations can provide translations for names of its devices. To do this, provide a `device` object, that contains translations of the names and set the device's `translation_key` to a key under a domain in the `device` object.
If the device's `translation_key` is not `None`, the `name` which is either set in an entity's `device_info` property or passed to `DeviceRegistry.async_get_or_create`, will be ignored. If the `device` object does not provide a translated name for the specified `translation_key`, the `translation_key` will be used as device name.

It is also supported to use placeholders within the translation. If a placeholder is defined within the translation string, the device's `translation_placeholders` has to be set accordingly.

The following example `strings.json` is for a device with its `translation_key` set to `power_strip`:
```json
{
  "device": {
    "power_strip": {
      "name": "Power strip"
    }
  }
}
```

The following example `strings.json` is for a device with its `translation_key` property set to `n_ch_power_strip` and a placeholder `number_of_sockets`:

```json
{
  "device": {
    "n_ch_power_strip": {
      "name": "Power strip with {number_of_sockets} sockets"
    }
  }
}
```

### Entities

#### Name of entities
Integrations can provide translations for names of its entities. To do this, provide an `entity` object, that contains translations of the names and set the entity's `translation_key` property to a key under a domain in the `entity` object.
If the entity's `translation_key` property is not `None` and the `entity` object provides a translated name, `EntityDescription.name` will be ignored.

Localization of entity names is only supported for entities which set the [`has_entity_name`](/docs/core/entity#has_entity_name-true-mandatory-for-new-integrations) property to `True`.

Entity components, like `sensor`, already have existing translations available that can be reused by referencing those. This includes common translations for entity names based on a device class. For example, it already has translations available for a "Temperature" sensor that can be referenced. Referencing existing translations is preferred, as it prevents translating the same thing multiple times.

It is also supported to use placeholders within the translation. If a placeholder is defined within the translation string, the entity's `translation_placeholders` property has to be set accordingly.

The following example `strings.json` is for a `sensor` entity with its `translation_key` property set to `thermostat_mode`:
```json
{
  "entity": {
    "sensor": {
      "thermostat_mode": {
        "name": "Thermostat mode"
      }
    }
  }
}
```

The following example `strings.json` is for a `sensor` entity with its `translation_key` property set to `temperature_sensor` where a shared translation provided by the `sensor` integration is used:

```json
{
  "entity": {
    "sensor": {
      "temperature_sensor": {
        "name": "[%key:component::sensor::entity_component::temperature::name%]"
      }
    }
  }
}
```

The following example `strings.json` is for a `sensor` entity with its `translation_key` property set to `distance` and a placeholder `tracked_device`:

```json
{
  "entity": {
    "sensor": {
      "distance": {
        "name": "Distance of {tracked_device}"
      }
    }
  }
}
```

#### State of entities

Integrations can provide translations for states of its entities under other integrations like sensor if the base entity component does not provide translations, or if the translation provided by the base entity component do not match the integration's entity. To do this, provide an `entity` object, that contains translations for states and set the entity's `translation_key` property to a key under a domain in the `entity` object.

To differentiate entities and their translations, provide different translation keys. The following example `strings.json` is for a Moon domain `sensor` entity with its `translation_key` property set to `phase`:

```json
{
  "entity": {
    "sensor": {
      "phase": {
        "state": {
          "new_moon": "New moon",
          "first_quarter": "First quarter",
          "full_moon": "Full moon",
          "last_quarter": "Last quarter"
        }
      }
    }
  }
}
```

#### Entity state attributes

Integrations can provide translations for its entities' state attributes under other integrations like sensor if the base entity component does not provide translations, or if the translation provided by the base entity component do not match the integration's entity. To do this, provide an `entity` object, that contains translations for entity state attributes and set the entity's `translation_key` property to a key under a domain in the `entity` object.

To differentiate entities and their translations, provide different translation keys. The following example `strings.json` is for a `demo` domain `climate` entity with its `translation_key` property set to `ubercool`, which has custom `fan_mode` and `swing_mode` settings:


```json
{
  "entity": {
    "climate": {
      "ubercool": {
        "state_attributes": {
          "fan_mode": {
            "state": {
              "auto_high": "Auto High",
              "auto_low": "Auto Low",
              "on_high": "On High",
              "on_low": "On Low"
            }
          },
          "swing_mode": {
            "state": {
              "1": "1",
              "2": "2",
              "3": "3",
              "auto": "Auto",
              "off": "Off"
            }
          }
        }
      }
    }
  }
}
```
#### State of entity components

If your integration provides entities under its domain, you will want to translate the states. You do this by offering a `states` object under the `entity_component` dictionary, that contains translations for states with different device classes. The key `_` is used for entities without a device class.

```json
{
  "entity_component": {
    "problem": {
      "state": {
        "off": "OK",
        "on": "Problem"
      }
    },
    "safety": {
      "state": {
        "off": "Safe",
        "on": "Unsafe"
      }
    },
    "_": {
      "state": {
        "off": "[%key:common::state::off%]",
        "on": "[%key:common::state::on%]"
      }
    }
  }
}
```

#### Entity attribute name and state of entity components

:::info
Translation of entity attribute names and states also requires frontend support, which is currently only available for `climate` entities.
:::

If your integration provides entities under its domain, you will want to translate the name of entity attributes and also entity state attributes. You do this by offering a `state_attributes` object in the `entity_component` dictionary, that contains translations for entity attributes with different device classes. The key `_` is used for entities without a device class.

```json
{
  "entity_component": {
    "_": {
      "state_attributes": {
        "aux_heat": { "name": "Aux heat" },
        "current_humidity": { "name": "Current humidity" },
        "current_temperature": { "name": "Current temperature" },
        "fan_mode": {
          "name": "Fan mode",
          "state": {
            "off": "[%key:common::state::off%]",
            "on": "[%key:common::state::on%]",
            "auto": "Auto",
            "low": "Low",
            "medium": "Medium",
            "high": "High",
            "top": "Top",
            "middle": "Middle",
            "focus": "Focus",
            "diffuse": "Diffuse"
          }
        }
      }
    }
  }
}
```

#### Unit of measurement of entities

Integrations can provide translations for units of measurement of its entities. To do this, provide an `entity` object, that contains translations for the units and set the entity's `translation_key` property to a key under a domain in the `entity` object.
If the entity's `translation_key` property is not `None` and the `entity` object provides a translated unit of measurement, `SensorEntityDescription.native_unit_of_measurement` or `NumberEntityDescription.native_unit_of_measurement` should not be defined.

The following example `strings.json` is for a `sensor` entity with its `translation_key` property set to `goal`:
```json
{
  "entity": {
    "sensor": {
      "goal": {
        "unit_of_measurement": "steps"
      }
    }
  }
}
```

## Test translations

In order to test changes to translation files, the translation strings must be compiled into Home Assistant’s translation directories by running the following script:

```shell
python3 -m script.translations develop
```

If translations do not show, clear the browser cache (cmd + R (for MacOS), ctrl + F5 (Windows and Linux))

## Introducing new strings

To introduce new strings, add them to `strings.json` or to a platform strings file. Try to use as many references to common strings as possible. Common strings live in `homeassistant/strings.json`. You can refer to those translations using references. For example:

```json
{
  "config": {
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  }
}
```

After the pull request with the strings file is merged into the `dev` branch, the strings will be automatically uploaded to Lokalise, where contributors can submit translations. The translated strings in Lokalise will be periodically pulled in to the core repository.
