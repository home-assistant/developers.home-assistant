---
title: "Hass.io <> Home Assistant integration development"
sidebar_label: "HASS Integration development"
---

These steps will help you connect your local Home Assistant to a remote Hass.io instance. You can then make changes locally to either the Hass.io component or the frontend and test it out against a real instance.

For this guide, we're going to assume that you have an Hass.io instance up and running. If you don't, you can use the generic installation method to install it inside a [virtual machine](https://github.com/home-assistant/hassio-build/tree/master/install#install-hassio).

## API Access

To develop for the frontend, we're going to need API access to the supervisor.

- Add our developer Add-on repository: https://github.com/home-assistant/hassio-addons-development
- Install the Add-on "Remote API proxy"

For some API commands you need explicit the Home Assistant API token, but 99% of the functionality work with `Remote API proxy`. This token change some times but you can read the current legal token on host system with:
```sh
$ docker inspect homeassistant | grep HASSIO_TOKEN
```

 ## Having Home Assistant connect to remote Hass.io

 The connection with the supervisor is hidden inside the host and is only accessible from applications running on the host. So to make it accessible for our Home Assistant instance, we will need to route the connection to our computer running Home Assistant. We're going to do this by forwarding the API with "Remote API proxy" Add-on.

First, make sure Home Assistant will load the Hass.io component by adding `hassio:` to your `configuration.yaml` file. Next, we will need to tell Hass.io component how to connect to the remote Hass.io instance, we do this by setting the `HASSIO` and `HASSIO_TOKEN` environment variables when starting Home Assistant. Note that the `HASSIO` value is not the same as the one that we saw above and the `HASSIO_TOKEN` is available inside log output of "Remote API Add-on" (This change every restart of this Add-on!).

```bash
HASSIO=<IP OF HASS.IO>:80 HASSIO_TOKEN=<VALUE OF HASSIO_TOKEN> hass
```

Voila. Your local Home Assistant installation will now connect to a remote Hass.io instance.

## Frontend development

> This requires Home Assistant 0.71 or later.

We need a couple more steps to do frontend development. First, make sure you have a Home Assistant frontend development set up ([instructions](frontend_index.md)).

Update the Hass.io component configuration in your `configuration.yaml` to point at the frontend repository:

```yaml
# configuration.yaml
hassio:
  development_repo: /home/paulus/dev/hass/home-assistant-polymer
```

To build a local version of the Hass.io panel, go to the frontend repository and run:

```bash
cd hassio
script/build_hassio
```

Now start Home Assistant as discussed in the previous section and it will now connect to the remote Hass.io but show your local frontend.

We're currently transitioning in how we're building the frontend so we don't have an incremental development mode just yet. For now, after making a local change, run `script/build_hassio` again.
