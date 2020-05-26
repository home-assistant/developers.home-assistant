---
title: "Set up Development Environment"
---

You'll need to set up a development environment if you want to develop a new feature or component for Home Assistant. Read on to learn how to set up.

## Developing with Visual Studio Code + devcontainer

The easiest way to get started with development is to use Visual Studio Code with devcontainers. This approach will create a preconfigured development environment with all the tools you need. This approach is enabled for all Home Assistant repositories.

**Prerequisites**

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Docker
  -  For Linux, macOS, or Windows 10 Pro/Enterprise/Education use the [current release version of Docker](https://docs.docker.com/install/)
  -   Windows 10 Home requires [WSL 2](https://docs.microsoft.com/windows/wsl/install-win10#update-to-wsl-2) and the current Edge version of Docker Desktop (see instructions [here](https://docs.docker.com/docker-for-windows/wsl-tech-preview/)). This can also be used for Windows Pro/Enterprise/Education.
- [Visual Studio code](https://code.visualstudio.com/)
- [Remote - Containers (VSC Extension)][extension-link]

[More info about requirements and devcontainer in general](https://code.visualstudio.com/docs/remote/containers#_getting-started)

[extension-link]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

**Getting started:**

1. Fork the repository.
2. Clone the repository to your computer.
3. Open the repository using Visual Studio code.

When you open this repository with Visual Studio code you are asked to "Reopen in Container", this will start the build of the container.

_If you don't see this notification, open the command palette and select `Remote-Containers: Reopen Folder in Container`._

### Tasks

The devcontainter comes with some useful tasks to help you with development, you can start these tasks by opening the command palette and select `Tasks: Run Task` then select the task you want to run.

When a task is currently running (like `Preview` for the docs), it can be restarted by opening the command palette and selecting `Tasks: Restart Running Task`, then select the task you want to restart.

## Preparing Your environment

It is also possible to set up a more traditional development environment. See the section for your operating system. Make sure your Python version is 3.7 or later.

### Developing on Linux

Install the core dependencies.

```shell
$ sudo apt-get install python3-pip python3-dev python3-venv
```

In order to run `script/setup` below you will need some more dependencies.

```shell
$ sudo apt-get install autoconf libssl-dev libxml2-dev libxslt1-dev libjpeg-dev libffi-dev libudev-dev zlib1g-dev pkg-config
$ sudo apt-get install -y libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libavresample-dev libavfilter-dev
```

:::tip
 Different distributions have different package installation mechanisms and sometimes packages names as well. For example CentOS would use: `sudo yum install epel-release && sudo yum install python36 python36-devel mysql-devel gcc`
:::

Additional dependencies exist if you plan to perform Frontend Development, please read the [Frontend](/docs/frontend.html) section to learn more.

### Developing on Windows

Since Home Assistant is mainly designed and developed on Linux distributions, on Windows 10 you can setup a [Linux subsystem](https://docs.microsoft.com/windows/wsl/install-win10).

Open Powershell as an Administrator and run

```shell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

From Windows Store install Ubuntu.

When the Linux subsystem is set up, perform install as for Linux.

```shell
$ sudo apt-get update
$ sudo apt-get install python3-pip python3-dev python3-venv python-wheel-common
$ sudo apt-get install autoconf libssl-dev libxml2-dev libxslt1-dev libjpeg-dev libffi-dev libudev-dev zlib1g-dev
$ sudo apt-get install -y libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libavresample-dev libavfilter-dev
```

Hint: Git is included in Linux subsytem.

When invoking your installation (see below), make sure to specify a folder for configuration which is accessible from Windows.

```shell
$ mkdir -p ../config
$ hass -c ../config
```

:::tip
You may find that you cannot open the development instance via <http://localhost:8123> when using WSL. Instead, within a WSL terminal, find the `inet` address of the `eth0` adaptor by running `ifconfig`. Then use this address to access the development instance, i.e. <http://172.20.37.6:8123>.
:::

### Developing on macOS

Install [Homebrew](https://brew.sh/), then use that to install Python 3:

```shell
$ brew install python3 autoconf
```

Then install ffmpeg:

```shell
$ brew install ffmpeg
```

## Setup Local Repository

Visit the [Home Assistant Core repository](https://github.com/home-assistant/core) and click **Fork**.
Once forked, setup your local copy of the source using the commands:

_Windows users should be sure to clone to a path that inside the WSL (ex: ~/)._

```shell
$ git clone https://github.com/YOUR_GIT_USERNAME/core.git
$ cd core
$ git remote add upstream https://github.com/home-assistant/core.git
```

Note that `core.git` should be replaced by the name of your fork (default being `core.git`). If unsure check your GitHub repository.

## Setting Up Virtual Environment

To isolate your environment from the rest of the system, set up a [`venv`](https://docs.python.org/3/library/venv.html). Within the `core` directory, create and activate your virtual environment.

```shell
$ python3.7 -m venv venv
$ source venv/bin/activate
```

Install the requirements with a provided script named `setup`.

```shell
$ script/setup
```

Invoke your installation, adjusting the [configuration](https://www.home-assistant.io/docs/configuration/) if required.

```shell
$ hass
```

## Logging

By default logging in Home Assistant is tuned for operating in production (set to INFO by default, with some modules set to even less verbose logging levels).

You can use the [logger](https://www.home-assistant.io/components/logger/) component to adjust logging to DEBUG to see even more details about what is going on:

```yaml
logger:
  default: info
  logs:
    homeassistant.core: debug
    nest.nest: debug
    asyncio: debug
    homeassistant.components.cloud.iot: debug
```
