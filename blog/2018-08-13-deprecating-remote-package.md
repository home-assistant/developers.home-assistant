---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Deprecating homeassistant.remote
---

With the release of Home Assistant 0.76, the functions in the `homeassistant.remote` package will be deprecated and will be removed in 0.77. This package contains functions to call the Home Assistant REST API in a non-async way.

The reason for removing is two-fold: first the code is not being used inside Home Assistant and thus should not be part of Home Assistant. Second, it is not compatible with the new auth system nor do we want to spend the time to make it compatible.

If you want to keep using the methods in `homeassistant.remote`, feel free to copy [the code](https://github.com/home-assistant/home-assistant/blob/0.75.0/homeassistant/remote.py) to your own project.
