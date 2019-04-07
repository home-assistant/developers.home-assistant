---
title: "Sensors"
---

The `mobile_app` component supports exposing custom sensors that can be managed entirely via your app.

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
    "unit_of_measurement": "%"
  },
  "type": "register_sensor"
}
```

The valid keys are:

| Key                 | Type                          | Required | Description                                                                                                                                                                                                     |
|---------------------|-------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| attributes          | object                        | No       | Attributes to attach to the sensor                                                                                                                                                                              |
| device_class        | string                        | No       | One of the valid device classes. [Binary Sensor Classes](https://www.home-assistant.io/components/binary_sensor/#device-class), [Sensor Classes](https://www.home-assistant.io/components/sensor/#device-class) |
| icon                | Material Design Icon (string) | No       | Must be prefixed `mdi:`. If not provided, default value is `mdi:cellphone`                                                                                                                                      |
| name                | string                        | Yes      | The name of the sensor                                                                                                                                                                                          |
| state               | bool, float, int, string      | Yes      | The state of the sensor                                                                                                                                                                                         |
| type                | string                        | Yes      | The type of the sensor. Must be one of `binary_sensor` or `sensor`                                                                                                                                              |
| unique_id           | string                        | Yes      | A identifier unique to this installation of your app. You'll need this later. Usually best when its a safe version of the sensor name                                                                           |
| unit_of_measurement | string                        | No       | The unit of measurement for the sensor                                                                                                                                                                          |

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
| unique_id           | string                        | Yes      | A identifier unique to this installation of your app. You'll need this later. Usually best when its a safe version of the sensor name |

