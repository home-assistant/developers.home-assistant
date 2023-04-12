---
title: "Style guidelines"
---

Home Assistant enforces quite strict [PEP8 style](https://peps.python.org/pep-0008/) and [PEP 257 (Docstring Conventions)](https://peps.python.org/pep-0257/) compliance on all code submitted.

We use [Black](https://github.com/psf/black) for uncompromised code formatting. Every pull request is automatically checked as part of the linting process and we never merge submissions that diverge.

Summary of the most relevant points:

- Comments should be full sentences and end with a period.
- [Imports](https://peps.python.org/pep-0008/#imports) should be ordered.
- Constants and the content of lists and dictionaries should be in alphabetical order.

It is advisable to adjust IDE or editor settings to match those requirements.

## Our recommendations

For some cases [PEPs](https://peps.python.org/) don't make a statement. This section covers our recommendations about the code style. Those points were collected from the existing code and based on what contributors and developers were using the most. This is basically a majority decision, thus you may not agree with it. But we would like to encourage you follow those recommendations to keep the code consistent.

### File headers

The docstring in the file header should describe what the file is about.

```python
"""Support for MQTT lights."""
```

### Log messages

There is no need to add the platform or component name to the log messages. This will be added automatically. Like `syslog` messages there shouldn't be any period at the end. A widely used style is shown below but you are free to compose the messages as you like.

```python
_LOGGER.error("No route to device: %s", self._resource)
```

```log
2017-05-01 14:28:07 ERROR [homeassistant.components.sensor.arest] No route to device: 192.168.0.18
```

Do not print out API keys, tokens, usernames or passwords (even if they are wrong).
Also note that `_LOGGER.info` is reserved for the core, use `_LOGGER.debug` for anything else.

### Ordering of imports

Instead of ordering the imports manually, use [`isort`](https://github.com/PyCQA/isort).

```shell
pip3 install isort
isort homeassistant/components/sensor/fixer.py
```

### Use new style string formatting

Prefer [f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings) over `%` or `str.format`.

```python
# New
f"{some_value} {some_other_value}"
# Old, wrong
"{} {}".format("New", "style")
"%s %s" % ("Old", "style")
```

One exception is for logging which uses the percentage formatting. This is to avoid formatting the log message when it is suppressed.

```python
_LOGGER.info("Can't connect to the webservice %s at %s", string1, string2)
```

### Typing

We encourage the use of fully typing your code. This helps with finding/preventing issues and bugs in our codebase,
but also helps fellow contributors making adjustments to your code in the future as well.

By default, Home Assistant will statically check for type hints in our automated CI process.
Python modules can be included for strict checking, if they are fully typed, by adding an entry
to the `.strict-typing` file in the root of the Home Assistant Core project.
