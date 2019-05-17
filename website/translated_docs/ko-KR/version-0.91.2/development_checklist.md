---
title: Development Checklist
sidebar_label: 대하여
id: version-0.91.2-development_checklist
original_id: development_checklist
---


Before you commit any changes, check your work against these requirements:

- All communication to external devices or services must be wrapped in an external Python library hosted on [pypi](https://pypi.python.org/pypi).
- New dependencies are added to `requirements_all.txt` (if applicable), using `script/gen_requirements_all.py`
- New codeowners are added to `CODEOWNERS` (if applicable), using `script/manifest/codeowners.py`
- The `.coveragerc` file is updated to exclude your platform if there are no tests available or your new code uses a third-party library for communication with the device, service, or sensor
- Documentation is developed for [home-assistant.io](https://home-assistant.io/) 
   - Visit the [website documentation](https://www.home-assistant.io/developers/documentation/) for more information about contributing to [home-assistant.io](https://github.com/home-assistant/home-assistant.github.io).
- All dependencies are only imported inside functions that use them.