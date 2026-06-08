---
title: "Publishing your app"
---

There are two different ways of publishing apps (formerly known as add-ons). One is to publish pre-built containers to a container registry and the other option is to have users build the containers locally on their Home Assistant instance.

## Pre-built containers

With pre-built containers, the developer is responsible for building the images for each architecture and pushing the results to a container registry. This has a lot of advantages for the user who will only have to download the final container and be up and running once the download finishes. This makes the installation process fast and has almost no chance of failure, so it is the preferred method.

We have automated the process of building and publishing apps via GitHub Actions. See below for the instructions.

## Locally built containers

With the Supervisor, it is possible to distribute apps that will be built on the user's machine. The advantage is that for you as a developer it is easy to test an idea and see if people are interested in your apps. This method includes installing and potentially compiling code. This means that installing such an app is slow and adds more wear and tear to users' SD cards/hard drives than the above-mentioned pre-built solution. It also has a higher chance of failure if one of the dependencies of the container has changed or is no longer available.

Use this option when you are playing with apps and seeing if someone is interested in your work. Once you're an established repository, please migrate to pushing builds to a container registry as it greatly improves the user experience. In the future we will mark locally built apps in the app store to warn users.

## Publishing apps to a container registry with GitHub Actions

The recommended way to build and publish multi-architecture app images is through GitHub Actions using the builder composite actions maintained by the Home Assistant project. These actions can be then used for a matrix of builds in an app repository. See the [builder workflow](https://github.com/home-assistant/apps-example/blob/main/.github/workflows/builder.yaml) in the example app repository for a complex example of building multiple apps, or the [example workflow](https://github.com/home-assistant/builder?tab=readme-ov-file#example-workflow) in the builder repository for a single app build. The builder actions are designed to be flexible and can be used in more complex workflows as needed.

### Image naming

Inside your app `config.yaml`, set the `image` field to the image name published in the container registry:

```yaml
image: "ghcr.io/my-org/my-app"
```

The `{arch}` placeholder is still supported for backwards compatibility with per-architecture image publishing. When a multi-arch manifest is available, the generic name is the preferred public reference:

```yaml
# Preferred — resolves via the multi-arch manifest
image: "ghcr.io/my-org/my-app"

# Compatibility fallback — still works if only arch-prefixed images exist
image: "ghcr.io/my-org/{arch}-my-app"
```

### Published images

After a successful run, two types of image references are available:

- **Per-architecture images** (e.g. `ghcr.io/my-org/aarch64-my-app:1.0.0`) — pushed by the `build-image` action.
- **Generic manifest image** (e.g. `ghcr.io/my-org/my-app:1.0.0`) — pushed by the `publish-multi-arch-manifest` action; this is the preferred reference to use in `config.yaml` and to share with users.

### Example app repository

See the [Home Assistant example app repository](https://github.com/home-assistant/apps-example) for a complete, up-to-date working example.
