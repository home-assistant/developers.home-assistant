---
title: "Frontend development"
sidebar_label: "Development"
---

```mdx-code-block
import {useState} from 'react';

export const RepositoryOpener = () => {
  const [value, setValue] = useState(0);
  const repoUrl = `vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=${encodeURIComponent(value)}`;
  return <div>
    <input onInput={(ev) => setValue(ev.target.value)} style={{width: "80%", display: "inline-block", marginRight: 16}} />
    <a href={repoUrl}><button style={{cursor: value == "" ? "default" : "pointer"}} disabled={value == ""}>Open</button></a>
  </div>
}
```

The Home Assistant frontend is built using web components. For more background about our technology choices, [see this blog post](https://developers.home-assistant.io/blog/2019/05/22/internet-of-things-and-the-modern-web.html).

:::caution
Do not use development mode in production. Home Assistant uses aggressive caching to improve the mobile experience. This is disabled during development so that you do not have to restart the server in between changes.
:::

## Setup with Visual Studio Code + devcontainer

The easiest way to get started with development is to use Visual Studio Code with devcontainers. This approach will create a preconfigured development environment with all the tools you need. This approach is enabled for all Home Assistant repositories. [Learn more about devcontainers.](https://code.visualstudio.com/docs/remote/containers)

**Prerequisites**

- [Docker](https://docs.docker.com/get-docker/)
- [Visual Studio code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

**Getting started:**

1. Go to [Home Assistant frontend repository][hass-frontend] and click "fork".
2. Once your fork is created, copy the URL of your fork and paste it below, then click "Open":
   <RepositoryOpener />
3. Your browser will prompt you if you want to use Visual Studio Code to open the link, click "Open Link".
4. When Visual Studio Code asks if you want to install the Remote extension, click "Install".
5. The Dev Container image will then be built (this may take a few minutes), after this your development environment will be ready.

   In the future, if you want to get back to your development environment: open Visual Studio Code, click on the "Remote Explorer" button in the sidebar, select "Containers" at the top of the sidebar.

**Configuring Home Assistant**

1. Follow the [instructions for setting up a Home Assistant devcontainer](https://developers.home-assistant.io/docs/development_environment#developing-with-visual-studio-code--devcontainer)
2. Mount the `frontend` directory into the Core devcontainer by adding the following section to `.devcontainer/devcontainer.json` file in the `core` repository.

   ```json
   "mounts": [
     "source=/path/to/hass/frontend,target=/workspaces/frontend,type=bind,consistency=cached"
   ]
   ```
   
   *Make sure that you exclude the change to `.devcontainer/devcontainer.json` from any PRs as it points to local `frontend` repository path.*
3. Rebuild the Core devcontainer by running the `Dev Containers: Rebuild Container` command in Visual Studio Code to pickup the new `mounts` configuration if you used it before making the change.
4. Update the Home Assistant configuration to point to the mounted `frontend` path.

   ```yaml
   frontend:
     development_repo: /workspaces/frontend/
   ```

## Setup Manually

**Getting Started:**

1. Fork and clone the [Home Assistant frontend repository][hass-frontend].
2. Install Node.js
   
   The preferred method is using [nvm](https://github.com/creationix/nvm).  Follow the [nvm installation instructions](https://github.com/creationix/nvm#install-script) and then use it to install Node.js by runnig 

   ```shell
   nvm install
   nvm use
   ```
   
   This installs the version of Node.js defined in the `.nvmrc` file and then sets it as the current active version.
   
   If you're running on Windows, you will need to use an alternative version of nvm like [nvm-windows](https://github.com/coreybutler/nvm-windows).  This version of nvm doesn't automatically pickup `.nvmrc` so you'll need to manually select the correct version.
3. Install [Yarn](https://yarnpkg.com/en/), the package manager used by the frontend, using the [installation instructions](https://yarnpkg.com/en/docs/install)
4. Install all of the development dependencies by running:

   ```shell
   script/bootstrap
   ```

**Configuring Home Assistant:**

*These instructions assume that you are also [manually running Home Assistant](https://developers.home-assistant.io/docs/development_environment#manual-environment)*

Update the `frontend` configuration section in your `configuration.yaml` to point to the path of the `frontend` repository you cloned

```yaml
frontend:
  # Example absolute path: /home/paulus/dev/hass/frontend
  development_repo: /path/to/hass/frontend/
```

## Development

Whenever you make changes to files during development, you need to rebuild the development environment so that the Home Assistant instance will pickup the changes.  The `script/develop` script will monitor and auto-update the build whenever anything changes.

```shell
script/develop
```

Many files will be cached by your web browser so you should disable caching to avoid stale content:

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
pip3 install -e /path/to/hass/frontend/
hass --skip-pip-packages home-assistant-frontend
```

[hass-frontend]: https://github.com/home-assistant/frontend
[hass-core]: https://github.com/home-assistant/core
