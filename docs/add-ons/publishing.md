---
title: "Publishing your add-on"
---

There are two different ways of publishing add-ons. One is to publish pre-built containers to a container registry and the other option is to have users build the containers locally on their Home Assistant instance.

#### Pre-built containers

With pre-built containers, the developer is responsible for building the images for each architecture on their machine and pushing the results out to a container registry. This has a lot of advantages for the user who will only have to download the final container and be up and running once the download finishes. This makes the installation process fast and has almost no chance of failure so it is the preferred method.

We have automated the process of building and publishing add-ons. See below for the instructions.

#### Locally build containers

With the Supervisor, it is possible to distribute add-ons that will be built on the users machine. The advantage is that as a developer it is easy to test an idea and see if people are interested in your add-ons. This method includes installing and potentially compiling code. This means that installing such an add-on is slow and adds more wear and tear to users SD card/hard drive than the above mentioned pre-built solution. It also has a higher chance of failure if one of the dependencies of the container has changed or is no longer available.

Use this option when you are playing with add-ons and seeing if someone is interested in your work. Once you're an established repository, please migrate to pushing builds to a container registry as it greatly improves the user experience. In the future we will mark locally built add-ons in the add-on store to warn users.

## Build scripts to publish add-ons to a container registry

All add-ons are containers. Inside your add-on `config.yaml` you specify the container image that will be installed for your add-on:

```yaml
...
image: "myhub/image-{arch}-addon-name"
...
```

You can use `{arch}` inside the image name to support multiple architectures with one (1) configuration file. It will be replaced with the architecture of the user when we load the image. If you use `Buildargs` you can use the `build.yaml` to overwrite our default args.

Home Assistant assumes that the default branch of your add-on repository matches the latest tag on the container registry. When you're building a new version, it's suggested that you use another branch, ie `build` or do it with a PR on GitHub. After you push the add-on to a container registry, you can merge this branch to master.

## Custom add-ons

You need a Docker Hub account to make your own add-ons. You can build your container images with the Docker `build` command or use our [builder] to simplify the process. Pull our [Builder Docker engine][builder] and run one of the following commands.

For a git repository:

```shell
docker run \
  --rm \
  --privileged \
  -v ~/.docker/config.json:/root/.docker/config.json:ro \
  ghcr.io/home-assistant/amd64-builder \
  --all \
  -t addon-folder \
  -r https://github.com/xy/addons \
  -b branchname
```

For a local repository:

```shell
docker run \
  --rm \
  --privileged \
  -v ~/.docker/config.json:/root/.docker/config.json:ro \
  -v /my_addon:/data \
  ghcr.io/home-assistant/amd64-builder \
  --all \
  -t /data
```

:::tip
If you are developing on macOS and using Docker for Mac, you may encounter an error message similar to the following: `error creating aufs mount to /var/lib/docker/aufs/mnt/<SOME_ID>-init: invalid argument`. A proposed workaround is to add the following to the Advanced Daemon JSON configuration via Docker > Preferences > Daemon > Advanced: `"storage-driver" : "aufs"` or map the docker socket into container.
:::

[builder]: https://github.com/home-assistant/builder
