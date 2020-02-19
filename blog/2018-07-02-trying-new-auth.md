---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Trying the new auth system
---

In Home Assistant 0.69 we introduced the foundation for a new [authentication API](/docs/en/auth_index.html). We're switching from a single hardcoded API password to a refresh/access token based authentication system (powered by OAuth2).

For Home Assistant 0.73, I've sprinted together with [@awarecan] to ensure that we have reached a minimum viable product of the auth system:

 - Users can be managed via a built-in command line script.
 - The frontend will ask for username and password to login
 - If you opt-in for the new system, the API password will no longer work.
 - To not force a hard break with the ecosystem around Home Assistant, a temporary legacy mode has been added to turn API password support back on. This will be removed in the future.

**The system is not yet ready for mainstream consumption**, we still need to add Hass.io support and a user interface to help guiding the user to create their first user account and to manage users. You can follow (and join!) the work to be done [here](https://github.com/home-assistant/home-assistant/issues?q=is%3Aissue+is%3Aopen+label%3Aauth).

If you're interested in trying it out, keep on reading.

<!--truncate-->

## Trying it out

This requires you to be running Home Assistant 0.73 beta or a later version.

First step will be to configure an auth provider. We are going to configure the built-in `homeassistant` auth provider. This provider will be the default one and stores users securely in the config directory.

```yaml
# Example configuration.yaml entry
homeassistant:
  auth_providers:
   - type: homeassistant
   # Uncomment next line if you want to enable legacy API password support
   # - type: legacy_api_password

# Enable the auth component
auth:
```

> This rest of the instructions are no longer necessary in Home Assistant 0.74 or later.

Next step is to create users. Open a terminal and navigate to your Home Assistant installation. The script for managing users is built into Home Assistant and can be invoked using `hass --script auth --config /path/to/config`.

![Screenshot showing the help output of the auth script](/img/en/blog/2018-07-experimental-auth/cli.png)

If you restart Home Assistant and navigate to the frontend, you'll be prompted with a new login screen. If you enabled both auth providers, you will first have to pick which auth provider to use for authentication.

Once logged in, the frontend will store the access and a refresh token. The access token expires every 30 minutes and whenever Home Assistant restarts. The fronend will automatically fetch a new access token using the stored refresh token. We're using the OAuth2 standard for this. [More info in the docs](/docs/en/auth_api.html).

[@awarecan]: https://github.com/awarecan
