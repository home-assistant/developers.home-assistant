---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
title: "Modernizing Modbus in Home Assistant"
---

Modbus is everywhere in the modern home: solar inverters, energy meters, heat pumps, and all kinds of industrial equipment that has found its way indoors. Home Assistant has long supported these devices through the YAML-based `modbus` integration, where users hand-write register maps in their configuration. That integration is not going anywhere, and existing setups keep working. But hand-writing register maps puts the burden of understanding a device's protocol on every user, and it does not fit the config-flow, UI-first direction the rest of Home Assistant has taken.

So we are adding a new way to use Modbus: an integration-based approach, where a device integration owns the device-specific knowledge and the user simply picks their device in the UI, the same as any other integration.

## Sharing a connection

A Modbus connection is a single, exclusive resource: only one party can talk on the bus at a time. A serial (RS-485) bus, or a TCP-to-serial gateway, can carry many devices at once, sometimes from different manufacturers. If two integrations each open their own connection to the same bus, they fight over it, and historically Home Assistant did not support sharing a bus between integrations at all.

The new [`modbus_connection`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/modbus_connection) integration solves this by making a connection something device integrations route through rather than own. The user sets up a connection once in the UI, and `modbus_connection` keeps it open and manages its lifecycle, including reconnecting after a drop. Device integrations then borrow what they need from that shared connection instead of managing their own. We have revamped the [Modbus developer documentation](/docs/modbus/introduction) to cover how that works, with example code.

## A standalone library

The connection abstraction underneath `modbus_connection` lives in [`modbus-connection`](https://github.com/home-assistant-libs/modbus-connection), a new library we designed for this purpose and published on PyPI. It is not bound to Home Assistant and can be used standalone in any Python project. It presents a common, backend-neutral interface, so device library authors write against one API regardless of the underlying Modbus implementation, and it ships a device-modelling framework and a `pytest` plugin to make building and testing a device library straightforward.

This keeps concerns where they belong. A device library is a normal PyPI package that knows how to talk to a specific device, and a consuming integration in Home Assistant wires that library up to a shared connection and exposes entities. Both can be developed and tested independently.

For more background, see our [research](https://gist.github.com/balloob/b9fa91ba1a0914a9787f8f6ceb637b83).

## Let's get building

With these new building blocks in place, it is now possible to turn a collection of YAML configuration for Modbus into manufacturer-specific integrations that people can set up via the UI. If you're (interested in) working on this, stop by the [#modbus channel on the Home Assistant Discord](https://discord.com/channels/330944238910963714/1347329854495916044) and we'll be happy to help.

If you're using an AI agent, you can give it the following prompt:

> I want to create a new integration for Home Assistant using the new Modbus Connection integration as documented here: https://developers.home-assistant.io/docs/modbus/introduction
> 
> The YAML we want to turn into a device library can be found here: *TODO INSERT LOCATION OF MODBUS YAML!*
>
> The deliverables of this task are going to be 3 folders:
> 
> - Start by creating a device library based on the YAML. Follow https://github.com/Tom-Bom-badil/trovis-modbus/ as an exact example, including how to use component models, all GitHub Actions, helper scripts and README. This library is meant as a standalone device library and should not mention Home Assistant. Look at the source of modbus_connection to figure out all supported fields.
> 
> - Create an integration that can be contributed to Home Assistant core that follows this example: https://github.com/home-assistant/core/tree/trovis557x-integration/homeassistant/components/trovis557x
> 
> - Create a custom integration version where the device library is vendorized so it is ready to be tested by the community via HACS. Follow this template https://github.com/ludeeus/integration_blueprint
