---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Instance URL helper
---

If you are an integration developer and came across the problem of getting the
URL of the users' Home Assistant instance, you probably know, this wasn't always
easy.

The main problem is that a Home Assistant instance is generally installed, at home.
Meaning the internal and external address can be different and even those can
have variations (for example, if a user has a Home Assistant Cloud subscription).

Matters become worse if the integration has specific requirements for the URL;
for example, it must be externally available and requires SSL.

As of Home Assistant Core 0.110, a new instance URL helper is introduced to
ease that. We started out with the following flow chart to solve this issue:

[![Flow chart of getting a Home Assistant instance URL](/img/en/blog/2020-05-instance-url-helper/flowchart.png)](/img/en/blog/2020-05-instance-url-helper/flowchart.png)

As a result of this, the previously available `base_url` is now replaced by two
new core configuration settings for the user: the internal and external URL.

From a development perspective, the use of `hass.config.api.base_url` is now
deprecated in favor of the new `get_url` helper method.

For more information on using and implementing this new URL helper method,
consult our documentation [here](/docs/instance_url).
