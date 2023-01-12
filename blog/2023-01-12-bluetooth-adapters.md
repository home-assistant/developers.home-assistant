---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Bluetooth updates for 2023.2 and later"
---

Integrations that need to use a Bluetooth adapter should add `bluetooth_adapters` in [`dependencies`](/docs/creating_integration_manifest.md#dependencies) in their [`manifest.json`](/docs/creating_integration_manifest.md). The [`manifest.json`](/docs/creating_integration_manifest.md) entry ensures that all supported remote adapters are connected before the integration tries to use them. This replaces the need to add `bluetooth` in [`dependencies`](/docs/creating_integration_manifest.md#dependencies).

Integrations that provide a Bluetooth adapter should add `bluetooth` in [`dependencies`](/docs/creating_integration_manifest.md#dependencies) in their [`manifest.json`](/docs/creating_integration_manifest.md) and be added as an [`after_dependencies`](/docs/creating_integration_manifest.md#after-dependencies) to the `bluetooth_adapters` integration.
