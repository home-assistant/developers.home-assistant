---
title: "Using Config"
---

Based on where you are in the code, `config` can mean various things.

### On the hass object

On the hass object it is an instance of the Config class. The Config class contains the users preferred units, the path to the config directory and which components are loaded. [See available methods.](https://dev-docs.home-assistant.io/en/master/api/core.html#homeassistant.core.Config)

### Config passed into component setup

The `config` parameter passed to a component setup is a dictionary containing all of the user supplied configuration. The keys of the dictionary are the component names and the value is another dictionary with the component configuration.

The object will have already been validated using your `CONFIG_SCHEMA` or `PLATFORM_SCHEMA` if available. If you have defined a `PLATFORM_SCHEMA`, all references to your component (ie `light 2:` etc) will have been changed to be accessible as a list under `config[DOMAIN]`.

If your configuration file contains the following lines:

```yaml
example:
  host: paulusschoutsen.nl
```

Then in the setup method of your component you will be able to refer to `config['example']['host']` to get the value `paulusschoutsen.nl`.

### Passed into platform setup

The `config` parameter passed to a platform setup function is only the config for that specific platform.
