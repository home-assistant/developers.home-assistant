---
title: Add-On Communication
id: version-0.94.0-hassio_addon_communication
original_id: hassio_addon_communication
---

There are different ways for communication between add-ons inside Hass.io.

## Network

We use an internal network that's allowed to communicate with every add-on, including to/from Home Assistant, by using its name or alias. Only add-ons that run on the host network are limited in that they can talk with all internal add-ons by their name, but all other add-ons can't address these add-ons by name. However, using an alias works for both!

Names/aliases are used for communication inside Hass.io.
The name is generated using the following format: `{REPO}_{SLUG}`, e.g., `local_xy` or `3283fh_myaddon`. In this example, `{SLUG}` is defined in an add-on's `config.json` file. You can use this name as the DNS name also, but you need replace any `_` with `-` to have a valid hostname. If an add-on is installed locally, `{REPO}` will be `local`. If the add-on is installed from a Github repository, `{REPO}` is a hashed identifier generated from the GitHub repository's URL (ex: https://github.com/xy/my_hassio_addons). See [here](https://github.com/home-assistant/hassio/blob/587047f9d648b8491dc8eef17dc6777f81938bfd/hassio/addons/utils.py#L17) to understand how this identifier is generated. Note that this identifier is required in certain service calls that use the [Hass.io add-on API][hassio-addon-api]. You can view the repository identifiers for all currently-installed add-ons via a GET request to the hassio API `addons` endpoint.

Use `hassio` for communication with the internal API.

## Home Assistant

An add-on can talk to the [Home Assistant API][hass-api] using the internal proxy. This makes it very easy to communicate with the API without knowing the password, port or any other information about the Home Assistant instance. Using this URL: `http://hassio/homeassistant/api` ensures that internal communication is redirected to the right place. The next step is to add `homeassistant_api: true` to the `config.json` file and read the environment variable `HASSIO_TOKEN`. Use this as the Home-Assistant password.

There is also a proxy for the [Home Assistant Websocket API][hass-websocket] that works like the API proxy above and requires `HASSIO_TOKEN` as the password. Use this URL: `http://hassio/homeassistant/websocket`.

It is also possible to talk directly to the Home Assistant instance, which is named `homeassistant`, over the internal network. However, you'll need to know the configuration that is used by the running instance.

We have several services for Hass.io inside Home Assistant to run tasks. Send data over STDIN to an add-on to use the `hassio.addon_stdin` service.

## Hass.io API

To enable calls to the [Hass.io API][hassio-api], add `hassio_api: true` to the `config.json` file and read the environment variable `HASSIO_TOKEN`. Now you can use the API over the URL: `http://hassio/`. Use the `HASSIO_TOKEN` with header `X-HASSIO-KEY`. You may also need to change the Hass.io API role to `hassio_role: default`.

Add-ons can call some API commands without needing to set `hassio_api: true`:
- `/homeassistant/api`
- `/homeassistant/api/stream`
- `/homeassistant/websocket`
- `/addons/self/*`
- `/services*`
- `/discovery*`
- `/info`

***Note:*** For Home Assistant API access requirements, see above.

[hass-api]: https://www.home-assistant.io/developers/rest_api/
[hass-websocket]: https://www.home-assistant.io/developers/websocket_api/
[hassio-api]: https://github.com/home-assistant/hassio/blob/master/API.md
[hassio-addon-api]: https://github.com/home-assistant/hassio/blob/dev/API.md#restful-for-api-addons
