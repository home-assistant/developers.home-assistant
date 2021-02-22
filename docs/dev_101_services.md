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

    # Return boolean to indicate that initialization was successfully.
    return True
```

Load the integration by adding the following to your `configuration.yaml`. When your component is loaded, a new service should be available to call.

```yaml
# configuration.yaml entry
hello_service:
```

Open the frontend and in the sidebar, click the first icon in the developer tool section. This will open the Call Service developer tool. On the right, find your service and click on it. This will automatically fill in the correct values.

Pressing "Call Service" will now call your service without any parameters. This will cause your service to create a state with the default name 'World'. If you want to specify the name, you have to specify parameters. Add the following JSON as Service Data and press "Call Service again".

```json
{
  "name": "Planet"
}
```

The service will now overwrite the previous state with "Planet".

## Service descriptions

Adding services is only useful if users know about them. In Home Assistant we use a `services.yaml` as part of your integration to describe the services.

Services are published under the domain name of your integration, so in `services.yaml` we only use the service name as the base key.

```yaml
# Example services.yaml entry

# Service ID
set_speed:
  # Service name as shown in UI
  name: Set fan speed.
  # Description of the service
  description: Sets fan speed.
  # If the service accepts entity IDs, target allows the user to specify entities by entity, device, or area.
  target:
    # Target supports the entity, device, and area selectors (https://www.home-assistant.io/docs/blueprint/selectors/). Entity selector parameters will automatically be applied to device and area, and device selector parameters will automatically be applied to area. In this example, the lists will be filtered by: entities in the fan domain, devices that are linked to entities in the fan domain, and areas that have entities in the fan domain.
    entity:
      domain: fan
  # Different fields that your service accepts
  fields:
    # Key of the field
    speed:
      # Field name as shown in UI
      name: Speed setting
      # Description of the field
      description: Speed setting
      # Whether or not field is required
      required: true
      # Example value that can be passed for this field
      example: "low"
      # Selector (https://www.home-assistant.io/docs/blueprint/selectors/) to control the input UI for this field
      selector:
        text:

```

## Entity Services

Sometimes you want to provide extra services to control your entities. For example, the Sonos integration provides services to group and ungroup devices. Entity services are special because there are many different ways a user can specify entities. It can use areas, a group or a list of entities.

You need to register entity services in your platforms, like `<your-domain>/media_player.py`. These services will be made available under your domain and not the media player domain. Example code:

```python
from homeassistant.helpers import config_validation as cv, entity_platform, service

async def async_setup_entry(hass, entry):
    """Set up the media player platform for Sonos."""

    platform = entity_platform.current_platform.get()

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
