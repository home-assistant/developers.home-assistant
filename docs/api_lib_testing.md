---
title: "Python library: Testing in Home Assistant"
sidebar_label: Testing in Home Assistant
---

This guide explains how to run Home Assistant using an unsupported version of an external library. This is primarily intended for testing how the new version behaves in Home Assistant without having a full Home Assistant development environment.

This guide is not intended for integration developers. If you are doing integration development, you should follow the integration development workflow and [specify the library in the integration manifest](creating_integration_manifest#custom-requirements-during-development--testing).

## Where to test

It is recommended to create a new, disposable Home Assistant installation by following the [installation guide](https://www.home-assistant.io/installation/). The quickest and easiest method is to install Home Assistant Container.

However, in some cases, you may need to or want to test using an existing Home Assistant installation. When using an existing Home Assistant installation:

- You don't need to make another installation of Home Assistant.
- Everything is already configured.
- You will need to restart this Home Assistant instance when making changes, which may cause downtimes for automations, gaps in logs, etc.
- Testing with different libraries is unsupported and can lead to Home Assistant instability that the Home Assistant developers will not be able to help you with.
- If you don't clean up after you're done, you will continue running the same version of the library even if Home Assistant includes an updated version of the library, which may cause the integration to break.

## Obtaining access

### Home Assistant Operating System

If you have a monitor and keyboard or a serial console that can be connected to the device or virtual machine, you can log in there using the username "root" and no password. If not, you can use either the [developer SSH](operating-system/debugging) or the community [Advanced SSH & Web Terminal](https://my.home-assistant.io/redirect/supervisor_addon/?addon=a0d7b954_ssh) add-on with "Protection mode" turned off. The standard [SSH](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_ssh) add-on does not provide access to the Home Assistant Container environment.

Once you have shell access, type `docker exec -it homeassistant /bin/bash` to get into the Home Assistant Container environment.

You may want to turn this level of remote access back off later.

:::note
It is usually possible to create the expected file structure and copy it into the configuration directory using the [Samba](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_samba) add-on. However, this is more difficult to explain and can be difficult to troubleshoot.
:::

### Home Assistant Supervised

Type `docker exec -it homeassistant /bin/bash` to get into the Home Assistant Container environment.

### Home Assistant Container

If you are running the container in Docker, type `docker exec -it homeassistant /bin/bash` to get into the Home Assistant Container environment. If you're using a different container runtime or gave the container a different name, you will need to alter the command accordingly.

### Home Assistant Core

If Home Assistant Core was installed following the official installation instructions, run the following commands to set up your environment:

```shell
sudo -u homeassistant -H -s
source /srv/homeassistant/bin/activate
cd ~/.homeassistant
```

## Installing libraries

After following the above steps, you should now have a command prompt inside your Home Assistant configuration directory.

If you just want to install a different version of a library, you can use `pip3 install -I --prefix deps <your-library>==<version>` to install the library into the appropriate location in your config folder. It's possible to install unreleased versions by using Git commits: `pip3 install -I --prefix deps git+https://github.com/<user>/<repo>.git@<commit|branch|tag>`. Restart Home Assistant for the changes to take effect.

:::note
If the library contains unmanaged code and compatible wheels are not available, installation will likely fail because Home Assistant does not come with compilers and development packages. Cross-compiling a compatible wheel is outside the scope of this document.
:::

Home Assistant will look for libraries in this directory first, before it looks for libraries in the usual places, and this directory is not reset when restarting or upgrading Home Assistant.

You can uninstall the library and its dependencies by deleting them from your config directory. It will be somewhere like `deps/lib/python<version>/site-packages`.

:::caution
Remember to uninstall the library and its later. If you do not uninstall the library, eventually the version in your config directory will be older than the version in Home Assistant. The older version will continue to be used, and this will likely cause unexpected problems.
:::
