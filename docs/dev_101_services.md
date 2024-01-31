---
title: "Integration Services"
sidebar_label: "Custom Services"
---

Home Assistant provides ready-made services for a lot of things, but it doesn't always cover everything. Instead of trying to change Home Assistant, it is preferred to add it as a service under your own integration first. Once we see a pattern in these services, we can talk about generalizing them.

This is a simple "hello world" example to show the basics of registering a service. To use this example, create the file `<config dir>/custom_components/hello_service/__init__.py` and copy the below example code.

Services can be called from automations and from the service "Developer tools" in the frontend.

```python
DOMAIN = "hello_service"

ATTR_NAME = "name"
DEFAULT_NAME = "World"


def setup(hass, config):
    """Set up is called when Home Assistant is loading our component."""

    def handle_hello(call):
        """Handle the service call."""
        name = call.data.get(ATTR_NAME, DEFAULT_NAME)

        hass.states.set("hello_service.hello", name)

    hass.services.register(DOMAIN, "hello", handle_hello)

    # Return boolean to indicate that initialization was successful.
    return True
```

To load the integration in Home Assistant is necessary to create a `manifest.json` and to add an entry in your `configuration.yaml`. When your component is loaded, a new service should be available to call.

```yaml
# configuration.yaml entry
hello_service:
```

An example of `manifest.json`:

```json
{
    "domain": "hello_service",
    "name": "Hello Service",
    "documentation": "https://developers.home-assistant.io/docs/dev_101_services",
    "iot_class": "local_push",
    "version": "0.1.0"
}
```

Open the frontend and in the sidebar, click the first icon in the developer tool section. This will open the Call Service developer tool. On the right, find your service and click on it. This will automatically fill in the correct values.

Pressing "Call Service" will now call your service without any parameters. This will cause your service to create a state with the default name 'World'. If you want to specify the name, you have to specify a parameter by providing it through Service Data. In YAML mode, add the following and press "Call Service again".

```yaml
service: helloworld_service.hello
data:
  name: Planet
```

The service will now overwrite the previous state with "Planet".

## Service descriptions

Adding services is only useful if users know about them. In Home Assistant we use a `services.yaml` as part of your integration to describe the services.

Services are published under the domain name of your integration, so in `services.yaml` we only use the service name as the base key.

```yaml
# Example services.yaml entry

# Service ID
set_speed:
  # If the service accepts entity IDs, target allows the user to specify entities by
  # entity, device, or area. If `target` is specified, `entity_id` should not be
  # defined in the `fields` map. By default it shows only targets matching entities
  # from the same domain as the service, but if further customization is required,
  # target supports the entity, device, and area selectors
  # (https://www.home-assistant.io/docs/blueprint/selectors/). Entity selector
  # parameters will automatically be applied to device and area, and device selector
  # parameters will automatically be applied to area. 
  target:
    entity:
      domain: fan
      # If not all entities from the service's domain support a service, entities
      # can be further filtered by the `supported_features` state attribute. An
      # entity will only be possible to select if it supports at least one of the
      # listed supported features.
      supported_features:
        - fan.FanEntityFeature.SET_SPEED
        # If a service requires more than one supported feature, the item should
        # be given as a list of required supported features. For example, if the
        # service requires both SET_SPEED and OSCILLATE it would be expressed like this
        - - fan.FanEntityFeature.SET_SPEED
          - fan.FanEntityFeature.OSCILLATE
  # Different fields that your service accepts
  fields:
    # Key of the field
    speed:
      # Whether or not field is required (default = false)
      required: true
      # Advanced fields are only shown when the advanced mode is enabled for the user
      # (default = false)
      advanced: true
      # Example value that can be passed for this field
      example: "low"
      # The default field value
      default: "high"
      # Selector (https://www.home-assistant.io/docs/blueprint/selectors/) to control
      # the input UI for this field
      selector:
        select:
          translation_key: "fan_speed"
          options:
            - "off"
            - "low"
            - "medium"
            - "high"
```

