---
title: "Testing your code"
---

As it states in the [Style guidelines section](development_guidelines.md) all code is checked to verify the following:

- All the unit tests pass
- All code passes the checks from the linting tools

Local testing is done using [Tox](https://tox.readthedocs.io), which has been installed as part of running `script/setup` in the [virtual environment](development_environment.mdx). To start the tests, activate the virtual environment and simply run the command:

```shell
tox
```

It might be required that you install additional packages depending on your distribution/operating system:

- Fedora: `sudo dnf -y install systemd-devel gcc-c++`
- Ubuntu: `sudo apt-get install libudev-dev`

:::info Important
Run `tox` before you create your pull request to avoid annoying fixes.
:::

:::note
Running the full `tox` test suite will take quite some time, so as the minimal requirement for pull requests, run at least the tests that are related to your code changes (see details below on how to). The full test suite will anyway be run by the CI once you created your pull request and before it can be merged.
:::

Running `tox` will run unit tests against the locally available Python releases, as well as validate the code and document style using `pycodestyle`, `pydocstyle` and `pylint`. You can run tests on only one `tox` target -- just use `-e` to select an environment. For example, `tox -e lint` runs the linters only, and `tox -e py39` runs unit tests only on Python 3.9.

`tox` uses virtual environments under the hood to create isolated testing environments. The `tox` virtual environments will get out-of-date when requirements change, causing test errors. Run `tox -r` to tell `tox` to recreate the virtual environments.

macOS users may see an `Error creating virtualenv` when running `tox`. If this occurs, install the [tox-venv](https://pypi.org/project/tox-venv/) package using the command `pip install tox-venv` and try again.

### Adding new dependencies to test environment

If you are working on tests for an integration and you need the dependencies available inside the `tox` environment, update the list inside `script/gen_requirements_all.py`. Then run the script and then run `tox -r` to recreate the virtual environments.

### Running single tests using `tox`

You can pass arguments via `tox` to `pytest` to be able to run single test suites or test files. Replace `py39` with the Python version that you use.

```shell
# Stop after the first test fails
$ tox -e py39 -- tests/test_core.py -x
# Run test with specified name
$ tox -e py39 -- tests/test_core.py -k test_split_entity_id
# Fail a test after it runs for 2 seconds
$ tox -e py39 -- tests/test_core.py --timeout 2
# Show the 10 slowest tests
$ tox -e py39 -- tests/test_core.py --duration=10
```

### Testing outside of Tox

Running `tox` will invoke the full test suite. Even if you specify which tox target to run, you still run all tests inside that target. That's not very convenient to quickly iterate on your code! To be able to run the specific test suites without `tox`, you'll need to install the test dependencies into your Python environment:

```shell
pip3 install --use-deprecated=legacy-resolver -r requirements_test_all.txt -c homeassistant/package_constraints.txt
```

Now that you have all test dependencies installed, you can run tests on individual files:

```shell
flake8 homeassistant/core.py
pylint homeassistant/core.py
pydocstyle homeassistant/core.py
pytest tests/test_core.py
```

You can also run linting tests against all changed files, as reported by `git diff upstream/dev... --diff-filter=d --name-only`, using the `lint` script:

```shell
script/lint
```

In case you want to check the code coverage for your new component, run the following from the root of the repository:

```shell
pytest ./tests/components/<your_component>/ --cov=homeassistant.components.<your_component> --cov-report term-missing -vv
```

### Preventing linter errors

Several linters are setup to run automatically when you try to commit as part of running `script/setup` in the [virtual environment](development_environment.mdx).

You can also run these linters manually:

```shell
pre-commit run --show-diff-on-failure
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
