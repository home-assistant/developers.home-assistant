---
title: Integration Services
sidebar_label: Custom Services
id: version-0.91.2-dev_101_services
original_id: dev_101_services
---

Home Assistant provides ready-made services for a lot of things, but it doesn't always cover everything. Instead of trying to change Home Assistant, it is preferred to add it as a service under your own integration first. Once we see a pattern in these services, we can talk about generalizing them.

This is a simple "hello world" example to show the basics of registering a service. To use this example, create the file `<config dir>/custom_components/hello_service/__init__.py` and copy the below example code.

Services can be called from automations and from the service "Developer tools" in the frontend.

```python
DOMAIN = 'hello_service'

ATTR_NAME = 'name'
DEFAULT_NAME = 'World'


def setup(hass, config):
    """Set up is called when Home Assistant is loading our component."""

    def handle_hello(call):
        """Handle the service call."""
        name = call.data.get(ATTR_NAME, DEFAULT_NAME)

        hass.states.set('hello_service.hello', name)

    hass.services.register(DOMAIN, 'hello', handle_hello)

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

set_speed:
  # Description of the service
  description: Sets fan speed.
  # Different fields that your service accepts
  fields:
    # Key of the field
    entity_id:
      # Description of the field
      description: Name(s) of the entities to set
      # Example value that can be passed for this field
      example: 'fan.living_room'
    speed:
      description: Speed setting
      example: 'low'
```