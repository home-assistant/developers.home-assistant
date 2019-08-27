---
title: "Style guidelines"
---

Home Assistant enforces code formatting with [Black](https://black.readthedocs.io/en/stable/). We automatically test every pull request as part of the build process. We strongly recommend setting up your IDE to automatically format files using Black and enabling a pre-commit hook to enforce it. For more information please see [this blog post](/blog/2019/07/31/black.html).

## Our recommendations

For some cases [PEPs](https://www.python.org/dev/peps/) don't make a statement. This section covers our recommendations about the code style. Those points were collected from the existing code and based on what contributors and developers were using the most. This is basically a majority decision, thus you may not agree with it. But we would like to encourage you follow those recommendations to keep the code unified.

### File headers

The docstring in the file header should describe what the file is about.

```python
"""Support for MQTT lights."""
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
