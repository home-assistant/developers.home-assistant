---
title: "Contributing to documentation"
---

The user documentation is located at [https://www.home-assistant.io](https://www.home-assistant.io).
This section provides additional details about creating or modifying content.

The [home-assistant.io](https://home-assistant.io) website is built using [Jekyll](https://github.com/jekyll/jekyll).
The pages are written in [Markdown](https://spec.commonmark.org/current/). To add a page, you don't need to know HTML.

## Documentation pull request review process

Before you submit a pull request, read through the [general pull request review process](/docs/review-process/).
In addition, the documentation has the following guidelines to take into account when contributing.

The documentation repository has two main branches: `current` and `next`:

- If you are documenting a new integration or a feature you are adding to the code, target the `next` branch.
- If you are improving existing documentation, target the `current` branch.

We mainly follow the Microsoft Writing Style Guide and have some additional guidelines:

- [Documentation standards](/docs/documenting/standards)
- [Documentation style guide](/docs/documenting/general-style-guide/)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)
- [Merriam-Webster Dictionary](https://www.merriam-webster.com/)
- [YAML Style Guide](/docs/documenting/yaml-style-guide)

## Small changes

You can use the **Edit** button or **Edit this page** link to edit pages, which will automatically create a fork in GitHub and allow you to edit quickly. Keep in mind that you can't upload images while working this way. You work on your change and propose it via a Pull Request (PR).

When you create a pull request (PR), you can see a preview of the proposed changes by clicking the **Deploy Preview** link in the Netlify comment.

## Larger changes

For larger changes, we suggest that you clone the website repository. This way, you can review your changes locally. The process of working on the website is no different from working on Home Assistant itself.

### Developing with Visual Studio Code + devcontainer

The easiest way to get started with development is to use Visual Studio Code with devcontainers, in the same way as for working on Home Assistant Core development. Have a look at the [Development Environment](/docs/development_environment) page for instructions.
When following these instructions, instead of Home Assistant Core repository, link to the `home-assistant.io` repository.

To review the changes, open the VS Code command palette and select **Tasks: Run Task** > **Preview**.
You should be able to access the documentation website running locally at `http://localhost:4000`.

### Manual environment

It is also possible to set up a more traditional development environment.

#### Install dependencies

To test your changes locally, you need Ruby and its dependencies, called gems.

1. Fork and clone the home-assistant.io [git repository](https://github.com/home-assistant/home-assistant.io).
2. In your local `home-assistant.io` directory, install Ruby. For the current required version, see [.ruby-version](https://github.com/home-assistant/home-assistant.io/blob/current/.ruby-version).
3. Install Ruby and Bundler for your operating system.

   - Fedora:

       ```shell
       sudo dnf -y install \
         gcc-c++ ruby ruby-devel rubygem-bundler rubygem-json rubygem-rake
       bundle
       ```

   - Debian/Ubuntu:

       ```shell
       sudo apt-get install \
         ruby ruby-dev ruby-bundler ruby-json g++ zlib1g-dev
       bundle
       ```

   - macOS, if the bundled Ruby doesn't work:

       ```shell
       brew install ruby@$(cat .ruby-version)
       export PATH="/usr/local/opt/ruby@$(cat .ruby-version)/bin:$PATH"
       ```

4. If you did not already install the gems as part of the previous step, run `bundle` from the `home-assistant.io` directory.

##### Optional: install Ruby with mise-en-place

If you manage Ruby with [mise-en-place](https://mise.jdx.dev/), use `mise` instead of step 3 in the main procedure.

On Fedora, first install the packages that `mise` needs to install Ruby:

```shell
sudo dnf -y install \
  gcc-c++ make perl-FindBin openssl-devel readline-devel \
  zlib-ng-compat-devel libyaml-devel gmp-devel
```

Trust the repository configuration so `mise` reads the required version from `.ruby-version`:

```shell
mise trust
mise install ruby
gem install bundler
bundle
```

#### Preview the website locally

1. Generate the first preview:

   ```shell
   bundle exec rake generate
   ```

   This can take a minute.
2. Create, edit, or update a page. The integration documentation is located in `source/_integrations/`. The Home Assistant documentation is located in `source/_docs/`.
3. Start the local preview:

   ```shell
   bundle exec rake preview
   ```

4. Open [http://127.0.0.1:4000](http://127.0.0.1:4000) in your browser. While the preview is running, changes to files are detected automatically and the affected pages are rebuilt. Refresh the page in your browser to see the update.
5. When you are ready to open a pull request (PR), follow the [documentation pull request review process](#documentation-pull-request-review-process).

#### Preview the website from a headless machine

The site generated by `bundle exec rake` is only available locally. If you are developing on a headless machine, use port forwarding:

```shell
ssh -L 4000:localhost:4000 user_on_headless_machine@ip_of_headless_machine
```
