---
title: Device Registry
sidebar_label: Introduction
---

The device registry is a registry where Home Assistant keeps track of devices that exposes entities. Any entity that is added to Home Assistant through a config entry and follows entity registry requirements can be put in the registry.

Assigning an entity to the device registry is done by having a device_info property. For hubs you need to manually create a device entry to the device registry.

Being registered has the advantage that there is a single point of identifying entities belonging to one device.

## Defining a device

Attributes for a device are connections, identifiers, manufacturer, model, name and sw_version. For hubs the config entry is also required.

A device is looked up in the registry based on its' identifiers and connections (sets of tuples with keyword and a unique value). Identifiers needs to be common spanning all related entities.

Good sources for identifiers are

 - Serial number of a device
 - MAC address of a device

Good sources for connections are

- MAC address of a device
