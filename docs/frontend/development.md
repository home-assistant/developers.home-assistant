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

#### Developing with Visual Studio Code + dev container

If you are using Visual Studio Code with dev containers for Home Assistant Core, you need to mount the frontend repository into the dev container. Add the following section to `.devcontainer/devcontainer.json` in the Home Assistant Core repository:

```json
"mounts": [
  "source=/path/to/hass/frontend,target=/workspaces/frontend,type=bind,consistency=cached"
]
```

Rebuild the dev container by pressing Shift+Command+P (Mac) / Ctrl+Shift+P (Windows/Linux) to open the Command Palette, then selecting the **Dev Containers: Rebuild Container** command.

Edit `config/configuration.yaml` at the root of the Home Assistant Core repository to add this entry:

```yaml
frontend:
  development_repo: /workspaces/frontend
```

:::note
This is the mounted path inside the dev container, see the `target` parameter above. If the `source` path is incorrect, the web frontend won't work.
:::

Run Home Assistant Core from VS Code:
1. Open the Command Palette:
   - Mac: `Shift+Command+P`
   - Windows/Linux: `Ctrl+Shift+P`
2. Select **Tasks: Run Task**
3. Select **Run Home Assistant Core**

:::caution
The change to `.devcontainer/devcontainer.json` should be excluded from any PR as it contains your local path to the `frontend` repository. Since the settings in `.devcontainer/devcontainer.json` are only processed during the container rebuild, you can safely roll back the change after the rebuild has completed.
:::

#### Developing with a manual environment

If you set up the development environment for Home Assistant Core manually, fill in the frontend repository path in `configuration.yaml`:

```yaml
frontend:
  # Example path: /home/paulus/dev/hass/frontend
  development_repo: /path/to/hass/frontend
```

:::tip
The `configuration.yaml` file can be found in the `config` directory at the root of the Home Assistant Core repository. If the path is incorrect or otherwise inaccessible, the web frontend won't work.
:::

### Installing Node.js (manual environment only)

Node.js is required to build the frontend. The preferred method of installing node.js is with [nvm](https://github.com/nvm-sh/nvm). Install nvm using the instructions in the [README](https://github.com/nvm-sh/nvm#install--update-script), and install the correct node.js by running the following command:

```shell
nvm install
```

[Yarn](https://yarnpkg.com/en/) is used as the package manager for node modules. [Install yarn using the instructions here.](https://yarnpkg.com/getting-started/install)

### Install development dependencies and fetch latest translations

Bootstrap the frontend development environment by installing development dependencies and downloading the latest translations.

```shell
nvm use
script/bootstrap
script/setup_translations
```

:::note
This needs to be done manually, even if you are using dev containers. Also, you will be asked to enter a code and authorize the script to fetch the latest translations.
:::

## Development

### Run development server

Run this script to build the frontend and run a development server:

```shell
nvm use
script/develop
```

When the script has completed building the frontend, and Home Assistant Core has been set up correctly, the frontend will be accessible at `http://localhost:8123`. The server will automatically rebuild the frontend when you make changes to the source files.

### Browser settings

Open Google Chrome's Developer tools, and make sure you have cache disabled and correct settings to avoid stale content:

:::info
Instructions are for Google Chrome
:::

1. Disable cache by ticking the box in **Network** > **Disable cache**

<p class='img'>
  <img src='/img/en/development/disable-cache.png' />
</p>

2. Enable Bypass for network in **Application** > **Service Workers** > **Bypass for network**

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
