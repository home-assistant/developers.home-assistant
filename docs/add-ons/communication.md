---
title: "Add-On Communication"
---

There are different ways for communication between add-ons inside Home Assistant.

## Network

We use an internal network that's allowed to communicate with every add-on, including to/from Home Assistant, by using its name or alias. Only add-ons that run on the host network are limited in that they can talk with all internal add-ons by their name, but all other add-ons can't address these add-ons by name. However, using an alias works for both!

Names/aliases are used for communication inside Hass.io.
The name is generated using the following format: `{REPO}_{SLUG}`, e.g., `local_xy` or `3283fh_myaddon`. In this example, `{SLUG}` is defined in an add-on's `config.json` file. You can use this name as the DNS name also, but you need replace any `_` with `-` to have a valid hostname. If an add-on is installed locally, `{REPO}` will be `local`. If the add-on is installed from a Github repository, `{REPO}` is a hashed identifier generated from the GitHub repository's URL (ex: `https://github.com/xy/my_hassio_addons`). See [here](https://github.com/home-assistant/hassio/blob/587047f9d648b8491dc8eef17dc6777f81938bfd/hassio/addons/utils.py#L17) to understand how this identifier is generated. Note that this identifier is required in certain service calls that use the [Supervisor add-on API][supervisor-addon-api]. You can view the repository identifiers for all currently-installed add-ons via a GET request to the hassio API `addons` endpoint.

Use `supervisor` for communication with the internal API.

## Home Assistant Core

An add-on can talk to the [Home Assistant Core API][core-api] using the internal proxy. This makes it very easy to communicate with the API without knowing the password, port or any other information about the Home Assistant instance. Using this URL: `http://supervisor/core/api` ensures that internal communication is redirected to the right place. The next step is to add `homeassistant_api: true` to the `config.json` file and read the environment variable `SUPERVISOR_TOKEN`. Use this as the Home Assistant Core [bearer token](/auth_api.md#making-authenticated-requests) when making requests.

For example `curl -X GET -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" -H "Content-Type: application/json" http://supervisor/core/api/discovery_info`

There is also a proxy for the [Home Assistant Websocket API][core-websocket] that works like the API proxy above and requires `SUPERVISOR_TOKEN` as the password. Use this URL: `http://supervisor/core/websocket`.

It is also possible to talk directly to the Home Assistant instance, which is named `homeassistant`, over the internal network. However, you'll need to know the configuration that is used by the running instance.

We have several services for Hass.io inside Home Assistant to run tasks. Send data over STDIN to an add-on to use the `hassio.addon_stdin` service.

## Supervisor API

To enable calls to the [Supervisor API][supervisor-api], add `hassio_api: true` to the `config.json` file and read the environment variable `SUPERVISOR_TOKEN`. Now you can use the API over the URL: `http://supervisor/`. Use the `SUPERVISOR_TOKEN` with header `Authorization: Bearer`. You may also need to change the Supervisor API role to `hassio_role: default`.

Add-ons can call some API commands without needing to set `hassio_api: true`:

- `/core/api`
- `/core/api/stream`
- `/core/websocket`
- `/addons/self/*`
- `/services*`
- `/discovery*`
- `/info`

***Note:*** For Home Assistant API access requirements, see above.

## Services API

We have an internal services API to make services public to other add-ons without the user need to add additional configuration. An add-on can get the full configuration for a service to use and to connect to. The add-on need to mark the usage of a service over his [configuration](configuration.md) in order to be able to access a service. All supported services, including its available options, are documented in the [API documentation][supervisor-services-api].

Supported services are:

- mqtt
- mysql

You can use Bashio to get this information for your add-on init as: `bashio::services <service> <query>`

For example:

```bash
MQTT_HOST=$(bashio::services mqtt "host")
MQTT_USER=$(bashio::services mqtt "username")
MQTT_PASSWORD=$(bashio::services mqtt "password")
```

[core-api]: /api/rest.md
[core-websocket]: /api/websocket.md
[supervisor-api]: https://github.com/home-assistant/supervisor/blob/master/API.md
[supervisor-addon-api]: https://github.com/home-assistant/supervisor/blob/dev/API.md#restful-for-api-addons
[supervisor-services-api]:https://github.com/home-assistant/supervisor/blob/dev/API.md#services-1
