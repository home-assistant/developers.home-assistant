---
title: Infrared entity
sidebar_label: Infrared
---

An infrared entity provides an abstraction layer between IR emitter hardware (like ESPHome, Broadlink, or ZHA devices) and device-specific integrations that need to send IR commands (like LG or Samsung TV controls). It acts as a virtual IR transmitter that can be used by other integrations to control IR devices.

An infrared entity is derived from the [`homeassistant.components.infrared.InfraredEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/infrared/__init__.py).

## Architecture overview

The infrared entity integration creates a separation between:

1. **Emitter integrations** (like ESPHome, Broadlink): These implement the `InfraredEntity` to provide the hardware-specific IR transmission capability.
2. **Consumer integrations** (like LG, Samsung): These use the infrared helper functions to send device-specific IR commands through available emitters.

```text
┌──────────────────────────────────────────────────────────────┐
│                   Consumer Integrations                      │
│           (Device-specific IR codes and entity types)        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │     LG      │  │  Samsung    │  │  Daikin     │   ...     │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
└───────────────────────┬──────────────────────────────────────┘
                        │ Use helper functions
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                     infrared domain                          │
│                                                              │
│  • InfraredEntity base class                                 │
│  • Helper functions (async_get_emitters, async_send_command) │
└───────────────────────┬──────────────────────────────────────┘
                        │ Implemented by
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                  Emitter Integrations                        │
│            (Hardware-specific implementations)               │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   ESPHome   │  │  Broadlink  │  │    ZHA      │   ...     │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
└──────────────────────────────────────────────────────────────┘
```

## InfraredEntity class

### State

The infrared entity state represents the timestamp of when the last IR command was sent. This is implemented in the base InfraredEntity class and should not be changed by integrations.

### Send command method

The `async_send_command` method must be implemented by emitter integrations to handle the actual IR transmission.

```python
class MyInfraredEntity(InfraredEntity):
    """My infrared entity."""

    async def async_send_command(self, command: infrared_protocols.Command) -> None:
        """Send an IR command.

        Args:
            command: The IR command to send.

        Raises:
            HomeAssistantError: If transmission fails.
        """
```

:::important
Consumer integrations should not call `async_send_command` directly. Use the [`infrared.async_send_command`](#send-command) helper function instead, which handles state updates and context management automatically.
:::

## Helper functions

The infrared domain provides helper functions for consumer integrations to discover emitters and send IR commands.

### Get emitters

Returns a list of all available infrared emitter entities.

```python
from homeassistant.components import infrared

emitters = infrared.async_get_emitters(hass)
```

### Send command

Sends an IR command to a specific infrared entity.

```python
from infrared_protocols import NECCommand
from homeassistant.components import infrared

command = NECCommand(
    address=0x04,
    command=0x08,
    modulation=38000,  # 38 kHz carrier frequency
)

await infrared.async_send_command(
    hass,
    ir_entity_id,
    command,
    context=context,  # Optional context for logbook tracking
)
```

## IR commands

The [infrared-protocols library](https://github.com/home-assistant-libs/infrared-protocols) provides base classes for IR commands that convert protocol-specific data to raw timings.

All IR commands must inherit from `infrared_protocols.Command` and implement the `get_raw_timings()` method.
