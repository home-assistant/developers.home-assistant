---
title: "Backend Localization"
---

## Translation Strings

Platform translation strings are stored as JSON in the [core](https://github.com/home-assistant/core) repository. These files must be located adjacent to the component/platform they belong to. Components must have their own directory, and the file is simply named `strings.json` in that directory. For platforms, they are named `strings.<platform name>.json` in the platform directory. This file will contain the different strings that will be translatable.

### `strings.json`

The `strings.json` contains translations for different things that the integration offers that need to be translated.

| Category            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `title`             | Title of the integration.                         |
| `config`            | Translations for the config flow.                 |
| `device_automation` | Translations for device automations.              |
| `issues`            | Translations for repairs issues.                  |
| `options`           | Translations for the options flow.                |
| `state`             | States of the integration, keyed by device class. |

#### Title

This category is just a string: the translation of the integration name. This key is optional and Home Assistant will fallback to the integration name if it is omitted. Only include this if it's not a product brand.

#### Config / Options

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

#### Device automations

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

#### Issues

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

#### State

If your integration provides entities under its domain, you will want to translate the states. You do this by offering a `state` dictionary, that contains translations for states with different device classes. The key `_` is used for entities without a device class.

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

### `strings.sensor.json`

Integrations can provide translations for states of its entities under other integrations like sensor. To do this, the entity will need a custom device class that starts with `<domain>__<custom name>` (note double underscore). You can then provide translations that will only be applied for your entity. Note that you cannot customize your translation when you use an official device class. Those are standardized.

To differentiate entities and their translations, provide different device classes. The following example `strings.sensor.json` is for a Moon domain sensor entity with the `moon__phase` device class:

```json
{
  "state": {
    "moon__phase": {
      "new_moon": "New moon",
      "first_quarter": "First quarter",
      "full_moon": "Full moon",
      "last_quarter": "Last quarter"
    }
  }
}
```

### Test translations

In order to test changes to translation files, the translation strings must be compiled into Home Assistant’s translation directories by running the following script:

```shell
python3 -m script.translations develop
```

If translations do not show, clear the browser cache (cmd + R (for MacOS), ctrl + F5 (Windows and Linux))

### Introducing new strings

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
