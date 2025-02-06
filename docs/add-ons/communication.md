---
title: "Add-on communication"
---

There are different ways of communicating between add-ons inside Home Assistant.

## Network

We use an internal network that's allowed to communicate with every add-on, including to/from Home Assistant, by using its name or alias. Only add-ons that run on the host network are limited in that they can talk with all internal add-ons by their name, but all other add-ons can't address these add-ons by name. However, using an alias works for both!

Names/aliases are used for communication inside Home Assistant.
The name is generated using the following format: `{REPO}_{SLUG}`, e.g., `local_xy` or `3283fh_myaddon`. In this example, `{SLUG}` is defined in an add-on's `config.yaml` file. You can use this name as the DNS name also, but you need to replace any `_` with `-` to have a valid hostname. If an add-on is installed locally, `{REPO}` will be `local`. If the add-on is installed from a Github repository, `{REPO}` is a hashed identifier generated from the GitHub repository's URL (ex: `https://github.com/xy/my_hassio_addons`). See [here](https://github.com/home-assistant/supervisor/blob/4ac7f7dcf08abb6ae5a018536e57d078ace046c8/supervisor/store/utils.py#L17) to understand how this identifier is generated. Note that this identifier is required in certain actions that use the [Supervisor add-on API][supervisor-addon-api]. You can view the repository identifiers for all currently installed add-ons via a GET request to the Supervisor API `addons` endpoint.

Use `supervisor` for communication with the internal API.

## Home Assistant Core

An add-on can talk to the [Home Assistant Core API][core-api] using the internal proxy. This makes it very easy to communicate with the API without knowing the password, port or any other information about the Home Assistant instance. Using this URL: `http://supervisor/core/api/` ensures that internal communication is redirected to the right place. The next step is to add `homeassistant_api: true` to the `config.yaml` file and read the environment variable `SUPERVISOR_TOKEN`. Use this as the Home Assistant Core [bearer token](/auth_api.md#making-authenticated-requests) when making requests.

For example `curl -X GET -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" -H "Content-Type: application/json" http://supervisor/core/api/config`

There is also a proxy for the [Home Assistant Websocket API][core-websocket] that works like the API proxy above and requires `SUPERVISOR_TOKEN` as the password. Use this URL: `ws://supervisor/core/websocket`.

It is also possible to talk directly to the Home Assistant instance, which is named `homeassistant`, over the internal network. However, you'll need to know the configuration that is used by the running instance.

We have several actions inside Home Assistant to run tasks. Send data over STDIN to an add-on to use the `hassio.addon_stdin` action.

## Supervisor API

To enable calls to the [Supervisor API][supervisor-api], add `hassio_api: true` to the `config.yaml` file and read the environment variable `SUPERVISOR_TOKEN`. Now you can use the API over the URL: `http://supervisor/`. Use the `SUPERVISOR_TOKEN` with header `Authorization: Bearer`. You may also need to change the Supervisor API role to `hassio_role: default`.

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

We have an internal services API to make services public to other add-ons without the user needing to add any configuration. An add-on can get the full configuration for a service to use and to connect to it. The add-on needs to mark the usage of a service in the add-on [configuration](configuration.md) in order to be able to access a service. All supported services, including its available options, are documented in the [API documentation][supervisor-services-api].

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
[supervisor-api]: /api/supervisor/endpoints.md
[supervisor-addon-api]: /api/supervisor/endpoints.md#addons
[supervisor-services-api]: /api/supervisor/endpoints.md#service
