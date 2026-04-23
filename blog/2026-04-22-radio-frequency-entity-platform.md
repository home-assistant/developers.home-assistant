---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
authorImageURL: https://avatars.githubusercontent.com/u/1444314?v=4
title: "New radio frequency entity platform for RF device integrations"
---

Home Assistant now has a `radio_frequency` entity platform that decouples RF transceiver hardware from the devices it controls. Instead of each device integration talking directly to specific RF hardware, transmitter integrations (like `esphome`) expose `RadioFrequencyTransmitterEntity` instances, and device integrations send commands through them via helper functions.

This mirrors the [`infrared` entity platform](/blog/2026/03/30/infrared-entity-platform) and was approved in [architecture discussion #1365](https://github.com/home-assistant/architecture/discussions/1365).

<!--truncate-->

## Architecture

The `radio_frequency` domain sits between two types of integrations:

- **Transmitter integrations** (ESPHome, Broadlink, …) implement the `RadioFrequencyTransmitterEntity` base class to provide hardware-specific RF transmission.
- **Consumer integrations** (garage door openers, RF remotes, wireless switches, …) use helper functions to send device-specific RF commands through available transmitters.

Users select which transmitter to use during the consumer integration's config flow, filtered by the frequency the device operates on.

## Implementing a transmitter integration

Transmitter integrations provide the `radio_frequency` platform by subclassing `RadioFrequencyTransmitterEntity`, declaring their `supported_frequency_ranges`, and implementing `async_send_command`:

```python
from rf_protocols import RadioFrequencyCommand
from homeassistant.components.radio_frequency import RadioFrequencyTransmitterEntity

class MyRadioFrequencyTransmitterEntity(RadioFrequencyTransmitterEntity):
    """My RF transmitter."""

    @property
    def supported_frequency_ranges(self) -> list[tuple[int, int]]:
        """Return the list of (min_hz, max_hz) ranges this hardware can transmit on."""
        return [(300_000_000, 348_000_000), (433_050_000, 434_790_000)]

    async def async_send_command(self, command: RadioFrequencyCommand) -> None:
        """Send an RF command."""
        await self._device.transmit(
            frequency=command.frequency,
            modulation=command.modulation,
            timings=command.get_raw_timings(),
        )
```

The base class tracks the timestamp of the last sent command as the entity state, so transmitter integrations only need to handle the actual transmission.

## Building a consumer integration

Consumer integrations control RF devices by sending commands through a transmitter entity. They don't interact with RF hardware directly.

**1. Declare the dependency** in `manifest.json`:

```json
{
  "dependencies": ["radio_frequency"]
}
```

**2. Let the user pick a transmitter** in the config flow, filtered by the frequency the device uses:

```python
from rf_protocols import ModulationType
from homeassistant.components import radio_frequency

transmitters = radio_frequency.async_get_transmitters(
    hass,
    frequency=433_920_000,
    modulation=ModulationType.OOK,
)
if not transmitters:
    return self.async_abort(reason="no_transmitters")
```

Only `ModulationType.OOK` (on-off keying) is supported right now; other modulation types may be added later.

**3. Send RF commands** using the helper function and the [`rf-protocols`](https://github.com/home-assistant-libs/rf-protocols) library:

```python
from rf_protocols.codes.garage import make_garage_command
from homeassistant.components import radio_frequency

await radio_frequency.async_send_command(
    hass,
    self._rf_entity_id,
    make_garage_command(...),
    context=self._context,
)
```

## RF protocols and codes

RF protocol encoders and device code sets live outside Home Assistant in the [`rf-protocols`](https://github.com/home-assistant-libs/rf-protocols) library. Common protocols and well-known device codes should be contributed there. For niche or proprietary protocols, a separate third-party library can also be used.

For full details, see the [radio frequency entity documentation](/docs/core/entity/radio-frequency).
