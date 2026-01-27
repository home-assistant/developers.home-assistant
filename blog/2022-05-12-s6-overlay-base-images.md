---
author: Pascal Vizeli
authorURL: https://twitter.com/pvizeli
authorTwitter: pvizeli
title: S6-Overlay 3.x update on our docker base images
---

We started to update our base images to use the new s6-Overlay v3. A [migration article](https://github.com/just-containers/s6-overlay/blob/master/MOVING-TO-V3.md) also explains the new possibilities around this change. This blog post explains the minimal changes needed to be able to use our new base images.

We have updated our [example add-on](https://github.com/home-assistant/addons-example) to include the new behaviors.

## Minimum

Add `init: false` to your addon's `config.yaml` if you don't have this already. In V3, S6 enforces that their init is used correctly. If Docker default system init is used you will see the following error when you start your addon:

```
s6-overlay-suexec: fatal: can only run as pid 1
```

Make sure all your executable/script files have the execution permission set on your git repository rootfs folder. You can update the permissions using:

```sh
$ git update-index --chmod=+x rootfs/etc/service.d/my-service/run
```

If you use `finish` scripts in your S6-overlay services, for example, to stop the container on an error, you have to replace the line `s6-svscanctl -t /var/run/s6/services` with `/run/s6/basedir/bin/halt`.

## AppArmor

You have to tweak your [AppArmor profile](/docs/apps/presentation#apparmor) to get it working with the new s6-Overlay. We updated our documentation with the default profile. The following changes need to be made:

```txt
# S6-Overlay
  /init ix,
  /bin/** ix,
  /usr/bin/** ix,
  /run/{s6,s6-rc*,service}/** ix,
  /package/** ix,
  /command/** ix,
  /etc/services.d/** rwix,
  /etc/cont-init.d/** rwix,
  /etc/cont-finish.d/** rwix,
  /run/{,**} rwk,
  /dev/tty rw,
```

## `host_pid` option

Addons running without protection mode enabled can set `host_pid: true` in their configuration. As described in the [documentation](https://developers.home-assistant.io/docs/apps/configuration#optional-configuration-options):

> Allow to run container on host PID namespace. Works only for not protected add-ons.

This is a problem because S6 expects to be PID 1 (it's literally in the [tagline](https://github.com/just-containers/s6-overlay#s6-overlay-)) and that's impossible when using the host PID namespace.

In V2, S6 didn't actually check that it was running as PID 1. This is why it "worked" when in this mode in the past (although it required some [workarounds](https://github.com/hassio-addons/addon-glances/blob/8575d7903ef4c0a7c49e9ab32e0536bd2eb12dd6/glances/rootfs/bin/s6-nuke) to keep s6 from breaking systems when running this way). In V3 S6 checks that it is actually PID 1 and refuses to start otherwise.

To fix this, don't use s6 overlay in your addon as it's not designed for this use case. You can continue to use the addon base images by overriding `/init` with a no-op script and then use the normal docker init system. Or you can switch to a different base image like stock alpine or debian and add what you need.
