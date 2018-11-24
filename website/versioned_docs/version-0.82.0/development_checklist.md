---
title: Development Checklist
id: version-0.82.0-development_checklist
original_id: development_checklist
---


Before you commit any changes, check your work against these requirements:

- All communication to external devices or services must be wrapped in an external Python library hosted on [pypi](https://pypi.python.org/pypi).
- All dependencies from [pypi](https://pypi.python.org/pypi) are included via the `REQUIREMENTS` variable in your platform or component and only imported inside functions that use them
- New dependencies are added to `requirements_all.txt` (if applicable), using `script/gen_requirements_all.py`
- The `.coveragerc` file is updated to exclude your platform if there are no tests available or your new code uses a third-party library for communication with the device, service, or sensor
- Documentation is developed for [home-assistant.io](/)
   * It's OK to start with adding a docstring with configuration details (for example, sample entry for `configuration.yaml` file) to the file header. Visit the [website documentation](https://www.home-assistant.io/developers/documentation/) for more information about contributing to [home-assistant.io](https://github.com/home-assistant/home-assistant.github.io).
