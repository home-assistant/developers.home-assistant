---
author: Abílio Costa
authorURL: https://github.com/abmantis
authorImageURL: https://avatars.githubusercontent.com/u/974569?v=4
title: "New infrared entity platform for IR device integrations"
---

Home Assistant now has an `infrared` entity platform that decouples IR emitter hardware from the devices they control. Instead of each device integration talking directly to specific IR hardware, emitter integrations (like `esphome`) expose `InfraredEntity` instances, and device integrations (like `lg_infrared`) send commands through them via helper functions.

See the [architecture discussion](https://github.com/home-assistant/architecture/discussions/1316) for the full background.

<!--truncate-->

## Architecture

The infrared domain sits between two types of integrations:

- **Emitter integrations** (ESPHome, Broadlink, …) implement the `InfraredEntity` base class to provide hardware-specific IR transmission.
- **Consumer integrations** (LG, Samsung, Daikin, …) use helper functions to send device-specific IR commands through available emitters.

Users select which emitter to use during the consumer integration's config flow.

## Implementing an emitter integration

Emitter integrations provide the `infrared` platform by subclassing `InfraredEntity` and implementing `async_send_command`. The command's `get_raw_timings()` method returns protocol-agnostic timing data that the hardware can transmit:

```python
from homeassistant.components.infrared import InfraredCommand, InfraredEntity

class MyInfraredEntity(InfraredEntity):
    """My IR transmitter."""

    async def async_send_command(self, command: InfraredCommand) -> None:
        """Send an IR command."""
        timings = [
            interval
            for timing in command.get_raw_timings()
            for interval in (timing.high_us, -timing.low_us)
        ]
        await self._device.transmit(
            carrier_frequency=command.modulation,
            timings=timings,
        )
```

The raw protocol-agnostic timings should be converted to the specific format required by the hardware.

## Building a consumer integration

Consumer integrations control IR devices by sending commands through an emitter entity. They don't interact with IR hardware directly.

**1. Declare the dependency** in `manifest.json`:

```json
{
  "dependencies": ["infrared"]
}
```

**2. Let the user pick an emitter** in the config flow:

```python
from homeassistant.components import infrared

emitters = infrared.async_get_emitters(hass)
if not emitters:
    return self.async_abort(reason="no_emitters")
```

**3. Send IR commands** using the helper function and the [`infrared-protocols`](https://github.com/home-assistant-libs/infrared-protocols) library:

```python
from infrared_protocols.codes.lg.tv import LGTVCode, make_lg_tv_command
from homeassistant.components import infrared

await infrared.async_send_command(
    hass,
    self._infrared_entity_id,
    make_lg_tv_command(LGTVCode.VOLUME_UP),
    context=self._context,
)
```

## IR protocols and codes

IR protocol encoders and device code sets live outside Home Assistant in the [`infrared-protocols`](https://github.com/home-assistant-libs/infrared-protocols) library. Common protocols (NEC, Samsung, etc.) and well-known device codes should be contributed there. For niche or proprietary protocols, a separate third-party library can also be used.

For full details, see the [infrared entity documentation](/docs/core/entity/infrared).
