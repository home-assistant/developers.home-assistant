---
author: John Carr
authorURL: https://github.com/Jc2k
title: "Bluetooth passive sensor API changes for 2022.9"
---

For Home Assistant Core 2022.9 we have changed the `PassiveBluetoothProcessorCoordinator` and `PassiveBluetoothDataProcessor` bluetooth API's to make `PassiveBluetoothProcessorCoordinator` responsible for parsing. The coordinator then pushes parsed data to `PassiveBluetoothDataProcessor` instances.

PassiveBluetoothProcessorCoordinator now takes a mandatory update_method callback that receives bluetooth advertisements (in the form of BluetoothServiceInfoBleak) and returns the data that should be handed off to any subscribed PassiveBluetoothDataProcessor:

```python
def my_parser(service_info: BluetoothServiceInfoBleak) -> MyDataClass:
    ...

    return MyDataClass(
        a=some_parsed_data,
        b=some_other_parsed_data,
    )


coordinator = PassiveBluetoothProcessorCoordinator(
    hass,
    _LOGGER,
    address=address,
    mode=BluetoothScanningMode.PASSIVE,
    update_method=my_parser,
)
```

PassiveBluetoothDataProcessor still takes an update_method, but instead of a BluetoothServiceInfoBleak, it now receives the data returned from PassiveBluetoothProcessorCoordinator's update_method. It should still return a `PassiveBluetoothDataUpdate` as before:

```python
def sensor_update_to_bluetooth_data_update(
    sensor_update: MyDataClass,
) -> PassiveBluetoothDataUpdate:
    """Convert a sensor update to a bluetooth data update."""
    ...
    return PassiveBluetoothDataUpdate( ... )

processor = PassiveBluetoothDataProcessor(sensor_update_to_bluetooth_data_update)
```

All the built-in integrations have already been converted, so take a look at them for more examples.

This change will help integrations that need to start parsing data before loading a platform (for example, the list of platforms to load depend on data from the advertisements) or changes where a single advertisement drives multiple platforms (you won't have to parse the broadcast twice).
