---
title: "Develop Supervisor integration in Core & Frontend"
sidebar_label: "Developing"
---

These instructions are for setting up Home Assistant Core to interact with a development or remote supervisor. This allows you to develop the `hassio` integration and the Supervisor frontend with a real/development Supervisor instance.

For this guide, we're going to assume that you have a [Home Assistant Core development environment](development_environment.md) set up.

## Supervisor API Access

To develop for the frontend, we're going to need API access to the supervisor. This API is protected by a token that we can extract using a special add-on.

- Add our developer Add-on repository: <https://github.com/home-assistant/hassio-addons-development>
- Install the Add-on "Remote API proxy"
- Click Start
- The token will be printed in the logs

The add-on needs to keep running to allow Home Assistant Core to connect.

The Remote API proxy token has slightly less privileges than Home Assistant Core has in production. To get the actual token with full privileges, you need to SSH into the host system and run:

```shell
docker inspect homeassistant | grep HASSIO_TOKEN
```

Note that either token can change after a reboot or update of OS/container.

## Setting up Home Assistant Core

To configure Home Assistant Core to connect to a remote supervisor, set the following environment variables when starting Home Assistant:

- `HASSIO`: Set to the IP of the machine running Home Assnstaint and port 80 (the API proxy add-on)
- `HASSIO_TOKEN`: Set this to the token that you exracted in the previous step

```shell
HASSIO=192.168.1.100:80 HASSIO_TOKEN=abcdefghj1234 hass
```

Voila. Your local Home Assistant installation will now connect to a remote Hass.io instance.

## Frontend development

To do frontend development you need to have a [Home Assistant frontend development environment](/frontend/development.md) set up.

Update the Hass.io component configuration in your `configuration.yaml` to point at the frontend repository:

```yaml
# configuration.yaml
hassio:
  # Example path. Change it to where you have checked out the frontend repository
  development_repo: /home/paulus/dev/hass/frontend
```

To build a local version of the Supervisor panel, go to the frontend repository and run:

```shell
cd hassio
script/develop
```

Now start Home Assistant as discussed in the previous section and it will now connect to the remote Supervisor but load the frontend from your local development environment.

While `script/develop` is running, the Supervisor panel will be rebuilt whenever you make changes to the source files.
