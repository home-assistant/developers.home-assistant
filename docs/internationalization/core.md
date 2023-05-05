---
title: "Backend Localization"
---

## Translation Strings

Platform translation strings are stored as JSON in the [core](https://github.com/home-assistant/core) repository. These files must be located adjacent to the component/platform they belong to. Components must have their own directory, and the file is simply named `strings.json` in that directory. This file will contain the different strings that will be translatable.

The `strings.json` contains translations for different things that the integration offers that need to be translated.

| Category            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `title`             | Title of the integration.                         |
| `config`            | Translations for the config flow.                 |
| `device_automation` | Translations for device automations.              |
| `issues`            | Translations for repairs issues.                  |
| `options`           | Translations for the options flow.                |
| `selectors`         | Selectors of the integration.                     |
| `state`             | States of the integration, keyed by device class. |

### Title

This category is just a string: the translation of the integration name. This key is optional and Home Assistant will fallback to the integration name if it is omitted. Only include this if it's not a product brand.

### Config / Options

The translation strings for the configuration flow handler and the option flow handler are defined under the `config` and `options` keys respectively. An example strings file below describes the different supported keys. Although the example shows translations for a configuration flow, the translations for an option flow is exactly the same.

```json
{
  "config": {
    // Optional. Title to show in list. Only will be rendered if placeholders required
    "flow_title": "Discovered Device ({host})",
    "step": {
      "init": {
        // Optional. Will show the integration name if omitted
        "title": "The user visible title of the `init` step.",
        // Optional
        "description": "Markdown that is shown with the step.",
        "data": {
          "api_key": "The label for the `api_key` input field"
        }
      }
    },
    "error": {
      "invalid_api_key": "This message will be displayed if `invalid_api_key` is returned as a flow error."
    },
    "abort": {
      "stale_api_key": "This message will be displayed if `stale_api_key` is returned as the abort reason."
    },
    "progress": {
      "slow_task": "This message will be displayed if `slow_task` is returned as `progress_action` for `async_show_progress`."
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

### Issues

The translation strings for repairs issues are defined under the `issues` key. An example strings file below describes the different supported keys.

```json
{
  "issues": {
    "cold_tea": {
      // The title of the issue
      "title": "The tea is cold",
      // Translations for a fixable issue's repair flow, defined in the same way as translation for a configuration flow.
      // Exactly one of `fix_flow` or `description. must be present.
      "fix_flow": {
        "abort": {
          "not_tea_time": "Can not re-heat the tea at this time"
        }
      }
    },
    "unfixable_problem": {
      "title": "This is not a fixable problem",
      // Description of the issue, exactly one of `fix_flow` or `description. must be present.
      "description": "This issue can't be fixed by a flow."
    }
  }
}
```

### Entities

#### Name of entities
Integrations can provide translations for names of its entities. To do this, provide an `entity` object, that contains translations of the names and set the entity's `translation_key` property to a key under a domain in the `entity` object.
If the entity's `translation_key` property is not `None` and the `entity` object provides a translated name, `EntityDescription.name` will be ignored.

Entity components, like `sensor`, already have existing translations available that can be reused by referencing those. This includes common translations for entity names based on a device class. For example, it already has translations available for a "Temperature" sensor that can be referenced. Referencing existing translations is preferred, as it prevents translating the same thing multiple times.

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

#### State of entity components

If your integration provides entities under its domain, you will want to translate the states. You do this by offering a `state` object, that contains translations for states with different device classes. The key `_` is used for entities without a device class.

```json
{
  "state": {
    "problem": {
      "off": "OK",
      "on": "Problem"
    },
    "safety": {
      "off": "Safe",
      "on": "Unsafe"
    },
    "_": {
      "off": "[%key:common::state::off%]",
      "on": "[%key:common::state::on%]"
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

#### Entity attribute name and state of entity components

:::info
Translation of entity attribute names and states also requires frontend support, which is currently only available for `climate` entities.
:::

If your integration provides entities under its domain, you will want to translate the name of entity attributes and also entity state attributes. You do this by offering a `state_attributes` object, that contains translations for entity attributes with different device classes. The key `_` is used for entities without a device class.

```json
{
  "state_attributes": {
    "_": {
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
