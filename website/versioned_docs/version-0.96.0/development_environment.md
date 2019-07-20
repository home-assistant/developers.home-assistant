---
title: Set up Development Environment
id: version-0.96.0-development_environment
original_id: development_environment
---

You'll need to set up a development environment if you want to develop a new feature or component for Home Assistant. Read on to learn how to set up.

## Preparing your environment

### Developing on Linux

Install the core dependencies.

```bash
$ sudo apt-get install python3-pip python3-dev python3-venv
```

In order to run `script/setup` below you will need some more dependencies.

```bash
$ sudo apt-get install autoconf libssl-dev libxml2-dev libxslt1-dev libjpeg-dev libffi-dev libudev-dev zlib1g-dev
$ sudo apt-get install -y libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libavresample-dev libavfilter-dev
```

> Different distributions have different package installation mechanisms and sometimes packages names as well. For example CentOS would use: `sudo yum install epel-release && sudo yum install python36 python36-devel mysql-devel gcc`

Additional dependencies exist if you plan to perform Frontend Development, please read the [Frontend](frontend_index.md) section to learn more.

### Developing on Windows

Due to Home Assistant is mainly designed and developed on Linux distributions, on Windows 10 you can setup a [Linux subsystem](https://docs.microsoft.com/windows/wsl/install-win10).

Open Powershell as an Administrator and run

```bash
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

From Windows Store install Ubuntu.

When the Linux subsystem is set up, perform install as for Linux.

```bash
$ sudo apt-get update
$ sudo apt-get install python3-pip python3-dev python3-venv
$ sudo apt-get install autoconf libssl-dev libxml2-dev libxslt1-dev libjpeg-dev libffi-dev libudev-dev zlib1g-dev
$ sudo apt-get install -y libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libavresample-dev libavfilter-dev
```

Hint: Git is included in Linux subsytem.

When invoking your installation (see below), make sure to specify a folder for configuration which is accessible from Windows.

```bash
$ mkdir -p ../config
$ hass -c ../config
```

### Developing on macOS

Install [Homebrew](https://brew.sh/), then use that to install Python 3:

```bash
$ brew install python3 autoconf
```

Then install ffmpeg:

```bash
$ brew install ffmpeg
```

### Developing with devcontainer

The devcontainer is a preconfigured development environment with all the tools you need.

**Prerequisites**

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://docs.docker.com/install/)
- [Visual Studio code](https://code.visualstudio.com/)
- [Remote - Containers (VSC Extension)](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

[More info about requirements and devcontainer in general](https://code.visualstudio.com/docs/remote/containers#_getting-started)

**Getting started:**

1. Fork the repository.
1. Clone the repository to your computer.
1. Open the repository using Visual Studio code.

When you open this repository with Visual Studio code you are asked to "Reopen in Container", this will start the build of the container.

_If you don't see this notification, open the command pallet and select `Remote-Containers: Reopen Folder in Container`._

The devcontainter comes with some useful tasks to help you with development, you can start these tasks by opening the command pallet and select `Tasks: Run Task` then select the task you want to run.

Running tasks like `Preview` can be restarted by opening the command pallet and selecting `Tasks: Restart Running Task`, then select the task you want to restart.

## Setup Local Repository

Visit the [Home Assistant repository](https://github.com/home-assistant/home-assistant) and click **Fork**.
Once forked, setup your local copy of the source using the commands:

```bash
$ git clone https://github.com/YOUR_GIT_USERNAME/home-assistant.git
$ cd home-assistant
$ git remote add upstream https://github.com/home-assistant/home-assistant.git
```

## Setting up virtual environment

To isolate your environment from the rest of the system, set up a [`venv`](https://docs.python.org/3/library/venv.html). Within the `home-assistant` directory, create and activate your virtual environment.

```bash
$ python3 -m venv venv
$ source venv/bin/activate
```

Install the requirements with a provided script named `setup`.

```bash
$ script/setup
```

Invoke your installation, adjusting the [configuration](https://www.home-assistant.io/docs/configuration/) if required. 

```bash
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
