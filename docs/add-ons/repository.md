---
title: "Create an add-on repository"
---

An add-on repository can contain one or more add-ons. Each add-on is stored in its own unique folder. To be identified as a repository, the repository must contain a configuration file.

Check the [Example add-on repository](https://github.com/home-assistant/addons-example) for further details.

## Installing a repository

A user can add a repository by going to the Supervisor panel in Home Assistant, clicking on the store icon in the top right, copy/paste the URL of your repository into the repository textarea and click on **Save**.

:::tip
You can generate a [my.home-assistant.io](https://my.home-assistant.io/create-link/) for your users to do this with the click of a button in your readme file.
:::

## Repository configuration

Each repository is required to contain `repository.yaml` at the root in the git repository.

```yaml
name: Name of repository
url: http://www.example/addons
maintainer: HomeAssistant Team <info@home-assistant.io>
```

| Key | Required | Description |
| --- | -------- | ----------- |
| `name` | yes | Name of the repository
| `url` | no | Homepage of the repository. Here you can explain the various add-ons.
| `maintainer` | no | Contact info of the maintainer.
