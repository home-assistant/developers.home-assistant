---
title: "Backend Localization"
---

## Translation Strings

Platform translation strings are stored as JSON in the [home-assistant](https://github.com/home-assistant/home-assistant) repository. These files must be located adjacent to the component/platform they belong to. Components must have their own directory, and the file is simply named `strings.json` in that directory. For platforms, they are named `strings.<platform name>.json` in the platform directory. This file will contain the different strings that will be translatable.

### `strings.json`

The `strings.json` contains translations for different things that the integration offers that need to be translated.

| Category            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `title`             | Title of the integration.                         |
| `state`             | States of the integration, keyed by device class. |
| `config`            | Translations for the config flow.                 |
| `options`           | Translations for the options flow.                |
| `device_automation` | Translations for the device automations.          |

#### Title

This category is just a string: the translation of the integration name. This key is optional and Home Assistant will fallback to the integration name if it is omitted. Only include this if it's not a product brand.

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

#### Config / Options

The translation strings for the configuration flow handler are defined under the `config` key. An example strings file below describes the different supported keys:

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

### `strings.sensor.json`

Integrations can provide translations for states of its entities under other integrations like sensor. To do this, the entity will need a custom device class that starts with `<domain>__<custom name>`. You can then provide translations that will only be applied for your entity. Note that you cannot customize your translation when you use an official device class. Those are standardized.

To differentiate entities and their translations, provide different device classes. The following example `strings.sensor.json` is for a Moon sensor entity with the `moon__phase` device class:

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
