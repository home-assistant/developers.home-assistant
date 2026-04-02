---
author: Jan Čermák
authorURL: https://github.com/sairon
authorImageURL: https://avatars.githubusercontent.com/u/211416?s=96&v=4
title: "Migrating app builds to Docker BuildKit"
---

The legacy `home-assistant/builder` container and the old `home-assistant/builder` GitHub Action have been retired. We recommend migrating all GitHub workflows and Dockerfiles for apps (formerly add-ons) as described in this post.

## What changed and why

The old builder ran every architecture build inside a single privileged Docker-in-Docker container using QEMU emulation. This was slow, required elevated privileges, and those who were already familiar with Docker needed to learn how to use the custom Home Assistant's builder container. The old builder also had unnecessary maintenance overhead. Today, what the builder does can be fully replaced with Docker BuildKit, which is natively supported on GitHub Actions runners and has built-in multi-arch support with QEMU emulation if needed.

For your CI, the replacement is a set of focused [composite GitHub Actions](https://github.com/home-assistant/builder) that delegate building to the runner's native Docker with Docker BuildKit. Outside the CI, the migration means that your `Dockerfile` is now the single source of truth for building your app image, and you can use `docker build` directly to build and test your app locally without needing to use the builder container.

## Migration process

The migration has two parts: updating your Dockerfiles and updating your GitHub Actions workflows.

### Update Dockerfiles

The new build workflow doesn't use `build.yaml` anymore. Move the content into your `Dockerfile` as follows:

- **`build_from`** - replace the `build_from` key in `build.yaml` with a `FROM` statement in your `Dockerfile`:

  ```dockerfile
  FROM ghcr.io/home-assistant/base:latest
  ```

   As the base images are now published as multi-platform manifests, there is usually no need to define per-arch base images anymore. The `build-image` action still supplies `BUILD_ARCH` as a build argument though, so you can use that in your `Dockerfile` if you need to use it in the template for the base image name.

- **`labels`** - move any custom Docker labels directly into your `Dockerfile` with a `LABEL` statement, with `io.hass.type="addon"` as a minimum to ensure the image is recognized as an app by Supervisor:

  ```dockerfile
  LABEL \
      io.hass.type="addon" \
      org.opencontainers.image.title="Your awesome app" \
      org.opencontainers.image.description="Description of your app." \
      org.opencontainers.image.source="https://github.com/your/repo" \
      org.opencontainers.image.licenses="Apache License 2.0"
    ```

- **`args`** - move custom build arguments into your `Dockerfile` as `ARG` definitions with default values:

  ```dockerfile
  ARG MY_BUILD_ARG="default-value"
  ```

  Default values in `ARG` replace what was previously supplied via `build.yaml`'s `args` dictionary. They can still be overridden at build time with `--build-arg` if needed.

With the content of `build.yaml` migrated, you can delete the file from your repository.

### Update GitHub Actions workflows

Remove any workflow steps using `home-assistant/builder@master` and replace them with the new composite actions. See the [example workflow](https://github.com/home-assistant/apps-example/blob/main/.github/workflows/builder.yaml) in our example app repository for a complete working example. Alternatively, use the [individual actions](https://github.com/home-assistant/builder?tab=readme-ov-file#example-workflow) in a more custom workflow as needed.

If you are creating a custom workflow, note that the legacy builder used to add the `io.hass.type`, `io.hass.name`, `io.hass.description`, and `io.hass.url` labels automatically. The new actions do not infer these values, so add them explicitly via the `labels` input of the `build-image` (or similar) action.

### Image naming

The preferred way to reference a published app image is now the **generic (multi-arch) name** without an architecture prefix:

```yaml
# config.yaml
image: "ghcr.io/my-org/my-app"
```

The `{arch}` placeholder (e.g. `ghcr.io/my-org/{arch}-my-app`) is still supported as a compatibility fallback, but it's encouraged to use the generic name and let the manifest handle the platform resolution.

### Local builds

After updating your `Dockerfile`, you can use `docker build` to build the app image directly - you can refer to [Local app testing](/docs/apps/testing) for more details.

## Apps built locally by Supervisor

For backward compatibility, Supervisor still reads `build.yaml` file if it's present and populates the image build arguments with values read from this file. This will produce warnings and eventually be removed in the future, so it's recommended to migrate to the new Dockerfile-based approach as described above.
