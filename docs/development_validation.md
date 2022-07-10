---
title: "Validate the input"
---

The `configuration.yaml` file contains the configuration options for components and platforms. We use [voluptuous](https://pypi.python.org/pypi/voluptuous) to make sure that the configuration provided by the user is valid. Some entries are optional or could be required to set up a platform or a component. Others must be a defined type or from an already-defined list.

We test the configuration to ensure that users have a great experience and minimize notifications if something is wrong with a platform or component setup before Home Assistant runs.

Besides [voluptuous](https://pypi.python.org/pypi/voluptuous) default types, many custom types are available. For an overview, take a look at the [config_validation.py](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/config_validation.py) helper.

- Date/Time: `datetime`, `date`, `positive_timedelta`, `time_period_seconds`, `time_period_str`, `time_zone`, and `time`
- Entity ID: `entities_domain`, `entity_domain`, `entity_ids_or_uuids`, `entity_ids`, `entity_id_or_uuid`, and `entity_id`
- Location: `latitude`, `longitude`, and `gps`
- Numbers: `positive_float`, `positive_int`, and `small_float`
- String: `is_regex`, `matches_regex`, `match_all`, `slugify`, `slug`, `string_with_no_html`, `url_no_path`, `url`, and `whitespace`
- Types: `boolean`, `byte`, `enum`, and `string`
- Misc: `custom_serializer`, `deprecated`, `dynamic_template`, `ensure_list_csv`, `ensure_list`, `expand_condition_shorthand`, `fake_uuid4_hex`, `has_at_least_one_key`, `has_at_most_one_key`, `icon`, `isdevice`, `isdir`, `isfile`, `key_dependency`, `key_value_schemas`, `path`, `port`, `removed`, `remove_falsy`, `schema_with_slug_keys`, `service`, `socket_timeout`, `sun_event`, `temperature_unit`, `template_complex`, `template`, `uuid4_hex`, and `x10_address`

To validate platforms using [MQTT](https://www.home-assistant.io/components/mqtt/), `valid_subscribe_topic` and `valid_publish_topic` are available.

Some things to keep in mind:

- Use the constants defined in `const.py`
- Import `PLATFORM_SCHEMA` from the integration you are integrating with and extend it.
- Preferred order is `required` first and `optional` second
- Default values for optional configuration keys need to be valid values. Don't use a default which is `None` like `vol.Optional(CONF_SOMETHING, default=None): cv.string`, set the default to `default=''` if required.

### Snippets

This section contains snippets for the validation we use.

#### Default name

It's common to set a default for a sensor if the user doesn't provide a name to use.

```python
DEFAULT_NAME = "Sensor name"

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_NAME, default=DEFAULT_NAME): cv.string,
    }
)
```

#### Limit the values

You might want to limit the user's input to a couple of options.

```python
DEFAULT_METHOD = "GET"

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_METHOD, default=DEFAULT_METHOD): vol.In(["POST", "GET"]),
    }
)
```

#### Port

All port numbers are from a range of 1 to 65535.

```python
DEFAULT_PORT = 993

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): cv.port,
    }
)
```

#### Lists

If a sensor has a pre-defined list of available options, test to make sure the configuration entry matches the list.

```python
SENSOR_TYPES = {
    "article_cache": ("Article Cache", "MB"),
    "average_download_rate": ("Average Speed", "MB/s"),
}

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_MONITORED_VARIABLES, default=[]): vol.All(
            cv.ensure_list, [vol.In(SENSOR_TYPES)]
        ),
    }
)
```
