---
title: Testing your code
id: version-0.95.0-development_testing
original_id: development_testing
---

As it states in the [Style guidelines section](development_guidelines.md) all code is checked to verify the following:

- All the unit tests pass
- All code passes the checks from the linting tools

Local testing is done using Tox, which has been installed as part of running `script/setup` in the [virtual environment](development_environment.md). To start the tests, activate the virtual environment and simply run the command:

```bash
$ tox
```
**Important:** Run `tox` before you create your pull request to avoid annoying fixes.

Running Tox will run unit tests against the locally available Pythons, as well as validate the code and document style using `pycodestyle`, `pydocstyle` and  `pylint`. You can run tests on only one tox target -- just use `-e` to select an environment. For example, `tox -e lint` runs the linters only, and `tox -e py36` runs unit tests only on Python 3.6.

Tox uses virtual environments under the hood to create isolated testing environments. The tox virtual environments will get out-of-date when requirements change, causing test errors. Run `tox -r` to tell Tox to recreate the virtual environments.

macOS users may see an `Error creating virtualenv` when runnng `tox`. If this occurs, install the [tox-venv](https://pypi.org/project/tox-venv/) package using the command `pip install tox-venv` and try again.

### Adding new dependencies to test environment

If you are working on tests for a component or platform and you need the dependencies available inside the Tox environment, update the list inside `script/gen_requirements_all.py`. Then run the script and then run `tox -r` to recreate the virtual environments.

### Running single tests using Tox

You can pass arguments via Tox to py.test to be able to run single test suites or test files. Replace `py36` with the Python version that you use.

```bash
# Stop after the first test fails
$ tox -e py36 -- tests/test_core.py -x
# Run test with specified name
$ tox -e py36 -- tests/test_core.py -k test_split_entity_id
# Fail a test after it runs for 2 seconds
$ tox -e py36 -- tests/test_core.py --timeout 2
# Show the 10 slowest tests
$ tox -e py36 -- tests/test_core.py --duration=10
```

### Testing outside of Tox

Running tox will invoke the full test suite. Even if you specify which tox target to run, you still run all tests inside that target. That's not very convenient to quickly iterate on your code! To be able to run the specific test suites without Tox, you'll need to install the test dependencies into your Python environment:

```bash
$ pip3 install -r requirements_test_all.txt -c homeassistant/package_constraints.txt
```

Now that you have all test dependencies installed, you can run tests on individual files:

```bash
$ flake8 homeassistant/core.py
$ pylint homeassistant/core.py
$ pydocstyle homeassistant/core.py
$ py.test tests/test_core.py
```

You can also run linting tests against all changed files, as reported by `git diff upstream/dev... --diff-filter=d --name-only`, using the `lint` script:

```bash
$ script/lint
```

### Preventing Linter Errors

Save yourself the hassle of extra commits just to fix style errors by enabling the Flake8 git commit hook. Flake8 will check your code when you try to commit to the repository and block the commit if there are any style errors, which gives you a chance to fix them!

```bash
$ pip3 install flake8 flake8-docstrings
$ flake8 --install-hook=git
```

The `flake8-docstrings` extension will check docstrings according to [PEP257](https://www.python.org/dev/peps/pep-0257/) when running Flake8.

### Notes on PyLint and PEP8 validation

If you can't avoid a PyLint warning, add a comment to disable the PyLint check for that line with `# pylint: disable=YOUR-ERROR-NAME`. Example of an unavoidable one is if PyLint incorrectly reports that a certain object doesn't have a certain member.
