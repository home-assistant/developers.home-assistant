---
title: Frontend data
sidebar_label: Data
id: version-0.77.0-frontend_data
original_id: frontend_data
---

The frontend passes a single `hass` object around. This object contains the latest state and allows you to send commands back to the server.

Whenever a state changes, a new version of the objects that changed are created. So you can easily see if something has changed by doing a strict equality check:

```js
const changed = newVal !== oldVal;
```

## Data

### `hass.states`

An object containing the states of all entities in Home Assistant. The key is the entity_id, the value is the state object.

```json
{
  "sun.sun": {
    "entity_id": "sun.sun",
    "state": "above_horizon",
    "attributes": {
      "next_dawn": "2018-08-18T05:39:19+00:00",
      "next_dusk": "2018-08-17T18:28:52+00:00",
      "next_midnight": "2018-08-18T00:03:51+00:00",
      "next_noon": "2018-08-18T12:03:58+00:00",
      "next_rising": "2018-08-18T06:00:33+00:00",
      "next_setting": "2018-08-17T18:07:37+00:00",
      "elevation": 60.74,
      "azimuth": 297.69,
      "friendly_name": "Sun"
    },
    "last_changed": "2018-08-17T13:46:59.083836+00:00",
    "last_updated": "2018-08-17T13:49:30.378101+00:00",
    "context": {
      "id": "74c2b3b429c844f18e59669e4b41ec6f",
      "user_id": null
    },
  },
  "light.ceiling_lights": {
    "entity_id": "light.ceiling_lights",
    "state": "on",
    "attributes": {
      "min_mireds": 153,
      "max_mireds": 500,
      "brightness": 180,
      "color_temp": 380,
      "hs_color": [
        56,
        86
      ],
      "rgb_color": [
        255,
        240,
        35
      ],
      "xy_color": [
        0.459,
        0.496
      ],
      "white_value": 200,
      "friendly_name": "Ceiling Lights",
      "supported_features": 151
    },
    "last_changed": "2018-08-17T13:46:59.129248+00:00",
    "last_updated": "2018-08-17T13:46:59.129248+00:00",
    "context": {
      "id": "2c6bbbbb66a84a9dae097b6ed6c93383",
      "user_id": null
    },
  }
}
```

### `hass.user`

The logged in user.

```json
{
  "id": "758186e6a1854ee2896efbd593cb542c",
  "name": "Paulus",
  "is_owner": true,
  "credentials": [
    {
      "auth_provider_type": "homeassistant",
      "auth_provider_id": null
    }
  ]
}
```

## Methods

All methods starting with `call` are async methods. This means that they will return a `Promise` that will resolve with the result of the call.

### `hass.callService(domain, service, data)`

Call a service on the backend.

```js
hass.callService('light', 'turn_on', {
  entity_id: 'light.kitchen'
});
```

### `hass.callWS(message)`

Call a WebSocket command on the backend.

```js
this.hass.callWS({
  type: 'config/auth/create',
  name: 'Paulus',
}).then(userResponse =>
  console.log("Created user", userResponse.user.id));
```

### `hass.callApi(method, path, data)`

Call an API on the Home Assistant server. For example, if you want to fetch all Hass.io snapshots by issuing a GET request to `/api/hassio/snapshots`:

```js
hass.callApi('get', 'hassio/snapshots')
  .then(snapshots => console.log('Received snapshots!', snapshots));
```

If you need to pass in data, pass a third argument:

```js
hass.callApi('delete', 'notify.html5', { subscription: 'abcdefgh' });
```

_We're moving away from API calls and are migrating everything to `hass.callWS(message)` calls._
