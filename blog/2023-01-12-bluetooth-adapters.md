---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Bluetooth updates for 2023.2 and later"
---

Integrations that need to use a Bluetooth adapter should add `bluetooth_adapters` in [`dependencies`](/docs/creating_integration_manifest#dependencies) in their [`manifest.json`](/docs/creating_integration_manifest). The [`manifest.json`](/docs/creating_integration_manifest) entry ensures that all supported remote adapters are connected before the integration tries to use them. This replaces the need to add `bluetooth` in [`dependencies`](/docs/creating_integration_manifest#dependencies).

Integrations that provide a Bluetooth adapter should add `bluetooth` in [`dependencies`](/docs/creating_integration_manifest#dependencies) in their [`manifest.json`](/docs/creating_integration_manifest) and be added to [`after_dependencies`](/docs/creating_integration_manifest#after-dependencies) to the `bluetooth_adapters` integration.

Be sure to check out [Best practices for integration authors](/docs/bluetooth/#best-practices-for-integration-authors) when building new Bluetooth integrations.
