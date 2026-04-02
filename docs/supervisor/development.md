---
title: "Supervisor development"
sidebar_label: "Development"
---

These instructions are for development of the Supervisor, the Supervisor frontend panel and the `hassio` integration, by interacting with a development or remote supervisor, this assumes that you are using a development machine to do the development, these instructions will also use devcontainer and other tools that rely on Docker, follow our [devcontainer development environment](/docs/setup_devcontainer_environment) guide to set up a proper development environment first.


## Supervisor development

The instructions here is for development of the Supervisor itself.

1. Fork the Supervisor repo (https://github.com/home-assistant/supervisor) and clone it to your development machine.
2. Open the repo with Visual Studio Code devcontainer.
3. Create a branch in your fork.
4. Do your changes.
5. Test your changes with the instructions below.
6. Commit and push your changes, and create a PR against the `main` branch at https://github.com/home-assistant/supervisor

### Local testing

Start the task "Run Supervisor" in Visual Studio Code, this will start an instance of the Supervisor inside the devcontainer you can use to test your changes.
When the initializing is complete you can access the Home Assistant frontend on `http://localhost:9123`

### Testing on a remote system

1. Access the remote system with SSH or with direct console access.
2. Check the architecture on the machine with `ha info` or just `info` if it's Home Assistant OS.
3. On your development machine, build and push your Supervisor image to a container registry. Using GitHub Container Registry as an example (adjust `YOUR_GH_USERNAME` and the architecture to match what you found in step 2):

```bash
docker build \
    --platform linux/arm64 \
    --tag ghcr.io/YOUR_GH_USERNAME/aarch64-hassio-supervisor:latest \
    --push \
    .
```

:::note

All examples will have values you need to adjust.

- Adjust `linux/arm64` and `aarch64` with the architecture you found in step 2.
- Adjust `YOUR_GH_USERNAME` to match your GitHub username or organization.
- To push an image to GitHub Container Registry like in the example above, you need to authenticate using a personal access token with appropriate scopes. See the [GitHub Container Registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) for more details.

:::

:::note

The architecture used in `--platform` option is not the same as the one used in Home Assistant. While `amd64` in Home Assistant corresponds to  `--platform linux/amd64`, `aarch64` in Home Assistant corresponds to `--platform linux/arm64` in Docker.

:::

4. On your remote system change the channel to `dev` with `ha supervisor --channel dev` or just `supervisor --channel dev` if it's Home Assistant OS.
5. Pull down your Supervisor image:

```bash
docker pull ghcr.io/YOUR_GH_USERNAME/aarch64-hassio-supervisor:latest
```

:::note

Docker images uploaded to GHCR are by default private. To download them, you will either need to authenticate using a personal access token on the remote system as well or [change the visibility](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#configuring-visibility-of-packages-for-your-personal-account) of the package on GitHub.

:::

6. Tag your Supervisor image as the expected local name:

```bash
docker tag ghcr.io/YOUR_GH_USERNAME/aarch64-hassio-supervisor:latest ghcr.io/home-assistant/aarch64-hassio-supervisor:latest
```

7. Restart the `hassio-supervisor` service with `systemctl restart hassos-supervisor`
8. Check for issues with `journalctl -fu hassos-supervisor`

## Integration development

The instructions here is for development of the `hassio` integration, we're going to assume that you have a [Home Assistant Core development environment](development_environment.mdx) set up, and that you have [Supervisor API Access](#supervisor-api-access) set up.

To configure Home Assistant Core to connect to a remote supervisor, set the following environment variables when starting Home Assistant:

- `SUPERVISOR`: Set to the IP of the machine running Home Assistant and port 80 (the API proxy add-on)
- `SUPERVISOR_TOKEN`: Set this to the token that you found [Supervisor API Access](#supervisor-api-access)

```shell
SUPERVISOR=192.168.1.100:80 SUPERVISOR_TOKEN=abcdefghj1234 hass
```

Your local Home Assistant installation will now connect to a remote Home Assistant instance.

## Frontend development

:::info
All supervisor frontend panels are deprecated and won't be loaded with Home Assistant core >= 2026.2
:::

Home Assistant frontend uses supervisor through a core proxy. Checkout the [Home Assistant frontend development environment](/frontend/development.md) on how to develop the frontend.

## Supervisor API access

To develop for the `hassio` integration and the Supervisor panel, we're going to need API access to the supervisor. This API is protected by a token that we can extract using a special add-on. This can be done on a running system or with the [devcontainer](#local-testing).

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fhome-assistant%2Faddons-development)
[![Open your Home Assistant instance and show the dashboard of a Supervisor add-on.](https://my.home-assistant.io/badges/supervisor_addon.svg)](https://my.home-assistant.io/redirect/supervisor_addon/?addon=ae6e943c_remote_api)

1. Add our developer Add-on repository: [https://github.com/home-assistant/addons-development](https://github.com/home-assistant/addons-development)
2. Install the Add-on "Remote API proxy"
3. Click Start
4. The token will be printed in the logs

The add-on needs to keep running to allow Home Assistant Core to connect.

The Remote API proxy token has slightly less privileges than Home Assistant Core has in production. To get the actual token with full privileges, you need to SSH into the host system and run:

```shell
docker inspect homeassistant | grep SUPERVISOR_TOKEN
```

Note that either token can change after a reboot or update of OS/container.
