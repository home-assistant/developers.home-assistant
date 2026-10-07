---
title: "Validate the input"
---

Validate the input your integration receives from users, whether it comes from a [config flow](core/integration/config_flow.md) or from YAML. We use [probatio](https://pypi.org/project/probatio/) to make sure the configuration provided by the user is valid. Some entries are optional, others are required. Others must be a defined type or come from an already-defined list.

Validating input up front gives users a clear error when something is wrong, instead of a confusing failure later during setup.

Besides [probatio](https://pypi.org/project/probatio/) default types, many custom types are available. For an overview, take a look at the [config_validation.py](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/config_validation.py) helper.

Some of those helpers are now thin aliases for a probatio validator, and core calls the validator directly:

| `config_validation` helper | probatio validator |
| -------------------------- | ------------------ |
| `cv.ensure_list`           | `probatio.EnsureList()` |
| `cv.port`                  | `probatio.Port()` |
| `cv.has_at_least_one_key`  | `probatio.AtLeastOne` |
| `cv.has_at_most_one_key`   | `probatio.AtMostOne` |

The `cv` names keep working for custom integrations, but a lint rule stops core from using them, so write the probatio form in an integration meant for core.

- Types: `string`, `byte`, and `boolean`
- Entity ID: `entity_id` and `entity_ids`
- Numbers: `small_float` and `positive_int`
- Time: `time`, `time_zone`
- Misc: `template`, `slug`, `temperature_unit`, `latitude`, `longitude`, `isfile`, `sun_event`, `url`, and `icon`

For integrations using [MQTT](https://www.home-assistant.io/components/mqtt/), `valid_subscribe_topic` and `valid_publish_topic` are available.

Some things to keep in mind:

- Use the constants defined in `const.py`
- In a config flow, pass a `probatio.Schema` as the `data_schema` for each step (see [config flow](core/integration/config_flow.md))
- For YAML configuration, validate with a `CONFIG_SCHEMA` (see [YAML configuration](core/integration/yaml_configuration.md))
- Preferred order is `required` first and `optional` second
- Default values for optional configuration keys need to be valid values. Don't use a default which is `None` like `probatio.Optional(CONF_SOMETHING, default=None): cv.string`, set the default to `default=''` if required.

### Snippets

These snippets show validation techniques you can use in any probatio schema, such as a config flow's `data_schema`.

#### Default name

It's common to set a default for a sensor if the user doesn't provide a name to use.

```python
DEFAULT_NAME = "Sensor name"

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_NAME, default=DEFAULT_NAME): cv.string,
    }
)
```

#### Limit the values

You might want to limit the user's input to a couple of options.

```python
DEFAULT_METHOD = "GET"

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_METHOD, default=DEFAULT_METHOD): probatio.In(
            ["POST", "GET"]
        ),
    }
)
```

#### Port

All port numbers are from a range of 1 to 65535.

```python
DEFAULT_PORT = 993

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_PORT, default=DEFAULT_PORT): probatio.Port(),
    }
)
```

#### Secrets

When a key holds a credential, wrap it in `probatio.Secret`. A validation failure then reports the path and the reason without the value, so a password does not end up in the log.

```python
DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_HOST): cv.string,
        probatio.Required(probatio.Secret(CONF_PASSWORD)): cv.string,
    }
)
```

A password that fails validation now reads:

```txt
Invalid config for 'demo': value should be a string for dictionary value 'password', got **REDACTED**
```

Mark a key whose value grants access, such as a password, a token, an API key or a PIN that authenticates. Do not mark a key that merely identifies something. A host, a serial number or a GPIO pin number is not a secret, and redacting it makes the error useless to the person trying to fix their configuration.

#### Lists

If a sensor has a pre-defined list of available options, test to make sure the configuration entry matches the list.

```python
SENSOR_TYPES = {
    "article_cache": ("Article Cache", "MB"),
    "average_download_rate": ("Average Speed", "MB/s"),
}

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Optional(CONF_MONITORED_VARIABLES, default=[]): probatio.All(
            probatio.EnsureList(), [probatio.In(SENSOR_TYPES)]
        ),
    }
)
```
