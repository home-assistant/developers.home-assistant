---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: New device and state class selectors
---
New [selectors](https://www.home-assistant.io/docs/blueprint/selectors/) are available to choose a device class or sensor state class.

These selectors can be used in config flows and blueprints when requesting a device or state class from the user.

## Device class selector

The new `DeviceClassSelector` is available for selecting device classes in config flows and blueprints. It supports device classes for the following platforms:

```python
Platform.BINARY_SENSOR: BinarySensorDeviceClass
Platform.BUTTON: ButtonDeviceClass
Platform.COVER: CoverDeviceClass
Platform.EVENT: EventDeviceClass
Platform.HUMIDIFIER: HumidifierDeviceClass
Platform.INFRARED: InfraredDeviceClass
Platform.MEDIA_PLAYER: MediaPlayerDeviceClass
Platform.NUMBER: NumberDeviceClass
Platform.SENSOR: SensorDeviceClass
Platform.SWITCH: SwitchDeviceClass
Platform.UPDATE: UpdateDeviceClass
Platform.VALVE: ValveDeviceClass
```

### Device class selector examples

Example of a device class selector that returns a single device class:

```python
vol.Schema(
    {
        vol.Optional(CONF_DEVICE_CLASS): DeviceClassSelector(
            DeviceClassSelectorConfig(domain=Platform.SENSOR)
        ),
    }
)
```

Example of a device class selector that returns multiple device classes as a list:

```python
vol.Schema(
    {
        vol.Optional(CONF_DEVICE_CLASS): DeviceClassSelector(
            DeviceClassSelectorConfig(
                domain=Platform.BINARY_SENSOR,
                multiple=True,
            )
        ),
    }
)
```

## Sensor state class selector

The new `StateClassSelector` is available for selecting sensor state classes in config flows and blueprints.

### Sensor state class selector examples

Example of a sensor state class selector that returns a single state class:

```python
vol.Schema(
    {
        vol.Optional(CONF_STATE_CLASS): StateClassSelector(),
    }
)
```

Example of a sensor state class selector that returns a single state class with only a filtered subset of available state classes:

```python
vol.Schema(
    {
        vol.Optional(CONF_STATE_CLASS): StateClassSelector(
            StateClassSelectorConfig(
                state_classes=[
                    SensorStateClass.MEASUREMENT,
                    SensorStateClass.TOTAL_INCREASING,
                ],
            )
        ),
    }
)
```

Example of a state class selector that returns multiple state classes as a list:

```python
vol.Schema(
    {
        vol.Optional(CONF_STATE_CLASS): StateClassSelector(
            StateClassSelectorConfig(multiple=True),
        ),
    }
)
```

## Migrating existing device and state class selectors

Unlike using a generic `SelectSelector`, the `DeviceClassSelector` allows the frontend to automatically translate device classes into user-friendly names.

Existing implementations that select a device or state class using `SelectSelector` should be migrated to use `DeviceClassSelector` or `StateClassSelector`. After migration, any stale translations related to the old selector values should be removed.

The [Selectors](https://www.home-assistant.io/docs/blueprint/selectors/) documentation has been updated to include the new selectors.
