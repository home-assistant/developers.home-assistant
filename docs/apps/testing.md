---
title: "Local app testing"
---

The fastest and recommended way to develop apps (formerly known as add-ons) is using a local Visual Studio Code devcontainer. We maintain a [devcontainer for this purpose](https://github.com/home-assistant/devcontainer) which is used in all our app repositories. This devcontainer setup for VS Code runs Supervisor and Home Assistant, with all of the apps mapped as local apps inside, making it simple for app developers on Windows, Mac and Linux desktop OS-es.

- Follow the instructions to download and install the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code extension.
- Copy the [`devcontainer.json`](https://github.com/home-assistant/devcontainer/raw/main/apps/devcontainer.json) file to `.devcontainer/devcontainer.json` in your repository.
- Copy the [`tasks.json`](https://github.com/home-assistant/devcontainer/raw/main/apps/tasks.json) file to `.vscode/tasks.json` in your repository.
- Open the root folder inside VS Code, and when prompted re-open the window inside the container (or, from the Command Palette, select 'Rebuild and Reopen in Container').
- When VS Code has opened your folder in the container (which can take some time for the first run) you'll need to run the task (Terminal -> Run Task) 'Start Home Assistant', which will bootstrap Supervisor and Home Assistant.
- You'll then be able to access the normal onboarding process via the Home Assistant instance at `http://localhost:7123/`.
- The app(s) found in your root folder will automatically be found in the Local Apps repository.

## Remote development

If you require access to physical hardware or other resources that cannot be locally emulated (for example, serial ports), the next best option to develop apps is by adding them to the local app repository on a real device running Home Assistant. To access the local app repository on a remote device, install either the [Samba](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_samba) or the [SSH](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_ssh) apps and copy the app files to a subdirectory of `/addons`.

Right now apps will work with images that are stored on Docker Hub (using `image` from app config). To ensure that the app is built locally and not fetched from an upstream repository, ensure that the `image` key is commented out in your `config.yaml` file (You can do that by adding a `#` in front of it, like `#image: xxx`).

## Local build

If you don't want to use the devcontainer environment, you can build apps locally with standalone Docker. This is useful for quick single-architecture checks on the host you are currently working on.

Use `docker` from the directory containing the app files to build the test addon:

```shell
docker build \
  -t local/my-test-app \
  .
```

For a multi-platform build or cross-compilation, you can use the `--platform` flag with the appropriate target platform (e.g. `--platform linux/arm64` to build `aarch64` image in QEMU on an AMD64 host). See the official Docker documentation on [multi-platform builds](https://docs.docker.com/build/building/multi-platform/) for more details.

:::note

The architecture used in `--platform` option is not the same as the one used in Home Assistant. While `amd64` in Home Assistant corresponds to  `--platform linux/amd64`, `aarch64` in Home Assistant corresponds to `--platform linux/arm64` in Docker.

:::

## Local run

If you don't want to use the devcontainer environment, you can still run apps locally with Docker.

For that you can use the following command:

```shell
docker run \
  --rm \
  -v /tmp/my_test_data:/data \
  -p PORT_STUFF_IF_NEEDED \
  local/my-test-app
```

## Logs

All `stdout` and `stderr` outputs are redirected to the Docker logs. The logs can be fetched from the app page inside the Supervisor panel in Home Assistant.
