---
author: Joakim Sørensen
authorURL: https://github.com/ludeeus
authorTwitter: ludeeus
title: "Calling all add-on developers!"
---

## Documentation

First off, our [API documentation][api_docs] has been moved to the developer documentation site, during this move it also got a style update to make it easier to navigate. Some of the endpoints are still missing some content, if you have not yet met your quota for [Hacktoberfest] maybe you want to contribute some more details to our API descriptions?

## API Changes

- Using the `/homeassistant/*` endpoints is deprecated, and will be removed later this year. You need to use `/core/*` instead.
- Using `http://hassio/` is deprecated, and will be removed later this year. You need to use `http://supervisor/` instead.
- Using `HASSIO_TOKEN` is deprecated, and will be removed later this year. You need to use `SUPERVISOR_TOKEN` instead.
- Deleting snapshots with `GET` calling `/supervisor/snapshots/<slug>/delete` is deprecated, and will be removed later this year. You need to use the `DELETE` method when calling `/supervisor/snapshots/<slug>` instead.
- Using `X-Hassio-Key` header as authentication method is deprecated, and will be removed later this year. You need use an authorization header with a `Bearer` token instead.

The [API documentation][api_docs] have been updated to reflect these changes.

## Add-on options

The permissions of the `/data/options.json` file, was change from `644` to `600`. If your add-on is running as non-root and you are reading this file, it will give now you permission issues.

There are several steps you can do in your add-on to continue to use this information:

- If you are using [S6-overlay] in your add-on, you can use [`/etc/fix-attrs.d`][S6-overlay-permissions] to ensure that the user you are running the add-on as, have access to the file.
- You can change your add-on to run as `root` (default)

## Releases

Until now, the Supervisor, our plugins and add-ons have been using a mix of the build number and [Semantic Versioning (SemVer)][semver] as the versioning system, we have decided to replace that for these repositories and to adopt [Calendar Versioning (CalVer)][calver] as our versioning system instead.

Just like the [Home Assistant core][ha_core] and the [Home Assistant OS][haos], the Supervisor also have three different channels (stable, beta and dev). We are now leveraging automated pipelines, to build and push out new Supervisor versions to the correct channels. By moving to this structure there was no more need to a dual branch setup, so both our `dev` and `master` branches have now been replaced with a new `main` branch.

With this new workflow, when a pull request is merged to the `main` branch, a new version of the Supervisor is built and made available to the dev channel. When a new release is created on GitHub a new version of the Supervisor is built and made available to the dev channel. Updates to the stable channel is not automated, when we feel a version has been tested long enough in both the dev and beta channels, we make that version available to the stable channel.

We are using [Azure pipelines][azure_pipelines] to build and publish the Supervisor. If you are interested on how we are doing this, you can look at the [release pipeline here][release_pipeline], and the [template repository here][azure_templates].

## Private Container Registries

In the [Supervisor 249][private-container-registries] blog post, we mentioned the introduction of private container registries. For you as a add-on maintainer this now give you the possibility to use any container registries like GitHub's package registry for docker, or your own instance of a container registry, while developing or testing your add-on.

This can also be used for private testing of your add-on by giving pull access to users.

To make the Supervisor use your credentials, you can use the [API][docker_api], the [CLI][cli], or the Supervisor panel in the Home Assistant UI.

## GitHub Action

You can now use our [builder][hassio-builder] as a [GitHub action][github_action]! :tada:

This is already in use in our [hassio-addons repository][addons], you can see an example on how we implemented it [here][hassio-builder-action].

It can be used both to ensuring that the add-on will still build with changes made to your repository, and to publish the images as a part of a release workflow. How to use the action is documented in the [hassio-builder repository][hassio-builder-action].

Here is an example on how you can use it:

```yaml
jobs:
  build:
    name: Test build
    runs-on: ubuntu-latest
    steps:
    - name: Checkout the repository
      uses: actions/checkout@v2
    - name: Test build
      uses: home-assistant/hassio-builder@master
      with:
        args: |
          --test \
          --all \
          --target /data
```

This example will run a test build on all supported architectures of the add-on.

:::tip
Your repository is mapped to `/data` in the action, so if you have your add-on files in subdirectories, you need to supply `--target /data/{directoryname}` as an argument to the builder action.
:::

[action-example]:https://github.com/home-assistant/hassio-addons/blob/master/.github/workflows/build.yml
[addons]: https://github.com/home-assistant/hassio-addons
[api_docs]: /docs/api/supervisor/endpoints
[azure_pipelines]: https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops
[azure_templates]: https://github.com/home-assistant/ci-azure
[calver]: https://calver.org/
[semver]: https://semver.org/
[cli]: https://github.com/home-assistant/cli
[docker_api]: /docs/api/supervisor/endpoints#docker
[github_action]: https://github.com/features/actions
[ha_core]: https://github.com/home-assistant/core
[hacktoberfest]: https://hacktoberfest.digitalocean.com/
[haos]: https://github.com/home-assistant/operating-system
[hassio-builder-action]: https://github.com/home-assistant/hassio-builder#github-action
[hassio-builder]: https://github.com/home-assistant/hassio-builder
[private-container-registries]: https://www.home-assistant.io/blog/2020/10/21/supervisor-249/#private-container-registries
[release_pipeline]: https://github.com/home-assistant/supervisor/blob/main/azure-pipelines-release.yml
[S6-overlay-permissions]: https://github.com/just-containers/s6-overlay#fixing-ownership--permissions
[S6-overlay]: https://github.com/just-containers/s6-overlay
