---
title: "Development Checklist"
---


Before you commit any changes, check your work against these requirements:

- All communication to external devices or services must be wrapped in an external Python library hosted on [pypi](https://pypi.python.org/pypi).
- New dependencies are added to `requirements_all.txt` (if applicable), using `script/gen_requirements_all.py`
- The `.coveragerc` file is updated to exclude your platform if there are no tests available or your new code uses a third-party library for communication with the device, service, or sensor
- Documentation is developed for [home-assistant.io](https://home-assistant.io/)
   * Visit the [website documentation](https://www.home-assistant.io/developers/documentation/) for more information about contributing to [home-assistant.io](https://github.com/home-assistant/home-assistant.github.io).
- All dependencies are [only imported inside functions](creating_component_deps_and_reqs.md) that use them.
- Add _the manifest file_. What is _the manifest file_? Keep reading to find out!

## _The Manifest File_

As of Home Assistant 0.91, we have begun a migration to a new concept we call _the manifest file_. What is _the manifest file_? _The manifest file_ contains information about a Home Assistant integration. It looks like this:

```json
{
  "domain": "mobile_app",
  "name": "Home Assistant Mobile App Support",
  "documentation": "https://www.home-assistant.io/components/mobile_app",
  "requirements": [
    "PyNaCl==1.3.0"
  ],
  "dependencies": [
    "device_tracker",
    "http",
    "webhook"
  ],
  "codeowners": [
    "@robbiet480"
  ]
}
```

Here are the fields contained in _the manifest file_.

| Key           | Type             | Description                                                                                                                                                                                                               |
|---------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| codeowners    | array of strings | Contains a array of GitHub usernames or team names responsible for the contents of this file that will be notified whenever someone submits a issue or PR relating to it. You, the author, should put your username here. |
| dependencies  | array of strings | Other integrations/components this integration requires to be loaded before it can start.                                                                                                                                 |
| documentation | url              | A URL pointing to documentation for the integration. If this integration is being submitted for inclusion to Home Assistant, it should probably point to documentation under home-assistant.io.                           |
| domain        | string           | The domain of the integration. For example, if your integration is in a folder named `mobile_app`, this should be `mobile_app`                                                                                            |
| name          | string           | The human readable name of your integration                                                                                                                                                                               |
| requirements  | array of strings | Dependencies that should be installed from PyPi.                                                                                                                                                                          |

_The manifest file_ should be stored in the integration folder and be named `manifest.json`.
