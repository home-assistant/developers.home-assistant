---
title: "Frontend development"
sidebar_label: "Development"
---

The Home Assistant frontend is built using web components and powered by the [Polymer](https://www.polymer-project.org/) framework.

> Do not use development mode in production. Home Assistant uses aggressive caching to improve the mobile experience. This is disabled during development so that you do not have to restart the server in between changes.

## Setting up the environment

> All commands below need to be run from inside the home-assistant-polymer repository.

### Getting the code

First step is to fork the [home-assistant-polymer repository](https://github.com/home-assistant/home-assistant-polymer) and add the upstream remote. You can place the forked repository anywhere on your system.

```bash
$ git clone git@github.com:YOUR_GIT_USERNAME/home-assistant-polymer.git
$ cd home-assistant-polymer
$ git remote add upstream https://github.com/home-assistant/home-assistant-polymer.git
```

### Configuring Home Assistant

You will need to have an instance of Home Assistant set up. See our guide on [setting up a development environment](https://developers.home-assistant.io/docs/en/development_environment.html).

Next step is to configure Home Assistant to use the development mode for the frontend. Do this by updating the frontend config in your `configuration.yaml` and set the path to the home-assistant-polymer repository that you cloned in the last step:

```yaml
frontend:
  # Example absolute path: /home/paulus/dev/hass/home-assistant-polymer
  development_repo: <absolute path to home-assistant-polymer repo>
```

### Installing Node.js

Node.js is required to build the frontend. The preferred method of installing node.js is with [nvm](https://github.com/creationix/nvm). Install nvm using the instructions in the [README](https://github.com/creationix/nvm#install-script), and install the correct node.js by running the following command:

```bash
$ nvm install
```

[Yarn](https://yarnpkg.com/en/) is used as the package manager for node modules. [Install yarn using the instructions here.](https://yarnpkg.com/en/docs/install)

Next, development dependencies need to be installed to bootstrap the frontend development environment. First activate the right Node version and then download all the dependencies:

```bash
$ nvm use
$ script/bootstrap
```

## Development

During development, you will need to run the development script to maintain a development build of the frontend that auto updates when you change any of the source files. To run this server, run:

```bash
$ nvm use
$ script/develop
```

Make sure you have cache disabled and correct settings to avoid stale content:

> Instructions are for Google Chrome

1. Disable cache by ticking the box in `Network` > `Disable cache`

<p class='img'>
<img src='/img/en/development/disable-cache.png' />
</p>

2. Enable Bypass for network in `Application` > `Service Workers` > `Bypass for network`

<p class='img'>
<img src='/img/en/development/bypass-for-network.png' />
</p>

## Creating pull requests

If you're planning on issuing a PR back to the Home Assistant codebase you need to fork the polymer project and add your fork as a remote to the Home Assistant Polymer repo.

```bash
$ git remote add fork <github URL to your fork>
```

When you've made your changes and are ready to push them change to the working directory for the polymer project and then push your changes

```bash
$ git add -A
$ git commit -m "Added new feature X"
$ git push -u fork HEAD
```

## Building the Polymer frontend

If you're making changes to the way the frontend is packaged, it might be necessary to try out a new packaged build of the frontend in the main repository (instead of pointing it at the frontend repo). To do so, first build a production version of the frontend by running `script/build_frontend`.

To test it out inside Home assistant, run the following command from the main Home Assistant repository:

```bash
$ pip3 install -e /path/to/home-assistant-polymer/
$ hass --skip-pip
```