---
author: John Carr
authorURL: https://github.com/Jc2k
title: "Bluetooth passive sensor API changes for 2022.9"
---

For Home Assistant Core 2022.9 we have changesd the `PassiveBluetoothProcessorCoordinator` and `PassiveBluetoothDataProcessor` bluetooth API's to make `PassiveBluetoothProcessorCoordinator` responsible for parsing. The coordinator then pushes parsed data to `PassiveBluetoothDataProcessor` instances.

PassiveBluetoothProcessorCoordinator now takes a mandatory update_method callback that receives bluetooth advertisements (in the form of BluetoothServiceInfoBleak) and returns the data that should be handed off to any subscribed PassiveBluetoothDataProcessor:

```diff
diff --git a/homeassistant/components/sensorpush/__init__.py b/homeassistant/components/sensorpush/__init__.py
index 936141a8fb..7828a581d0 100644
--- a/homeassistant/components/sensorpush/__init__.py
+++ b/homeassistant/components/sensorpush/__init__.py
@@ -3,10 +3,9 @@ from __future__ import annotations
 
 import logging
 
-from homeassistant.components.bluetooth import (
-    BluetoothScanningMode,
-    BluetoothServiceInfoBleak,
-)
+from sensorpush_ble import SensorPushBluetoothDeviceData
+
+from homeassistant.components.bluetooth import BluetoothScanningMode
 from homeassistant.components.bluetooth.passive_update_processor import (
     PassiveBluetoothProcessorCoordinator,
 )
@@ -25,10 +24,15 @@ async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
     """Set up SensorPush BLE device from a config entry."""
     address = entry.unique_id
     assert address is not None
+    data = SensorPushBluetoothDeviceData()
     coordinator = hass.data.setdefault(DOMAIN, {})[
         entry.entry_id
-    ] = PassiveBluetoothProcessorCoordinator[BluetoothServiceInfoBleak](
-        hass, _LOGGER, address=address, mode=BluetoothScanningMode.PASSIVE
+    ] = PassiveBluetoothProcessorCoordinator(
+        hass,
+        _LOGGER,
+        address=address,
+        mode=BluetoothScanningMode.PASSIVE,
+        update_method=data.update,
     )
     await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
     entry.async_on_unload(
```

PassiveBluetoothDataProcessor still takes an update_method, but instead of a BluetoothServiceInfoBleak, it now takes receives the data from PassiveBluetoothProcessorCoordinator's update_method:

```diff
diff --git a/homeassistant/components/sensorpush/sensor.py b/homeassistant/components/sensorpush/sensor.py
index 9bfa59e387..8a4db7aff1 100644
--- a/homeassistant/components/sensorpush/sensor.py
+++ b/homeassistant/components/sensorpush/sensor.py
@@ -3,14 +3,7 @@ from __future__ import annotations
 
 from typing import Optional, Union
 
-from sensorpush_ble import (
-    DeviceClass,
-    DeviceKey,
-    SensorDeviceInfo,
-    SensorPushBluetoothDeviceData,
-    SensorUpdate,
-    Units,
-)
+from sensorpush_ble import DeviceClass, DeviceKey, SensorDeviceInfo, SensorUpdate, Units
 
 from homeassistant import config_entries
 from homeassistant.components.bluetooth.passive_update_processor import (
@@ -130,12 +123,7 @@ async def async_setup_entry(
     coordinator: PassiveBluetoothProcessorCoordinator = hass.data[DOMAIN][
         entry.entry_id
     ]
-    data = SensorPushBluetoothDeviceData()
-    processor = PassiveBluetoothDataProcessor(
-        lambda service_info: sensor_update_to_bluetooth_data_update(
-            data.update(service_info)
-        )
-    )
+    processor = PassiveBluetoothDataProcessor(sensor_update_to_bluetooth_data_update)
     entry.async_on_unload(
         processor.async_add_entities_listener(
             SensorPushBluetoothSensorEntity, async_add_entities
```

This change will help integrations that need to start parsing data before loading a platform (for example, the list of platforms to load depend on data from the advertisements) or changes where a single advertisement drives multiple platforms (you won't have to parse the broadcast twice).
