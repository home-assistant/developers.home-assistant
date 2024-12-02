---
title: "Frontend development"
sidebar_label: "Development"
---

The Home Assistant frontend is built using web components. For more background about our technology choices, [see this blog post](https://developers.home-assistant.io/blog/2019/05/22/internet-of-things-and-the-modern-web.html).

:::caution
Do not use development mode in production. Home Assistant uses aggressive caching to improve the mobile experience. This is disabled during development so that you do not have to restart the server in between changes.
:::

## Setting up the environment

### Getting the code

The first step is to fork the [frontend repository][hass-frontend] and add the upstream remote. You can place the forked repository anywhere on your system.

```shell
git clone git@github.com:YOUR_GIT_USERNAME/frontend.git
cd frontend
git remote add upstream https://github.com/home-assistant/frontend.git
```

### Configuring Home Assistant

You will need to have an instance of Home Assistant set up. See our guide on [setting up a development environment](/development_environment.mdx).

There are two ways to test the frontend. You either configure Home Assistant to use another frontend. Or you configure the frontend to connect to an existing Home Assistant instance. The first option is how it will work in production. The second allows running a development frontend against an existing Home Assistant without modifying it. However the downside is that not everything can be tested this way. For example, the login page will always be the one built-in into your Home Assistant.

#### 1. Configuring Home Assistant to use a development frontend

To configure Home Assistant to use the development mode for the frontend, update the frontend config in your `configuration.yaml` and set the path to the frontend repository that you cloned in the last step:

```yaml
frontend:
  # Example absolute path: /home/paulus/dev/hass/frontend
  development_repo: /path/to/hass/frontend/
```

If you are using Visual Studio Code with devcontainers for Home Assistant, you need to mount the `frontend` directory into the container. Add the following section to `.devcontainer/devcontainer.json`:

```json
"mounts": [
  "source=/path/to/hass/frontend,target=/workspaces/frontend,type=bind,consistency=cached"
]
```

The Home Assistant's devcontainer needs to get rebuilt via the `Dev Containers: Rebuild Container` with: Shift+Command+P(Mac) / Ctrl+Shift+P (Windows/Linux). The `configuration.yaml` should point to the path inside the container:

```yaml
frontend:
  development_repo: /workspaces/frontend/
```

:::caution
The change to `.devcontainer/devcontainer.json` should be excluded from any PR as it contains your local path to the `frontend` repository. Since the the settings in `.devcontainer/devcontainer.json` are only processed during the container rebuild, you can safely roll back the change after the rebuild has completed.
:::

#### 2. Configuring development frontend to use an existing Home Assistant

If you setup your frontend development environment so that you can run the `script/develop` script as described in section [Development](#development). You can use the following command as a replacement to develop and run the frontend on http://localhost:8124 and it will connect to the Home Assistant running on http://localhost:8123. Note that if you are running this command from a devcontainer, the url should be accessed from the container host.

```shell
script/develop_and_serve
```

You can change the Home Assistant url the frontend connects to by passing the -c option. This will also work for existing production core instances. It does not need to be a development version hosted locally. However, if you change the value for this option you will need to logout from your development frontend before it actually switches to the new value. For example:

```shell
script/develop_and_serve -c https://myhost.duckdns.org:8123
```

You can change the port the frontend is served on by passing the -p option. Note that if you are running from a devcontainer, you will need to setup
port forwarding as well if you want to access it from the container host. For example:

```shell
script/develop_and_serve -p 8654
```

### Installing Node.js

Node.js is required to build the frontend. The preferred method of installing node.js is with [nvm](https://github.com/nvm-sh/nvm). Install nvm using the instructions in the [README](https://github.com/nvm-sh/nvm#install--update-script), and install the correct node.js by running the following command:

```shell
nvm install
```

[Yarn](https://yarnpkg.com/en/) is used as the package manager for node modules. [Install yarn using the instructions here.](https://yarnpkg.com/getting-started/install)

Next, development dependencies need to be installed to bootstrap the frontend development environment. First activate the right Node version and then download all the dependencies:

```shell
nvm use
script/bootstrap
script/setup_translations
```

## Development

During development, you will need to run the development script to maintain a development build of the frontend that auto updates when you change any of the source files. To run this server, run:

```shell
nvm use
script/develop
```

Make sure you have cache disabled and correct settings to avoid stale content:

:::info
Instructions are for Google Chrome
:::

1. Disable cache by ticking the box in `Network` > `Disable cache`

<p class='img'>
  <img src='/img/en/development/disable-cache.png' />
</p>

2. Enable Bypass for network in `Application` > `Service Workers` > `Bypass for network`

<p class='img'>
  <img src='/img/en/development/bypass-for-network.png' />
</p>

## Creating pull requests

If you're planning on issuing a PR back to the Home Assistant codebase you need to fork the frontend project and add your fork as a remote to the Home Assistant frontend repo.

```shell
git remote add fork <github URL to your fork>
```

When you've made your changes and are ready to push them change to the working directory for the frontend project and then push your changes

```bash
git add -A
git commit -m "Added new feature X"
git push -u fork HEAD
```

## Building the frontend

If you're making changes to the way the frontend is packaged, it might be necessary to try out a new packaged build of the frontend in the main repository (instead of pointing it at the frontend repo). To do so, first build a production version of the frontend by running `script/build_frontend`.

To test it out inside Home Assistant, run the following command from the main Home Assistant repository:

```shell
pip3 install -e /path/to/hass/frontend/ --config-settings editable_mode=compat
hass --skip-pip-packages home-assistant-frontend
```

[hass-frontend]: https://github.com/home-assistant/frontend
