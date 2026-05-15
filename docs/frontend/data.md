---
title: "Frontend data"
sidebar_label: "Data"
---

The frontend passes a single `hass` object around. This object contains the latest state, allows you to send commands back to the server and provides helpers to format entity state.

Whenever a state changes, a new version of the objects that changed are created. So you can easily see if something has changed by doing a strict equality check:

```js
const changed = newVal !== oldVal;
```

In order to see the data available in the `hass` object, visit your HomeAssistant frontend in your favorite browser and open the browser's developer tools. On the elements panel, select the `<home-assistant>` element, or any other element that has the `hass` property, and then run the following command in the console panel:

```js
$0.hass
```

This method of reading the `hass` object should only be used as a reference. In order to interact with `hass` in your code, make sure it is passed to your code correctly.

## Data

### Context

The recommended way to get data from Home Assistant is to consume the available contexts. The most common context is the `states` context, which contains the states of all entities in Home Assistant. You can also create your own local contexts to pass data around.

To consume a context you fire a custom event with a callback to get registered at the context provider. The context provider sends you initial data and if you have subscribed to updates it will also send you updates whenever the data changes.

#### Available contexts

- `connection`: hass connection information object
- `states`: states of all entities in Home Assistant
- `entities`: entities in Home Assistant
- `extendedEntities`: entities of Home Assistant with extended context
- `devices`: devices in Home Assistant
- `areas`: areas in Home Assistant
- `floors`: floors in Home Assistant
- `labels`: labels in Home Assistant
- `configEntries`: config entries of Home Assistant
- `auth`: authentication information of Home Assistant
- `localize`: function to localize a string
- `locale`: Locale informations
- `config`: System configuration of Home Assistant
- `themes`: Themes of Home Assistant
- `selectedTheme`: Currently selected theme
- `user`: The logged in user
- `userData`: CoreFrontendUserData of the logged in user
- `panels`: available panels of Home Assistant


#### Consume a context in lit

```ts
@consume({ context: labelsContext, subscribe: true })
@state()
private _labels?: LabelRegistryEntry[];
```


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
  "is_admin": true,
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

Call a service action on the backend.

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

Call an API on the Home Assistant server. For example, if you want to fetch all Home Assistant backups by issuing a GET request to `/api/hassio/backups`:

```js
hass.callApi('get', 'hassio/backups')
  .then(backups => console.log('Received backups!', backups));
```

If you need to pass in data, pass a third argument:

```js
hass.callApi('delete', 'notify.html5', { subscription: 'abcdefgh' });
```

:::info
We're moving away from API calls and are migrating everything to `hass.callWS(message)` calls.
:::

## Entity state formatting

These methods allow you to format the state and attributes of an entity. The value will be localized using user profile settings (language, number format, date format, timezone) and unit of measurement.

### `hass.formatEntityState(stateObj, state)`

Format the state of an entity. You need to pass the entity state object.

```js
hass.formatEntityState(hass.states["light.my_light"]); // "On"
```

You can force the state value using the second optional parameter.

```js
hass.formatEntityState(hass.states["light.my_light"], 'off'); // "Off"
```

### `hass.formatEntityAttributeValue(stateObj, attribute, value)`

Format the attribute value of an entity. You need to pass the entity state object and the attribute name.

```js
hass.formatEntityAttributeValue(hass.states["climate.thermostat"], "current_temperature"); // "20.5 °C"
```

You can force the state value using the third optional parameter.

```js
hass.formatEntityAttributeValue(hass.states["climate.thermostat"], "current_temperature", 18); // "18 °C"
```

### `hass.formatEntityAttributeName(stateObj, attribute)`

Format the attribute name of an entity. You need to pass the entity state object and the attribute name.

```js
hass.formatEntityAttributeName(hass.states["climate.thermostat"], "current_temperature"); // "Current temperature"
```

### `hass.formatEntityName(stateObj, name, options)`

_Available since Home Assistant 2026.4._

Format the display name of an entity using its registry context (entity, device, area, floor). This is the same helper used by the built-in cards (tile, entity rows, etc.) so custom cards can produce consistent labels.

The `name` argument can be:

- A plain `string` — returned as-is. Use this to honor a user-provided override.
- A single name item, like `{ type: "entity" }`.
- An array of name items, joined with the separator. Items can reference registry data (`entity`, `device`, `area`, `floor`) or be literal `text`.
- `undefined` — falls back to the entity's friendly name.

```ts
type EntityNameItem =
  | { type: "entity" | "device" | "area" | "floor" }
  | { type: "text"; text: string };

interface EntityNameOptions {
  separator?: string; // defaults to " "
}
```

For the examples below, assume `sensor.living_room_thermostat_temperature` is the temperature sensor of a thermostat device, where:

- entity name: `Temperature`
- device name: `Thermostat`
- area: `Living room`
- floor: `Ground floor`

```js
const stateObj = hass.states["sensor.living_room_thermostat_temperature"];

// Friendly name fallback
hass.formatEntityName(stateObj, undefined); // "Thermostat Temperature"

// User-provided override
hass.formatEntityName(stateObj, "Indoor temperature"); // "Indoor temperature"

// Single registry item
hass.formatEntityName(stateObj, { type: "entity" }); // "Temperature"
hass.formatEntityName(stateObj, { type: "area" }); // "Living room"

// Composed display with a custom separator
hass.formatEntityName(
  stateObj,
  [{ type: "device" }, { type: "entity" }],
  { separator: " · " }
); // "Thermostat · Temperature"

// Mix literal text and registry items
hass.formatEntityName(
  stateObj,
  [{ type: "text", text: "Floor:" }, { type: "floor" }]
); // "Floor: Ground floor"
```

#### Using it in a custom card

A common pattern is to accept a `name` option in the card configuration and forward it directly to `formatEntityName`. This lets users either provide a string or use the structured form to combine registry data.

```yaml
type: custom:my-card
entity: sensor.living_room_thermostat_temperature
name:
  - type: area
  - type: entity
```

Inside your card class:

```js
setConfig(config) {
  if (!config.entity) {
    throw new Error("You need to define an entity");
  }
  this._config = config;
}

render() {
  const stateObj = this.hass.states[this._config.entity];
  const name = this.hass.formatEntityName(stateObj, this._config.name);
  return html`<div>${name}</div>`;
}
```

#### Editing it in the visual editor

The frontend ships an `entity_name` selector that produces values in the shape `formatEntityName` accepts. In a card using the [built-in form editor](/docs/frontend/custom-ui/custom-card#using-the-built-in-form-editor), reference the entity field through `context` so the selector knows which entity to resolve the registry context against:

```js
{
  name: "name",
  selector: {
    entity_name: {},
  },
  context: {
    entity: "entity",
  },
}
```

The value produced by the selector matches what `formatEntityName` accepts: either a plain string (free-form custom name) or one or more `EntityNameItem` entries (composed from registry data). The selector UI lets users switch between the two modes.

The selector accepts two options:

- `entity_id`: hardcode the entity used to preview names (overrides `context.entity`).
- `default_name`: the value shown when the field is empty. Accepts the same `string | EntityNameItem | EntityNameItem[]` shape.
