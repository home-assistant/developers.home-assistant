---
title: "Set up Development Environment"
---

You'll need to set up a development environment if you want to develop a new feature or component for Home Assistant. Read on to learn how to set up.

## Developing with Visual Studio Code + devcontainer

The easiest way to get started with development is to use Visual Studio Code with devcontainers. This approach will create a preconfigured development environment with all the tools you need. This approach is enabled for all Home Assistant repositories.

**Prerequisites**

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Docker
  -  For Linux, macOS, or Windows 10/11 Pro/Enterprise/Education use the [current release version of Docker](https://docs.docker.com/install/)
  -   Windows 10/11 Home requires [WSL 2](https://docs.microsoft.com/windows/wsl/install-win10#update-to-wsl-2) and the current Edge version of Docker Desktop (see instructions [here](https://docs.docker.com/docker-for-windows/wsl-tech-preview/)). This can also be used for Windows Pro/Enterprise/Education.
- [Visual Studio code](https://code.visualstudio.com/)
- [Remote - Containers (VSC Extension)][extension-link]

[More info about requirements and devcontainer in general](https://code.visualstudio.com/docs/remote/containers#_getting-started)

[extension-link]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

**Getting started:**

1. Fork the [Home Assistant core repository](https://github.com/home-assistant/core).
2. Clone the repository to your computer. Windows users need to [place their files within WSL file system](https://code.visualstudio.com/docs/remote/containers#_open-a-wsl-2-folder-in-a-container-on-windows) to prevent performance degradation.
3. Open the repository using Visual Studio code.

When you open this repository with Visual Studio code you are asked to "Reopen in Container", this will start the build of the container.

### Tasks

The devcontainer comes with some useful tasks to help you with development, you can start these tasks by opening the command palette and select `Tasks: Run Task` then select the task you want to run.

When a task is currently running (like `Preview` for the docs), it can be restarted by opening the command palette and selecting `Tasks: Restart Running Task`, then select the task you want to restart.

## Manual Environment

It is also possible to set up a more traditional development environment. See the section for your operating system. Make sure your Python version is 3.8 or later.

### Developing on Linux

Install the core dependencies.

```shell
sudo apt-get update
sudo apt-get install python3-pip python3-dev python3-venv autoconf libssl-dev libxml2-dev libxslt1-dev libjpeg-dev libffi-dev libudev-dev zlib1g-dev pkg-config libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libavresample-dev libavfilter-dev ffmpeg
```

### Developing on Windows

To develop on Windows, you will need to use the Linux subsystem (WSL). Follow the [WSL installation instructions](https://docs.microsoft.com/windows/wsl/install-win10) and install Ubuntu from the Windows Store. Once you're able to access Linux, follow the Linux instructions.

:::tip
If you find that you cannot open the development instance via <http://localhost:8123> when using WSL, instead, within a WSL terminal, find the `inet` address of the `eth0` adaptor by running `ip addr show eth0`. Then use this address, excluding the CIDR block, to access the development instance, i.e. if your `inet` is listed as `172.20.37.6/20`, use <http://172.20.37.6:8123>.
:::

#### Freshly installed WSL distribution

The first time a WSL distribution is started, and the default WSL user account is created, the Windows drives will still be mounted with all files owned by `root:root` instead of owned by the default user, i.e. with `uid=0,gid=0` included in the mount options as shown by:

```bash
user@DESKTOP:/mnt/c/Users/user$ mount | grep mnt
C:\ on /mnt/c type drvfs (rw,noatime,uid=0,gid=0,case=off)
```

This will cause the `setup` script to fail with an unrelated error if the local repository is on a Windows drive. To recover, WSL must be restarted after which the Windows drives will be mounted with all files owned by the default WSL user. This can be accomplished by simply restarting the computer, or by issuing the following command from a windows command prompt:

```bash
wsl --shutdown
```

After WSL is restarted, the mount's uid and gid will match the default user.

### Developing on macOS

Install [Homebrew](https://brew.sh/), then use that to install the dependencies:

```shell
brew install python3 autoconf ffmpeg
```

## Setup Local Repository

Visit the [Home Assistant Core repository](https://github.com/home-assistant/core) and click **Fork**.
Once forked, setup your local copy of the source using the commands:

```shell
git clone https://github.com/YOUR_GIT_USERNAME/core.git
cd core
git remote add upstream https://github.com/home-assistant/core.git
```

Install the requirements with a provided script named `setup`.

```shell
script/setup
```

This will create a virtual environment and install all necessary requirements. You're now set! 

Each time you start a new terminal session, you will need to activate your virtual environment:

```shell
source venv/bin/activate
```

After that you can run Home Assistant like this:

```shell
hass -c config
```

The Home Assistant configuration is stored in the `config` directory in your repository.
