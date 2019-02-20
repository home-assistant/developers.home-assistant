---
title: Style guidelines
id: version-0.88.0-development_guidelines
original_id: development_guidelines
---

Home Assistant enforces strict [PEP8 style](https://www.python.org/dev/peps/pep-0008/) and [PEP 257 (Docstring Conventions)](https://www.python.org/dev/peps/pep-0257/) compliance on all code submitted. We automatically test every pull request as part of the linting process with [Coveralls](https://coveralls.io/github/home-assistant/home-assistant) and [Travis CI](https://travis-ci.org/home-assistant/home-assistant).

Summary of the most relevant points:

- Line length is limited to 79 characters (see below).
- Use 4 spaces per indentation level. We don't use tabs.
- Comments should be full sentences and end with a period.
- [Imports](https://www.python.org/dev/peps/pep-0008/#imports) should be ordered.
- Constants and the content of lists and dictionaries should be in alphabetical order.
- Avoid trailing whitespace but surround binary operators with a single space.
- Line separator should be set to `LF`.

The maximum line length comes directly from the [PEP8 style guide](https://www.python.org/dev/peps/pep-0008/#maximum-line-length), and is also used by the Python standard library. All code must pass these linting checks, and no exceptions will be made. There have already been numerous requests to increase the maximum line length, but after evaluating the options, the Home Assistant maintainers have decided to stay at 79 characters. This decision is final.

Those points may require that you adjust your IDE or editor settings.

## Our recommendations

For some cases [PEPs](https://www.python.org/dev/peps/) don't make a statement. This section covers our recommendations about the code style. Those points were collected from the existing code and based on what contributors and developers were using the most. This is basically a majority decision, thus you may not agree with it. But we would like to encourage you follow those recommendations to keep the code unified.

### Quotes

Use single quotes `'` for single word and `"` for multiple words or sentences.

```python
ATTR_WATERLEVEL = 'level'
CONF_ATTRIBUTION = "Data provided by the WUnderground weather service"
SENSOR_TYPES = {
    'alerts': ['Alerts', None],
}
```

### File headers

The docstring in the file header should describe what the file is about.

```python
"""Support for MQTT lights."""
```

### Requirements

Please place [Platform requirements](creating_platform_code_review.md#1-requirements) right after the imports.

```python
[...]
from homeassistant.helpers.entity import Entity

REQUIREMENTS = ['xmltodict==0.11.0']
```

### Log messages

There is no need to add the platform or component name to the log messages. This will be added automatically. Like `syslog` messages there shouldn't be any period at the end. Try to avoid brackets and additional quotes around the output to make it easier for users to parse the log. A widely style is shown below but you are free to compose the messages as you like.

```python
_LOGGER.error("No route to device: %s", self._resource)
```

```bash
2017-05-01 14:28:07 ERROR [homeassistant.components.sensor.arest] No route to device: 192.168.0.18
```

Don't print out wrong API keys, tokens, usernames, or passwords.
Also note that `_LOGGER.info` is reserved for the core, use `_LOGGER.debug` in anything else.

### Ordering of imports

Instead of order the imports manually, use [`isort`](https://github.com/timothycrosley/isort).

```bash
$ pip3 install isort
$ isort homeassistant/components/sensor/fixer.py 
```

### Use new style string formatting

Prefer [new style string formatting](https://www.python.org/dev/peps/pep-3101/) over old.

```python
"{} {}".format('New', 'style')
"%s %s" % ('Old', 'style')
```

Except when doing logging here the format is:

```python
_LOGGER.info("Can't connect to the webservice %s at %s", string1, string2)
```
