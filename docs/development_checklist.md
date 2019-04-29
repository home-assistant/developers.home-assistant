---
title: "Development Checklist"
sidebar_label: Introduction
---


Before you commit any changes, check your work against these requirements:

- All communication to external devices or services must be wrapped in an external Python library hosted on [pypi](https://pypi.python.org/pypi).
- New dependencies are added to `requirements_all.txt` (if applicable), using `python3 -m script.gen_requirements_all`
- New codeowners are added to `CODEOWNERS` (if applicable), using `python3 -m script.hassfest`
- The `.coveragerc` file is updated to exclude your platform if there are no tests available or your new code uses a third-party library for communication with the device, service, or sensor
- Documentation is developed for [home-assistant.io](https://home-assistant.io/)
   * Visit the [website documentation](https://www.home-assistant.io/developers/documentation/) for more information about contributing to [home-assistant.io](https://github.com/home-assistant/home-assistant.github.io).
