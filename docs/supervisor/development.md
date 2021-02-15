---
title: "Supervisor Development"
sidebar_label: "Development"
---

These instructions are for development of the Supervisor, the Supervisor frontend panel and the `hassio` integration, by interacting with a development or remote supervisor, this assumes that you are using a development machine to do the development, these instructions will also use devcontainer and other tools that rely on Docker, so if you don't have that setup yet, do that before you continue.

## Supervisor development

The instructions here is for development of the Supervisor itself.

1. Fork the Supervisor repo (https://github.com/home-assistant/supervisor) and clone it to your development machine.
2. Open the repo with Visual Studio Code devcontainer.
3. Create a branch in your fork.
4. Do your changes.
5. Test your changes with the instructions below.
6. Commit and push your changes, and create a PR against the `main` branch at https://github.com/home-assistant/supervisor

### Local testing

Start the task "Run Supervisor" in Visual Studio Code, this will start a instance of the Supervisor inside the devcontainer you can use to test your changes.
When the initializing is complete you can access the Home Assistant frontend on `http://localhost:9123`

If you need to rebuild the base of the Supervisor run the task "Build Supervisor" and then restart the "Run Supervisor" task again when that completes.

#### Using Windows WSL2

While the system is Linux and compatible with Mac, it is also possible to build and test locally on Windows using WSL2 with Ubuntu 20.04 LTS and other similar distros. This is achieved via WSL2, which makes POSIX tasks possible within Windows via system-level integration with a Linux virtual machine.
:::info
You must use WSL2. WSL is not capable of running docker, and therefore is incompatibile.  If using this WSL method, you must ensure you [set up WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
:::

From within your WSL2-enabled Ubuntu-20.04 terminal, install Docker.io package. 
```bash
sudo apt-get install docker.io
```

Setting up a control group, and mounting the control group to a location that can be accessed via Linux. The final command will set up and launch Visual Studio Code within Windows, with WSL2-enabled compatibility, thus enabling Supervisor development on Windows.

```bash
sudo mkdir /sys/fs/cgroup/systemd
sudo mount -t cgroup -o none,name=systemd cgroup /sys/fs/cgroup/systemd
code
```

You can now open your project as usual, or use the `/mnt/c/<path-to-your-project>` format, replacing `<path-to-your-project>` with the full path to your project, after removing `C:\`.  eg. `C:\Users\example\project` becomes `/mnt/c/example/project`.

### Testing on a remote system

For this you first need to create an account at [Docker Hub](https://hub.docker.com/).

1. Access the remote system with SSH or with direct console access.
2. Check the architecture on the machine with `ha info` or just `info` if it's Home Assistant OS.
3. On your development machine use our [builder](https://github.com/home-assistant/builder) to build and publish your Supervisor image.

Example:

:::note

All examples will have values you need to adjust.

- Adjust `aarch64` with the architecture you found in step 2.
- Adjust `awesome-user` to match your Docker Hub username.
- Adjust `secret-password` to match your Docker Hub password or publish token.

:::

```bash
docker run --rm \
    --privileged \
    -v /run/docker.sock:/run/docker.sock \
    -v "$(pwd):/data" \
    homeassistant/amd64-builder:dev \
        --generic latest \
        --target /data \
        --aarch64 \
        --docker-hub awesome-user \
        --docker-user awesome-user \
        --docker-password secret-password \
        --no-cache
```

4. On your remote system change the channel to `dev` with `ha supervisor --channel dev` or just `supervisor --channel dev` if it's Home Assistant OS.
5. Pull down your Supervisor image with  `docker pull awesome-user/aarch64-hassio-supervisor:latest`
6. Tag your Supervisor image as `homeassistant/aarch64-hassio-supervisor:latest`

```bash
docker tag awesome-user/aarch64-hassio-supervisor:latest homeassistant/aarch64-hassio-supervisor:latest
```

7. Restart the `hassio-supervisor` service with  `systemctl restart hassos-supervisor`
8. Check for issues with `journalctl -fu hassos-supervisor`

## Integration development

The instructions here is for development of the `hassio` integration, we're going to assume that you have a [Home Assistant Core development environment](development_environment.md) set up, and that you have [Supervisor API Access](#supervisor-api-access) set up.

To configure Home Assistant Core to connect to a remote supervisor, set the following environment variables when starting Home Assistant:

- `HASSIO`: Set to the IP of the machine running Home Assistant and port 80 (the API proxy add-on)
- `HASSIO_TOKEN`: Set this to the token that you found [Supervisor API Access](#supervisor-api-access)

```shell
HASSIO=192.168.1.100:80 HASSIO_TOKEN=abcdefghj1234 hass
```

Your local Home Assistant installation will now connect to a remote Home Assistant instance.

## Frontend development

The instructions here is for development of the Supervisor panel, we're going to assume that you have a [Home Assistant frontend development environment](/frontend/development.md) set up with the devcontainer, and that you have [Supervisor API Access](#supervisor-api-access) set up.

1. Run the "Develop Supervisor panel" task
2. Run the task "Run HA Core for Supervisor in devcontainer"
3. When asked for the IP, use the IP of the host that is running [Supervisor API Access](#supervisor-api-access)
4. When asked for the token, use the token you found [Supervisor API Access](#supervisor-api-access)

### Without frontend devcontainer

Update the `hassio` integration configuration in your `configuration.yaml` file to point at the frontend repository:

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

While `script/develop` is running, the Supervisor panel will be rebuilt whenever you make changes to the source files.

## Supervisor API Access

To develop for the `hassio` integration and the Supervisor panel, we're going to need API access to the supervisor. This API is protected by a token that we can extract using a special add-on. This can be done on a running system or with the [devcontainer](#local-testing).

1. Add our developer Add-on repository: <https://github.com/home-assistant/hassio-addons-development>
2. Install the Add-on "Remote API proxy"
3. Click Start
4. The token will be printed in the logs

The add-on needs to keep running to allow Home Assistant Core to connect.

The Remote API proxy token has slightly less privileges than Home Assistant Core has in production. To get the actual token with full privileges, you need to SSH into the host system and run:

```shell
docker inspect homeassistant | grep SUPERVISOR_TOKEN
```

Note that either token can change after a reboot or update of OS/container.
