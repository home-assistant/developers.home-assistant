---
title: "Building a Python library for an API"
sidebar_label: "Introduction"
---

One of the foundational rules of Home Assistant is that we do not include any protocol specific code. Instead, this code should be put into a standalone Python library and published to PyPI. This guide will describe how to get started with this!

## Basic library requirements

- The library must have source distribution packages available<> it's not allowed to rely on packages that only have binary distribution packages.
- Issue trackers must be enabled for external Python libraries that communicate with external devices or services.
- If the library is mainly used for Home Assistant and you are a code owner of the integration, it is encouraged to use an issue template picker with links to [Home Assistant Core Issues](https://github.com/home-assistant/core/issues). For example: [zwave-js-server-python - New Issue](https://github.com/home-assistant-libs/zwave-js-server-python/issues/new/choose)
- The library and possible subdependencies of the library must be licensed using an [OSI-approved license](https://opensource.org/license). This should be reflected in the metadata of the library.


For this guide we're going to assume that we're building a library for a Rest API that is accessible over HTTP and returning data structured as JSON objects. This is the most common type of API that we see. These APIs can either be accessible on the device itself, or in the cloud.

This guide is not a perfect fit for every API. You might have to tweak the examples.

:::info
If you are a manufacturer designing a new API for your product, [please read about the best type of API to add to your products here](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/#local-device-pushing-new-state).
:::

HTTP API requests consist of four different parts:

- The URL. This is the path that we fetch data from. With a Rest API the URL will uniquely identify the resource. Examples of urls are `http://example.com/api/lights` and `http://example.com/api/light/1234`.
- The HTTP method. This defines what we want from the API. The most common ones are:
  - `GET` for when we want to get information like the state of a light
  - `POST` for if we want something to be done (ie turn on a light)
- The body. This is the data that we sent to the server to identify what needs to be done. This is how we send the command in the case of a `POST` request.
- The headers. This contains metadata to describe your request. This will used to attach the authorization to the request.

## Structuring the library

Our library will consist of two different parts:

- **Authentication:** Responsible for making authenticated HTTP requests to the API endpoint and returning the results. This is the only piece of code that will actually interact with the API.
- **Data models:** Represent the data and offer commands to interact with the data.

## Trying your library inside Home Assistant

You will need to run an editable version of your library if you want to try your library in Home Assistant before it is published to PyPI.

Do so by going to your Home Assistant development environment, activating the virtual environment and typing:

```shell
pip3 install -e ../my_lib_folder
```

Now run Home Assistant without installing dependencies from PyPI to avoid overriding your package.

```shell
hass --skip-pip-packages my_lib_module_name
```
