---
title: "Local add-on testing"
---

The fastest way to develop add-ons is by adding them to your local add-on repository. To access your local add-on repository, install either the [Samba add-on](https://www.home-assistant.io/addons/samba/) or [SSH add-on](https://www.home-assistant.io/addons/ssh/).

Right now add-ons will work with images that are stored on Docker Hub (using `image` from add-on config). Without `image` inside local add-ons repository it to be built on the device.

The [Community Add-on](https://github.com/hassio-addons/hassio-vagrant) repository create a vagrant based development system. This Vagrant virtual machine allows you to test and play with Hass.io and Home Assistant, and is a great environment for add-on developers

## Local build

You can build and try the addon on your developer machine also. Move all addon stuff into a temp folder. If you use `FROM $BUILD_FROM` you need set a base image with build args. Normally you can use follow base images:

- armhf: `homeassistant/armhf-base:latest`
- aarch64: `homeassistant/aarch64-base:latest`
- amd64: `homeassistant/amd64-base:latest`
- i386: `homeassistant/i386-base:latest`

Use `docker` to build the test addon: `docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t local/my-test-addon .`

## Local run

Create a new folder for data and add a test *options.json* file. After that you can run your add-on with: `docker run --rm -v /tmp/my_test_data:/data -p PORT_STUFF_IF_NEEDED local/my-test-addon`

## Logs

All stdout and stderr are redirected to the Docker logs. The logs can be fetched from the add-on page inside the Hass.io panel in Home Assistant.