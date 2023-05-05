---
title: "Sensors"
---

The `mobile_app` integration supports exposing custom sensors that can be managed entirely via your app.

## Registering a sensor

All sensors must be registered before they can get updated. You can only register one sensor at a time, unlike updating sensors.

To register a sensor, make a request to the webhook like this:

```json
{
  "data": {
    "attributes": {
      "foo": "bar"
    },
    "device_class": "battery",
    "icon": "mdi:battery",
    "name": "Battery State",
    "state": "12345",
    "type": "sensor",
    "unique_id": "battery_state",
    "unit_of_measurement": "%",
    "state_class": "measurement",
    "entity_category": "diagnostic",
    "disabled": true
  },
  "type": "register_sensor"
}
```

The valid keys are:

| Key                 | Type                          | Required | Description                                                                                                                                                                                                     |
|---------------------|-------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| attributes          | object                        | No       | Attributes to attach to the sensor                                                                                                                                                                              |
| device_class        | string                        | No       | One of the valid device classes. [Binary Sensor Classes](https://www.home-assistant.io/integrations/binary_sensor/#device-class), [Sensor Classes](https://www.home-assistant.io/integrations/sensor/#device-class) |
| icon                | Material Design Icon (string) | No       | Must be prefixed `mdi:`. If not provided, default value is `mdi:cellphone`                                                                                                                                      |
| name                | string                        | Yes      | The name of the sensor                                                                                                                                                                                          |
| state               | bool, float, int, string      | Yes      | The state of the sensor                                                                                                                                                                                         |
| type                | string                        | Yes      | The type of the sensor. Must be one of `binary_sensor` or `sensor`                                                                                                                                              |
| unique_id           | string                        | Yes      | An identifier unique to this installation of your app. You'll need this later. Usually best when its a safe version of the sensor name                                                                          |
| unit_of_measurement | string                        | No       | The unit of measurement for the sensor                                                                                                                                                                          |
| state_class | string | No | The [state class](../../core/entity/sensor.md#available-state-classes) of the entity (sensors only)
| entity_category | string | No | The entity category of the entity
| disabled | boolean | No | If the entity should be enabled or disabled.

Sensors will appear as soon as they are registered.

## Updating a sensor

Once a sensor has been registered, you need to update it. This is very similar to registering it, but you can update all your sensors at the same time.

For example, to update the sensor we registered above, you would send this:

```json
{
  "data": [
    {
      "attributes": {
        "hello": "world"
      },
      "icon": "mdi:battery",
      "state": 123,
      "type": "sensor",
      "unique_id": "battery_state"
    }
  ],
  "type": "update_sensor_states"
}
```

Only some of the keys are allowed during updates:

| Key                 | Type                          | Required | Description                                                                                                                           |
|---------------------|-------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------|
| attributes          | object                        | No       | Attributes to attach to the sensor                                                                                                    |
| icon                | Material Design Icon (string) | No       | Must be prefixed `mdi:`                                                                                                               |
| state               | bool, float, int, string      | Yes      | The state of the sensor                                                                                                               |
| type                | string                        | Yes      | The type of the sensor. Must be one of `binary_sensor` or `sensor`                                                                    |
| unique_id           | string                        | Yes      | An identifier unique to this installation of your app. You'll need this later. Usually best when its a safe version of the sensor name |

The response to updating a sensor is a dictionary with unique_id => update result.

The key `is_disabled` will be added to successful updates if the entity is disabled inside Home Assistant. This means the app can disable sending updates to the sensor.

If an update was unsuccessful, an error is returned.

```json
{
  "battery_state": {
    "success": true
  },
  "battery_level": {
    "success": true,
    "is_disabled": true
  },
  "battery_charging": {
    "success": false,
    "error": {
      "code": "not_registered",
      "message": "Entity is not registered",
    }
  },
  "battery_charging_state": {
    "success": false,
    "error": {
      "code": "invalid_format",
      "message": "Unexpected value for type",
    }
}
```

## Keeping sensors in sync with Home Assistant

Users can enable and disable entities in Home Assistant. A disabled entity will not be added to Home Assistant, even if offered by the integration. This means that it won't make sense for phones to keep sending data to entities that are not enabled in Home Assistant.

**When a sensor is enabled/disabled in the app**, the app should send a `register_sensor` webhook for this sensor and set `disabled` to `true` or `false`.

**When the mobile app sends an `update_sensor_states` webhook to update the data for an entity that is disabled**, the update result will contain an `is_disabled` key with a value of `true`. This is an indicator that the mobile app needs to synchronize the enabled states from Home Assistant to the mobile app.

```json
{
  "battery_level": {
    "success": true,
  },
  "battery_charging": {
    "success": true,
    "is_disabled": true
  }
}
```

**When the user enables/disables an entity in Home Assistant, it needs to be synchronized to the mobile app.** The `get_config` webhook response contains an `entities` key. This is a dictionary mapping `unique_id` to `{"disabled": boolean}`. The mobile app should adopt these enabled settings.

```json5
{
  // ...
  "entities": {
    "battery_level": {
      "disabled": false
    },
    "battery_charging": {
      "disabled": true
    },
  }
}
```