:::info
The name and description of the services are set in our [translations](/docs/internationalization/core#services) and not in the service description. Each service and service field must have a matching translation defined.
:::

### Filtering service fields

In some cases, entities from a service's domain may not support all service fields. By
providing a `filter` for the field description, the field will only be shown if at least
one selected entity supports the field according to the configured filter.

A filter must specify either `supported_features` or `attribute`, combing both is not
supported.

A `supported_features` filter is specified by of a list of supported features. The field
will be shown if at least one selected entity supports at least one of the listed features.

An `attribute` filter combines an attribute with a list of values. The field will be
shown if at least one selected entity's attribute is set to one of the listed attribute states.
If the attribute state is a list, the field will be shown if at least one item in a selected
entity's attribute state is set to one of the listed attribute states.

This is a partial example of a field which is only shown if at least one selected entity
supports `ClimateEntityFeature.TARGET_TEMPERATURE`:

```yaml
  fields:
    temperature:
      name: Temperature
      description: New target temperature for HVAC.
      filter:
        supported_features:
          - climate.ClimateEntityFeature.TARGET_TEMPERATURE
```

This is a partial example of a field which is only shown if at least one selected entity's
`supported_color_modes` attribute includes either `light.ColorMode.COLOR_TEMP` or
`light.ColorMode.HS`:

```yaml
    color_temp:
      name: Color temperature
      description: Color temperature for the light in mireds.
      filter:
        attribute:
          supported_color_modes:
            - light.ColorMode.COLOR_TEMP
            - light.ColorMode.HS
```

## Icons

Services can also have icons. These icons are used in the Home Assistant UI when displaying the service in places like the automation and script editors.

The icon to use for each service can be defined in the `icons.json` translation file in the integration folder, under the `services` key. The key should be the service name, and the value should be the icon to use.

The following example, shows how to provide icons for the `turn_on` and `turn_off` services of an integration:

```json
{
  "services": {
    "turn_on": "mdi:lightbulb-on",
    "turn_off": "mdi:lightbulb-off"
  }
}
```


## Entity Services

Sometimes you want to provide extra services to control your entities. For example, the Sonos integration provides services to group and ungroup devices. Entity services are special because there are many different ways a user can specify entities. It can use areas, a group or a list of entities.

You need to register entity services in your platforms, like `<your-domain>/media_player.py`. These services will be made available under your domain and not the media player domain. Example code:

```python
from homeassistant.helpers import config_validation as cv, entity_platform, service

async def async_setup_entry(hass, entry):
    """Set up the media player platform for Sonos."""

    platform = entity_platform.async_get_current_platform()

    # This will call Entity.set_sleep_timer(sleep_time=VALUE)
    platform.async_register_entity_service(
        SERVICE_SET_TIMER,
        {
            vol.Required('sleep_time'): cv.time_period,
        },
        "set_sleep_timer",
    )
```

If you need more control over the service call, you can also pass an async function that instead of `"set_sleep_timer"`:

```python
async def custom_set_sleep_timer(entity, service_call):
    await entity.set_sleep_timer(service_call.data['sleep_time'])
```

## Response Data

Services may respond to a service call with data for powering more advanced automations. There are some additional implementation requirements:

- Response data must be a `dict` and serializable in JSON [`homeassistant.util.json.JsonObjectType`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/util/json.py) in order to interoperate with other parts of the system, such as the frontend.
- Errors must be raised as exceptions just like any other service call as we do
not want end users to need complex error handling in scripts and automations.
The response data should not contain error codes used for error handling.

Example code:

```python
import datetime
import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.helpers import config_validation as cv, entity_platform, service
from homeassistant.util.json import JsonObjectType


SEARCH_ITEMS_SERVICE_NAME = "search_items"
SEARCH_ITEMS_SCHEMA = vol.Schema({
    vol.Required("start"): datetime.datetime,
    vol.Required("end"): datetime.datetime,
})


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the platform."""

    async def search_items(call: ServiceCall) -> ServiceResponse:
        """Search in the date range and return the matching items."""
        items = await my_client.search(call.data["start"], call.data["end"])
        return {
            "items": [
                {
                    "summary": item["summary"],
                    "description": item["description"],
                } for item in items
            ],
        }

      hass.services.async_register(
          DOMAIN,
          SEARCH_ITEMS_SERVICE_NAME,
          search_items,
          schema=SEARCH_ITEMS_SCHEMA,
          supports_response=SupportsResponse.ONLY,
      )
```

The use of response data is meant for cases that do not fit the Home Assistant state. For example, a response stream of objects. Conversely, response data should not be used for cases that are a fit for entity state. For example, a temperature value should just be a sensor.

### Supporting Response Data

Service calls are registered with a `SupportsResponse` value to indicate response data is supported.

| Value      | Description                                                                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPTIONAL` | The service performs an action and can optionally return response data. The service should conditionally check the `ServiceCall` property `return_response` to decide whether or not response data should be returned, or `None`. |
| `ONLY`     | The service doesn't perform any actions and always returns response data.                                                                                                                                                         |
