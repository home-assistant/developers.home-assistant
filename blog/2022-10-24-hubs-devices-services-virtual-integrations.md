---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Introducing virtual integrations and differentiating hubs, devices, and services, 
---

For the 2022.11 release, we have been adjusting our integration manifests
to  better differentiate between hubs, devices, and services. Additionally,
we are introducing a new type of integration: A virtual integration.

## Differentiating hubs, devices, and services

A confusing aspect: config entries can either integrate a single device (ESPHome),
a whole range of devices via a hub (Hue), or a service (AdGuard).

We want to start to distinguish between those in the UI in the near future,
but are not currently able to do this because integrations don’t expose this
information.

We already have a [`integration_type`](/docs/creating_integration_manifest#integration-type)
manifest property, which we have extended to support these new types:

- `device`: The integration integrates a single device at a time.
- `hub`: The integration integrates multiple devices.
- `service`: The integration integrates a service.

The difference between a `hub` and a `service` or `device` is defined by the
nature of the integration. A `hub` provides a gateway to multiple other 
devices or services. `service` and `device` are integrations that provide
a single device or service per config entry.

:::caution
When the [`integration_type`](/docs/creating_integration_manifest#integration-type)
isn't set, we default it automatically to `hub`. This is a temporary fallback.
We will make setting [`integration_type`](/docs/creating_integration_manifest#integration-type)
explicitly mandatory in the future.

Please update your existing (custom) integrations to set the correct `integration_type`
in the integration manifest.
:::

## Virtual integrations

Some products are supported by integrations that are not named after the product.
For example, Roborock vacuums are integrated via the Xiaomi Miio integration.

There are also cases where a product line only supports a standard IoT standard
like Zigbee or Z-Wave. For example, the U-tec ultraloq works via Z-Wave and
has no specific dedicated integration.

For end-users, it can be confusing to find how to integrate those products
with Home Assistant. To help with these above cases, we introduce:
[Virtual integrations](/docs/creating_integration_manifest#virtual-integration).

Virtual integrations are not real integrations but are used to help users
find the right integration for their device. They only have a single manifest
file without any additional code.

There are two types of virtual integrations: A virtual integration supported
by another integration and one that uses an existing IoT standard.

[Read more about it in our developer documentation.](/docs/creating_integration_manifest#virtual-integration)

## Removing the supported brands feature

Virtual integrations replace the previous "supported brands" feature. This
feature was only used by Home Assistant Core integrations, and all those have
been migrated to use virtual integrations instead.

There is no usage left, therefore, the supported brands feature has been
removed without a deprecation period.
