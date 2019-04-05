---
title: "Integrations"
sidebar_label: "Introduction"
---

Home Assistant is organized around integrations. An integration consists of a component and optionally, platforms. Each integration is required to have a unique name, to avoid colliding with built-in integrations.

## Basic Directory structure

Each integration is stored inside a directory named after the integration domain. The domain is a short name consisting of characters and underscores, representing the integration inside the Home Assistant codebase.

Integrations are

 - `manifest.json`: The manifest file describes the integration and it's dependencies. [More info](integration_manifest.md)
 - `services.yaml`: Optional file that describes the services offered by an integration.
 - `__init__.py`: The component file. If the integration only offers a platform, you can keep this empty.

Your integration can add support for an entity platform in your integration. Platforms are stored in files in your integration directory named after the integration you are building a platform for. For example, the platform file is named `light.py` when adding a light platform.
