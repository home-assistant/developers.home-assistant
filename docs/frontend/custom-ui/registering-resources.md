---
title: "Registering Resources"
---

If you want to extend the Home Assistant Lovelace interface with custom cards, strategies or views you need to load external resources.

The first step is to make it accessible for the Home Assistant frontend. This is done by creating a new directory in your config folder called `www`. Create this directory and restart Home Assistant.

Once restarted, you can put files in this directory. Each file will be accessible without authentication via the UI at `/local`.

The next step is to register these resources with the Lovelace interface. This is done by navigating to the Lovelace resources page by following below link:

[![Open your Home Assistant instance and show your Lovelace resources.](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)

:::note

This tab is only available when the active user's profile has "advanced mode" enabled.

:::

![Screenshot of the Resources tab, found at the top of the Lovelace Configuration UI](/img/en/frontend/lovelace-ui-resources-tab.png)

![Screenshot of the Advanced Mode selector found on the Profile page](/img/en/frontend/lovelace-ui-profile-advanced-mode.png)
