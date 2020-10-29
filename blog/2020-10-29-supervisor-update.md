---
author: Joakim Sørensen
authorURL: https://github.com/ludeeus
authorTwitter: ludeeus
title: "Upcoming changes to add-ons"
---

## GitHub Action

You can now use our [builder][marketplace] as a [GitHub action][github_action]! :tada:

This is already in use in our [hassio-addons repository][addons], you can see an example on how we implemented it [here][builder-action].

It can be used to ensure that the add-on will still build with changes made to your repository and publish the images as part of a release workflow. How to use the action is documented in the [builder repository][builder-action].

Here is an example of how you can use it:

```yaml
jobs:
  build:
    name: Test build
    runs-on: ubuntu-latest
    steps:
    - name: Checkout the repository
      uses: actions/checkout@v2
    - name: Test build
      uses: home-assistant/builder@master
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

## Documentation

Our [API documentation][api_docs] has moved to the developer documentation site. During this move, it also got a style update to make it easier to navigate. Some of the endpoints are still missing some content. If you have not yet met your quota for [Hacktoberfest], maybe you want to contribute some more details to our API descriptions?

## API Changes

- Using the `/homeassistant/*` endpoints is deprecated and will be removed later this year. You need to use `/core/*` instead.
- Using `http://hassio/` is deprecated and will be removed later this year. You need to use `http://supervisor/` instead.
- Using `HASSIO_TOKEN` is deprecated and will be removed later this year. You need to use `SUPERVISOR_TOKEN` instead.
- Deleting snapshots with `POST` calling `/supervisor/snapshots/<slug>/remove` is deprecated and will be removed later this year. You need to use the `DELETE` method when calling `/supervisor/snapshots/<slug>` instead.
- Using `X-Hassio-Key` header as an authentication method is deprecated and will be removed later this year. You need to use an authorization header with a `Bearer` token instead.

The [API documentation][api_docs] has been updated to reflect these changes.

## Add-on options

The permissions of the `/data/options.json` file, is changed from `644` to `600`. If your add-on is running as non-root and reading this file, it will now give you permission issues.

There are several steps you can do in your add-on to continue to use this information:

- If you are using [S6-overlay] in your add-on, you can use [`/etc/fix-attrs.d`][S6-overlay-permissions] to ensure that the user you are running the add-on as, has access to the file.
- You can change your add-on to run as `root` (default).

## Releases

Until now, the Supervisor, our plugins and add-ons have been using a mix of the build number and [Semantic Versioning (SemVer)][semver] as the versioning system. We have decided to replace that for these repositories and to adopt [Calendar Versioning (CalVer)][calver] as our versioning system instead.

We are migrating the Supervisor from release based development to continuous development. This fits perfectly with our existing channel-based update strategy (stable, beta and dev). We are now leveraging automated pipelines to build and push out new Supervisor versions to the correct channels. There was no more need for a dual branch setup by moving to this structure, so both our `dev` and `master` branches have now been replaced with a new `main` branch. Our plugins (DNS, Multicast, Observer, CLI) for the Supervisor will also follow this continuous development principle.

We made this move to provide higher software quality with an automatic test system. Every commit now triggers a new dev release, which gets tested by our test instances. Issues are imminently reported to sentry. This gives us the opportunity to test all changes before we create a release. When a release is created, the changes will come available in the beta channel. Once declared stable, we can promote the release to the stable channel.

We are using our [builder action][marketplace] with [GitHub actions][github_action] to build and publish the Supervisor, our plugins and base images for our Docker containers. If you are interested in how we are doing this, you can look at the [builder action for the Supervisor here][builder_action], and the [action helpers here][action_helpers].

[action_helpers]: https://github.com/home-assistant/actions/tree/master/helpers
[addons]: https://github.com/home-assistant/hassio-addons
[api_docs]: /docs/api/supervisor/endpoints
[builder_action]: https://github.com/home-assistant/supervisor/blob/main/.github/workflows/builder.yml
[builder-action]: https://github.com/home-assistant/builder#github-action
[calver]: https://calver.org/
[github_action]: https://github.com/features/actions
[Hacktoberfest]: https://hacktoberfest.digitalocean.com/
[marketplace]: https://github.com/marketplace/actions/home-assistant-builder
[S6-overlay-permissions]: https://github.com/just-containers/s6-overlay#fixing-ownership--permissions
[S6-overlay]: https://github.com/just-containers/s6-overlay
[semver]: https://semver.org/
