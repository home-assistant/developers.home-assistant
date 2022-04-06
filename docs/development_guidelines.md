---
title: "Style guidelines"
---

Home Assistant enforces quite strict [PEP8 style](https://www.python.org/dev/peps/pep-0008/) and [PEP 257 (Docstring Conventions)](https://www.python.org/dev/peps/pep-0257/) compliance on all code submitted.

We use [Black](https://github.com/psf/black) for uncompromised code formatting. Every pull request is automatically checked as part of the linting process and we never merge submissions that diverge.

Summary of the most relevant points:

- Comments should be full sentences and end with a period.
- [Imports](https://www.python.org/dev/peps/pep-0008/#imports) should be ordered.
- Constants and the content of lists and dictionaries should be in alphabetical order.

It is advisable to adjust IDE or editor settings to match those requirements.

## Our recommendations

For some cases [PEPs](https://www.python.org/dev/peps/) don't make a statement. This section covers our recommendations about the code style. Those points were collected from the existing code and based on what contributors and developers were using the most. This is basically a majority decision, thus you may not agree with it. But we would like to encourage you follow those recommendations to keep the code consistent.

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

Instead of order the imports manually, use [`isort`](https://github.com/timothycrosley/isort).

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

### State, argument, and return value validation

Whenever a function is passed potentially invalid arguments, or gets a potentially invalid return value from another function, those arguments or return values should be validated. Likewise, if an object's internal state (i.e. its attributes) could be invalid (for example, an attribute is `None` when it is about to be used) then it should be validated too.

The best way to validate state, arguments, and return values, is to use a conditional (`if`) statement. Depending on whether the invalid value is likely to be expected, and whether it can be handled locally, the conditional could log and then move on, or it could `raise` an exception.

For an error that is not expected or can't be handled in the current function, raise an exception. For example:

```python
def update_device_data(device):
    # Call a function that may not return valid data
    data = fetch_device_data(device)
    # Validate the data before using it
    if not is_valid_data(data):
        raise InvalidDataError(f"Bad data unexpectedly received from {device.name}")
    # Now that the data is known to be valid, it can be used
    # ...
```

For an error that might be expected and can be handled locally, the handling function *may* log it and then return early:

```python
def update_device_data(device):
    online = check_device_online(device)
    if not online:
        if self.available:
            # Log a message if it's going to be useful for debugging later
            _LOGGER.debug("Device %s has gone offline", device.name)
            self.available = False
        return
    data = fetch_device_data(device)
    # data should also be checked here
    # Once validation is complete, proceed to use the data
    # ...
```

Likewise for handling an exception:

```python
def update_device_data(device):
    try:
        data = fetch_device_data(device)
    except DeviceOffline as err:
        if self.available:
            # Log a message if it's going to be useful for debugging later
            _LOGGER.debug("Device %s has gone offline: %r", device.name, err)
            self.available = False
        return
    # data should also be validated
    # Once validation is complete, proceed to use the data
    # ...
```

Also check variable's types when it is important. For example, if using a return value of a function with an `Optional` return type, check for `None`:

```python
# Type signature for called function
def fetch_device_data(device: Device) -> DeviceData | None:

# Calling function
def update_device_data(device):
    data = fetch_device_data(device)
    if not data:
        # No data available, it's not an error but there's nothing else to do in
        # this function
        return
    # process data ...
```

Or when an object may have an optional attribute:

```python
class Foo:
    optional_var: Something | None

    def use_optional_var(self) -> None:
        if not optional_var:
            # Raise or return, depending on whether this is an unexpected state
        # proceed to use optional_var
```

#### Assert

Avoid using the `assert` statement in production code, unless it's required for typing purposes and there aren't better alternatives available.
