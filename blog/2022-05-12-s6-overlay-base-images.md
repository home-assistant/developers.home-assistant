---
author: Pascal Vizeli
authorURL: https://twitter.com/pvizeli
authorTwitter: pvizeli
title: S6-Overlay 3.x update on our docker base images
---

We started to update our base images to use the new s6-Overlay v3. A [migration article](https://github.com/just-containers/s6-overlay/blob/master/MOVING-TO-V3.md) also explains the new possibilities around this change. This blog post explains the minimal changes needed to be able to use our new base images.

We have updated our [example add-on](https://github.com/home-assistant/addons-example) to include the new behaviors.

## Minimum

Add `init: false` to your addon's `config.yaml` if you don't have this already. In V3, S6 enforces that their init is used correctly, if Docker default system init is used you will see the following error when you start your addon:

```
s6-overlay-suexec: fatal: can only run as pid 1
```

Make sure all your executable/script files have the execution permission set on your git repository rootfs folder. You can update the permissions using:

```sh
$ git update-index --chmod=+x rootfs/etc/service.d/my-service/run
```

If you use `finish` scripts in your S6-overlay services, for example, to stop the container on an error, you have to replace the line `s6-svscanctl -t /var/run/s6/services` with `/run/s6/basedir/bin/halt`.

## AppArmor

You have to tweak your [AppArmor profile](/docs/add-ons/presentation#apparmor) to get it working with the new s6-Overlay. We updated our documentation with the default profile. The following changes need to be made:

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
