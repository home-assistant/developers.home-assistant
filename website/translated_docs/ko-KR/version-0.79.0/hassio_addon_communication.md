---
title: Add-On Communication
id: version-0.79.0-hassio_addon_communication
original_id: hassio_addon_communication
---

There are different ways for communication between add-ons inside Hass.io.

## Network

We use an internal network that allows to communicate with every add-on, even to/from Home Assistant, by using its name or alias. Only the add-ons which run on the host network are a bit limited. These can talk with all internal add-ons by their name but all other add-on can't address these add-on by name - using an alias works for both!

Name/alias are used for communication inside Hass.io. The name is generated using the following format: `{REPO}_{SLUG}`, e.g., `local_xy` or `3283fh_myaddon`. In this example, `{SLUG}` is defined in an add-ons `config.json`. You can use this name also as DNS name but you need replace the `_` with `-` to have a valid hostname. If an add-on is installed locally, `{REPO}` will be `local`. If the add-on is installed from a Github repository, `{REPO}` is a hashed identifier generated from the GitHub repository's URL (ex: https://github.com/xy/my_hassio_addons). See [here](https://github.com/home-assistant/hassio/blob/587047f9d648b8491dc8eef17dc6777f81938bfd/hassio/addons/utils.py#L17) to understand how this identifier is generated. Note that this identifier is required in certain service calls that use the [Hass.io add-on API](https://github.com/home-assistant/hassio/blob/dev/API.md#restful-for-api-addons). You can view the repository identifiers for all currently installed add-ons via a GET request to the hassio API `addons` endpoint.

Use `hassio` for communication with the internal API.

## Home Assistant

An add-on can talk to the [Home Assistant API](https://www.home-assistant.io/developers/rest_api/) using the internal proxy. That makes it very easy to communicate with the API without knowing the password, port or any other information of the Home Assistant instance. Use this URL: `http://hassio/homeassistant/api` and internal communication is redirected to the right place. The next stept is to add `homeassistant_api: true` to `config.json` and read the environment variable `HASSIO_TOKEN` and use this as Home-Assistant password.

There is also a proxy for the [Home Assistant Websocket API](https://www.home-assistant.io/developers/websocket_api/). It works like the API proxy above and requires `HASSIO_TOKEN` as password. Use this URL: `http://hassio/homeassistant/websocket`.

It is also possible to talk direct to the Home Assistant instance which is named `homeassistant` over the internal network. But you need to know the configuration that is used by the running instance.

We have severals services for Hass.io inside Home Assistant to run tasks. To send data over STDIN to an add-on use the `hassio.addon_stdin` service.

## Hass.io API

To enables calls to the [Hass.io API](https://github.com/home-assistant/hassio/blob/master/API.md), add `hassio_api: true` to `config.json` and read the environment variable `HASSIO_TOKEN`. Now you can use the API over the URL: `http://hassio/`. Use the `HASSIO_TOKEN` with header `X-HASSIO-KEY`. It could be that you need also change the Hass.io API role like `hassio_role: default`.

Add-ons can call some API commands without need set `hassio_api: true`:

- `/homeassistant/api`
- `/homeassistant/websocket`
- `/homeassistant/stream`
- `/addons/self/...`
- `/services*`