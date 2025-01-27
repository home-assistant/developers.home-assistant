---
title: "Local add-on testing"
---

The fastest and recommended way to develop add-ons is using a local Visual Studio Code devcontainer. We maintain a [devcontainer for this purpose](https://github.com/home-assistant/devcontainer) which is used in all our add-on repositories. This devcontainer setup for VS Code runs Supervisor and Home Assistant, with all of the add-ons mapped as local add-ons inside, making it simple for add-on developers on Windows, Mac and Linux desktop OS-es.

- Follow the instructions to download and install the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code extension.
- Copy the [`devcontainer.json`](https://github.com/home-assistant/devcontainer/raw/main/addons/devcontainer.json) file to `.devcontainer/devcontainer.json` in your repository.
- Copy the [`tasks.json`](https://github.com/home-assistant/devcontainer/raw/main/addons/tasks.json) file to `.vscode/tasks.json` in your repository.
- Open the root folder inside VS Code, and when prompted re-open the window inside the container (or, from the Command Palette, select 'Rebuild and Reopen in Container').
- When VS Code has opened your folder in the container (which can take some time for the first run) you'll need to run the task (Terminal -> Run Task) 'Start Home Assistant', which will bootstrap Supervisor and Home Assistant.
- You'll then be able to access the normal onboarding process via the Home Assistant instance at `http://localhost:7123/`.
- The add-on(s) found in your root folder will automatically be found in the Local Add-ons repository.

## Remote development

If you require access to physical hardware or other resources that cannot be locally emulated (for example, serial ports), the next best option to develop add-ons is by adding them to the local add-on repository on a real device running Home Assistant. To access the local add-on repository on a remote device, install either the [Samba](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_samba) or the [SSH](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_ssh) add-ons and copy the add-on files to a subdirectory of `/addons`.

Right now add-ons will work with images that are stored on Docker Hub (using `image` from add-on config). To ensure that the add-on is built locally and not fetched from an upstream repository, ensure that the `image` key is commented out in your `config.yaml` file (You can do that by adding a `#` in front of it, like `#image: xxx`).

## Local build

If you don't want to use the devcontainer environment, you can still build add-ons locally with Docker. The recommended method is to use the [official build tool][hassio-builder] to create the Docker images.

Assuming that your addon is in the folder `/path/to/addon` and your Docker socket is at `/var/run/docker.sock`, you can build the addon for all supported architectures by running the following:

```shell
docker run \
  --rm \
  -it \
  --name builder \
  --privileged \
  -v /path/to/addon:/data \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  ghcr.io/home-assistant/amd64-builder \
  -t /data \
  --all \
  --test \
  -i my-test-addon-{arch} \
  -d local
```

If you don't want to use the official build tool, you can still build with standalone Docker. If you use `FROM $BUILD_FROM` you'll need to set a base image with build args. Normally you can use following base images:

- armhf: `ghcr.io/home-assistant/armhf-base:latest`
- aarch64: `ghcr.io/home-assistant/aarch64-base:latest`
- amd64: `ghcr.io/home-assistant/amd64-base:latest`
- i386: `ghcr.io/home-assistant/i386-base:latest`

Use `docker` from the directory containing the add-on files to build the test addon:

```shell
docker build \
  --build-arg BUILD_FROM="ghcr.io/home-assistant/amd64-base:latest" \
  -t local/my-test-addon \
  .
```

[hassio-builder]: https://github.com/home-assistant/builder

## Local run

If you don't want to use the devcontainer environment, you can still run add-ons locally with Docker.

For that you can use the following command:

```shell
docker run \
  --rm \
  -v /tmp/my_test_data:/data \
  -p PORT_STUFF_IF_NEEDED \
  local/my-test-addon
```

## Logs

All `stdout` and `stderr` outputs are redirected to the Docker logs. The logs can be fetched from the add-on page inside the Supervisor panel in Home Assistant.
