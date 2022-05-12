---
author: Pascal Vizeli
authorURL: https://twitter.com/pvizeli
authorTwitter: pvizeli
title: S6-Overlay 3.x update on our docker base images
---

We start to update our base image to use the new 3 s6-Overlay. A [migration article](https://github.com/just-containers/s6-overlay/blob/master/MOVING-TO-V3.md) also explains the new possibilities around this change. This blog post explains what you have to do more shortly.

We have updated our [example add-on](https://github.com/home-assistant/addons-example) to include the new behaviors.

## Minimum

Make sure all your executable/script files have the execution permission set on your git repository rootfs folder. You can update the permissions simple with:

i.e.
```sh
$ git update-index --chmod=+x rootfs/etc/service.d/my-service/run
```

If you use `finish` scripts at your service to get it down on an error, you have to update the line `s6-svscanctl -t /var/run/s6/services` with `/run/s6/basedir/bin/halt`.

## AppArmor

You have to tweak your AppArmor profile to get it working with the new s6-Overlay. We updated our documentation with the default profile. Follow changes have to be made:

```txt

```
