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

While the system is Linux and compatible with Mac, it is also possible to build and test locally on Windows using WSL2 with Debian and other similar distros. This is achieved via Windows Subsystem for Linux 2 (WSL2), which makes POSIX tasks possible within Windows via system-level integration with a Linux virtual machine.
:::tip
You must use WSL2. WSL version 1 is not capable of running docker and therefore is incompatible. If using this method, you must ensure you have [set up WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
:::

It is assumed at this point you have installed Debian from the Microsoft Store and [Visual Studio Code](https://code.visualstudio.com/download). From within your WSL2-enabled Debian terminal, run the following annotated bash script, line-by-line.  If you copy the entire script it will perform the required setup of Debian for Home Assitant development.

```bash
sudo bash << EOF
set -e #Stop on any error to make it easier to figure out what went wrong
apt update; apt install -y curl wget git gnupg; #Update and install our dependencies
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash; #Install NVM
source ~/.profile; nvm install node; #reload profile and install node
sudo apt remove cmdtest yarn  #Remove problematic packages if installed. Debian current Yarn does not work.
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -  #Add yarn repo certificate
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list #Add Yarn repo
sudo apt update; sudo apt install yarn -y; #Install yarn
curl -fsSL https://get.docker.com |sudo bash  #install docker Community Edition
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy #Fix IP Tables for Docker
git clone https://github.com/home-assistant/supervisor /home/$USER/supervisor #Clone Supervisor to ~/supervisor
chown $USER:$USER /home/$USER/supervisor
usermod -aG docker $USER
systemctl enable docker.service
service docker start
sleep 5
service docker status
EOF

```

Restart your Debian terminal to activate the new profiles and software configurations. 

:::tip
If a problem occurs with an automated script, always run it line by line to figure out where the problem lies.  In this case, skip the first line to directly execute each command.  If you need to completely start over, you can uninstall the Debian app, then from the Windows command prompt execute `del %HOMEPATH%\AppData\Roaming\Code`. After removing your VSCode settings, launch VS Code, and remove all extensions.  Finally reboot your computer and try again. 
:::

Now you're ready to run Yarn and Node. We must set up Docker communications and launch Visual Studio Code. The following commands will need to be run after each reboot to link Docker to your WSL instance and launch Visual Studio Code.
```bash
sudo mkdir /sys/fs/cgroup/systemd
sudo mount -t cgroup -o none,name=systemd cgroup /sys/fs/cgroup/systemd
sudo service docker start
code
```
Visual Studio Code will launch.  If the `code` command does not launch Visual Studio Code, relaunch the Debian terminal, or reboot your computer.

1. Click the Extensions icon on the left -> search -> type "remote" then install "Remote - WSL", and "Remote - Containers"
2. Close Visual Studio Code and reopen with `code` command from Debian.
3. Observe "WSL: Debian" in the lower left corner.  If you do not see "WSL", then close folders and Debian, then relaunch Debian and re-run `code`.  if this problem persists, click the green "open a remote window" button in the lower left -> Remote WSL: New Window Using Distro -> Debian.
4. Click File->Open Folder-> type `~/supervisor`
5. Visual Studio Code will offer to reopen in Dev Container after it has loaded Supervisor. When offered Dev Container in the lower right corner, click to open dev container.  If you were not presented this option, verify extensions are installed then close Visual Studio Code and reopen with the `code` command in Debian. 
:::note
When working in Dev Container, you will see "Dev Container: Supervisor dev" in the lower left corner of Visual Studio Code. 
:::
7. Press F1, select Tasks: Run Task, and Update Supervisor Panel 
8. Within the Dev Container enabled Visual Studio Code, select menu option Terminal->New Terminal, then run the command `sudo update-alternatives --set iptables /usr/sbin/iptables-legacy; sudo dockerd` to start the docker daemon within the Dev Container. 
9. Press F1, select Tasks: Run Task, and Run Supervisor.
10. Open Home Assistant Observer at [http://localhost:4357/](http://localhost:4357/) to monitor the startup process after the Supervisor container is started.
11. Open Home Assistant at [http://localhost:9123/](http://localhost:9123/) to begin testing of Home Assistant and the Supervisor.

At this point, you can press F5 to begin debugging. Try setting a line break within `supervisor/addons/utils.py` and then visit Home Assistant Supervisor Addon Store pages to verify proper operation.  

:::info
If you chose to place your source outside of WSL within Windows, be aware that you cannot open it with the File Chooser without sacrificing your dev container.  In order to access a windows folder, you must type a folder name using this format `/mnt/<drive>/path-to/project`. eg. `C:\Users\example\project` becomes `/mnt/c/Users/example/project`.
:::

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
