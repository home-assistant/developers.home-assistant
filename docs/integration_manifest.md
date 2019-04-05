---
title: "Integration Manifests"
sidebar_label: "Manifests"
---

Each integration has a manifest file to specify basic information about an integration. This file is stored as `manifest.json` in your integration directory. It is required to add such a file, including for custom components.

```json
{
  "domain": "hue",
  "name": "Philips Hue",
  "documentation": "https://www.home-assistant.io/components/hue",
  "requirements": ["aiohue==1.9.1"],
  "dependencies": ["mqtt"],
  "codeowners": ["@balloob"]
}
```

| Key           | Description                                                                                                                                                                  |
| ------------- | ----------- |
| domain        | The domain of your integration. Should be equal to the current folder name and the `DOMAIN` constant in `__init__.py` |
| name          | The name of your integration. |
| documentation | Website that contains documentation on how to use your integration. |
| requirements  | A list of Python packages that need to be installed to be able to run your integration. Your integration won't load if Home Assistant is unable to install all requirements. |
| dependencies  | A list of Home Assistant integrations that need to be set up to be able to run your integration. Your integration won't load if not all dependencies are able to be set up. |
| codeowners    | GitHub usernames of people that are responsible for this integration. |
