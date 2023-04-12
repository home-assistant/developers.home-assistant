---
title: "Development Checklist"
sidebar_label: Introduction
---

Before you commit any changes, check your work against these requirements:

- All communication to external devices or services must be wrapped in an external Python library hosted on [pypi](https://pypi.org/).
  - Issue trackers must be enabled for external Python libraries that has communication with external devices or services.
  - If the library is mainly used for Home Assistant and you are a code owner of the integration it is encouraged to use an issue template picker with links to [Home Assistant Core Issues](https://github.com/home-assistant/core/issues). For example: [zwave-js-server-python - New Issue](https://github.com/home-assistant-libs/zwave-js-server-python/issues/new/choose)
- New dependencies are added to `requirements_all.txt` (if applicable), using `python3 -m script.gen_requirements_all`
- New codeowners are added to `CODEOWNERS` (if applicable), using `python3 -m script.hassfest`
- The `.coveragerc` file is updated to exclude your platform if there are no tests available or your new code uses a third-party library for communication with the device, service, or sensor. `config_flow.py` can't be excluded as it must be fully tested (100% coverage).
- The `.strict-typing` file is updated to include your code if it does provide a fully type hinted source.
- The code is formatted using Black, as per these [guidelines](https://developers.home-assistant.io/blog/2019/07/31/black/). This can be done running the command `black --fast homeassistant tests`.
- Documentation is developed for [home-assistant.io](https://home-assistant.io/)
  - Visit the [website documentation](/documenting.md) for more information about contributing to [home-assistant.io](https://github.com/home-assistant/home-assistant.io).
