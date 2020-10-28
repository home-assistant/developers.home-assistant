---
title: "Local add-on testing"
---

The fastest and recommended way to develop add-ons is using a local Visual Studio Code dev environment. The [Official Add-ons][hassio-addons] repository includes a dev container setup for VS Code which will run Supervisor and Home Assistant, with all of the add-ons mapped as Local Add-ons inside, making it simple for add-on developers on Windows, Mac and Linux desktop OS-es. 

- Follow the instructions to download and install the [Remote Containers][remote-containers] VS Code extension.
- Copy the `.devcontainer` folder from [Official Add-ons][hassio-addons] repository into the root of your add-ons folders.
- Open the root folder inside VS Code, and when prompted re-open the window inside the container (or, from the Command Palette, select 'Rebuild and Reopen in Container'). 
- When VS Code has opened your folder in the container (which can take some time for the first run) you'll need to run the task (Terminal -> Run Task) 'Start Home Assistant', which will bootstrap Supervisor and Home Assistant. 
- You'll then be able to access the normal onboarding process via the Home Assistant instance at `http://localhost:8123/`.
- The add-on(s) found in your root folder will automatically be found in the Local Add-ons repository.

For standalone add-ons, there also exists an [addon devcontainer template][hassio-addon-devcontainer] on GitHub which provides the same boilerplate dev container for new add-on projects.

[hassio-addons]: https://github.com/home-assistant/hassio-addons
[remote-containers]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
[hassio-addon-devcontainer]: https://github.com/issacg/hassio-addon-devcontainer	

:::info

The bootstrap script (start\_supervisor.sh) currently does not support Docker on Windows using the WSL 2 based engine. The message "_Timeout while waiting for docker to come up_" will appear in the terminal.

If you are using Docker Desktop and have Hyper-V support, you can switch back to legacy Hyper-V backend in Settings > General.
:::

## Remote development

If you require access to physical hardware or other resources that cannot be locally emulated (for example, serial ports), the next best option to develop add-ons is by adding them to the local add-on repository on a real device running Home Assistant. To access the local add-on repository on a remote device, install either the [Samba add-on] or [SSH add-on] and copy the add-on files to a subdirectory of `/addons`.

Right now add-ons will work with images that are stored on Docker Hub (using `image` from add-on config). To ensure that the add-on is built locally and not fetched from an upstream repository, ensure that the `image` key is *not* present in your `config.json`.

[Samba add-on]: https://www.home-assistant.io/addons/samba/
[SSH add-on]: https://www.home-assistant.io/addons/ssh/

## Local build

If you don't want to use the devcontainer environment, you can still build add-ons locally with Docker. The recommended method is to use the [official build tool][hassio-builder] to create the docker images.

Assuming that your addon is in the folder `/path/to/addon` and your docker socket is at `/var/run/docker.sock`, you can build the addon for all supported architectures by running the following:
```
docker run --rm -ti --name hassio-builder --privileged \
  -v /path/to/addon:/data \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  homeassistant/amd64-builder -t /data --all --test \
  -i my-test-addon-{arch} -d local
```

If you don't want to use the official build tool, you can still build with standalone Docker. If you use `FROM $BUILD_FROM` you'll need to set a base image with build args. Normally you can use follow base images:

- armhf: `homeassistant/armhf-base:latest`
- aarch64: `homeassistant/aarch64-base:latest`
- amd64: `homeassistant/amd64-base:latest`
- i386: `homeassistant/i386-base:latest`

Use `docker` from the directory containing the add-on files to build the test addon: 
```
docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" \
  -t local/my-test-addon .
```

[hassio-builder]: https://github.com/home-assistant/hassio-builder

## Local run

If you don't want to use the devcontainer environment, you can still run add-ons locally with Docker.

Create a new folder for data and add a test _options.json_ file. After that you can run your add-on with: 
```
docker run --rm -v /tmp/my_test_data:/data -p PORT_STUFF_IF_NEEDED \
  local/my-test-addon
```

## Logs

All stdout and stderr are redirected to the Docker logs. The logs can be fetched from the add-on page inside the Hass.io panel in Home Assistant.
