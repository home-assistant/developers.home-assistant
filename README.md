[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

# Home Assistant Development Documentation

This is the source for the [Home Assistant Development documentation](https://developers.home-assistant.io).

## Updating the docs

Documentation is built using [Docusaurus](https://docusaurus.io/).

## Editing on GitHub

Small changes to text can be made directly on GitHub. At the bottom of each page there is an "Edit This Page" link which will load the document in GitHub ready for changes. This method doesn't easily allow for additional documents or images to be added.

### Preparing a local environment

There are two options for developing the documentation on a local system.

#### Visual Studio Code and devcontainer

The easiest way to get started with development is to use Visual Studio Code with devcontainers. This approach will create a preconfigured development environment with all the tools you need. This approach is enabled for all Home Assistant repositories.

##### Prerequisites

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Docker
  - For Linux, macOS, or Windows 10 Pro/Enterprise/Education use the [current release version of Docker](https://docs.docker.com/get-docker/)
  - Windows 10 Home requires [WSL 2](https://learn.microsoft.com/windows/wsl/install) and the current Edge version of Docker Desktop (see instructions [here](https://docs.docker.com/desktop/windows/wsl/)). This can also be used for Windows Pro/Enterprise/Education.
- [Visual Studio code](https://code.visualstudio.com/)
- [Remote - Containers (VSC Extension)][extension-link]

[More info about requirements and devcontainer in general](https://code.visualstudio.com/docs/devcontainers/containers#_getting-started)

[extension-link]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

##### Getting started

1. Fork the repository.
2. Clone the repository to your computer.
3. Open the repository using Visual Studio code.

When you open this repository with Visual Studio code you are asked to "Reopen in Container", this will start the build of the container.

_If you don't see this notification, open the command palette and select `Remote-Containers: Reopen Folder in Container`._

##### Tasks

The devcontainter comes with some useful tasks to help you with development, you can start these tasks by opening the command palette and select `Tasks: Run Task` then select the task you want to run.

When a task is currently running (like `Preview` for the docs), it can be restarted by opening the command palette and selecting `Tasks: Restart Running Task`, then select the task you want to restart.

When using devcontainers and starting a preview via `yarn start`, `script/setup` or the Task in Code, a browser window will not be opened automatically, instead you will need to open a browser window to [localhost:3000](http://localhost:3000). If port 3000 was already in use, Docusaurus will use the next available port. You can check the port used in the terminal window of Visual Studio Code. Look for the line `Project is running at http://0.0.0.0:XXXX/` where `XXXX` 3000 or greater, open a browser window to `<http://localhost:XXXX>`.

#### Setting Up Your Own Environment

Running the documentation locally requires [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) to be installed. Inside a cloned fork of this repository, run:

```bash
$ script/setup
```

Or in Windows, just run:

```bash
yarn
```

This will install [docusaurus](https://github.com/facebook/docusaurus#readme) amongst other things.

##### Running docs locally

```bash
$ script/server
```

In Windows, just run

```bash
yarn start
```

It will start a server at [localhost:3000](http://localhost:3000).

### Adding a page

- Create new page in `docs/`
- Add new doc to `sidebars.js`
