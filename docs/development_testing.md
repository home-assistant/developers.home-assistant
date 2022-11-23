---
title: "Testing your code"
---

As it states in the [Style guidelines section](development_guidelines.md) all code is checked to verify the following:

- All the unit tests pass
- All code passes the checks from the linting tools

Local testing is done using [pytest](https://docs.pytest.org/) and using [pre-commit](https://pre-commit.com/) for running out linters, which has been installed as part of running `script/setup` in the [virtual environment](development_environment.mdx).

To run our linters, on the full code base, run the following command:

```shell
pre-commit run --all-files
```

To start the tests, and run the full test suite, activate the virtual environment and run the command:

```shell
pytest tests
```

It might be required that you install additional packages depending on your distribution/operating system:

- Fedora: `sudo dnf -y install systemd-devel gcc-c++`
- Ubuntu: `sudo apt-get install libudev-dev`

:::info Important
Run `pytest` & `pre-commit` before you create your pull request to avoid annoying fixes.
`pre-commit` will will be invoked automatically by git when commiting changes.
:::

:::note
Running the full `ptyest` test suite will take quite some time, so as the minimal requirement for pull requests, run at least the tests that are related to your code changes (see details below on how to). The full test suite will anyway be run by the CI once you created your pull request and before it can be merged.
:::

Running `pytest` will run unit tests against the locally available Python version. We run our tests in our CI against all our supported Python versions.

### Adding new dependencies to test environment

If you are working on tests for an integration and you changed the dependencies, then run the `script/gen_requirements_all.py` script to update all requirement files.
Next you can update all dependencies in your development environment by running:

```shell
pip3 install --use-deprecated=legacy-resolver -r requirements_test_all.txt -c homeassistant/package_constraints.txt
```
### Running a limited test suite

You can pass arguments to `pytest` to be able to run single test suites or test files.
Here are some helpful commands:

```shell
# Stop after the first test fails
$ pytest tests/test_core.py -x

# Run test with specified name
$ pytest tests/test_core.py -k test_split_entity_id

# Fail a test after it runs for 2 seconds
$ pytest tests/test_core.py --timeout 2

# Show the 10 slowest tests
$ pytest tests/test_core.py --duration=10
```

If you want to test just your integration, and include a test coverage report,
the following command is recommended:

```shell
pytest ./tests/components/<your_component>/ --cov=homeassistant.components.<your_component> --cov-report term-missing -vv
```

### Preventing linter errors

Several linters are setup to run automatically when you try to commit as part of running `script/setup` in the [virtual environment](development_environment.mdx).

You can also run these linters manually :

```shell
pre-commit run --show-diff-on-failure
```

The linters are also available directly, you can run tests on individual files:

```shell
flake8 homeassistant/core.py
pylint homeassistant/core.py
black homeassistant/core.py
isort homeassistant/core.py
```

### Notes on PyLint and PEP8 validation

If you can't avoid a PyLint warning, add a comment to disable the PyLint check for that line with `# pylint: disable=YOUR-ERROR-NAME`. Example of an unavoidable one is if PyLint incorrectly reports that a certain object doesn't have a certain member.

### Writing tests for integrations

- Make sure to not interact with any integration details in tests of integrations. Following this pattern will make the tests more robust for changes in the integration.
  - Set up the integration with the core interface either [`async_setup_component`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/setup.py#L44-L46) or [`hass.config_entries.async_setup`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/config_entries.py#L693) if the integration supports config entries.
  - Assert the entity state via the core state machine [`hass.states`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/core.py#L887).
  - Call services via the core service registry [`hass.services`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/core.py#L1133).
  - Assert `DeviceEntry` state via the [device registry](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/helpers/device_registry.py#L101).
  - Assert entity registry `RegistryEntry` state via the [entity registry](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/helpers/entity_registry.py#L120).
  - Modify a `ConfigEntry` via the config entries interface [`hass.config_entries`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/config_entries.py#L570).
  - Assert the state of a config entry via the [`ConfigEntry.state`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/config_entries.py#L169) attribute.
  - Mock a config entry via the `MockConfigEntry` class in [`tests/common.py`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/tests/common.py#L658)
