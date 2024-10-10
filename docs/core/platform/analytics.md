---
title: "Analytics"
---

Home Assistant allows users to share their usage data via the analytics integration. The aggregated data is available at https://analytics.home-assistant.io. It is used to influence Home Assistant development priorities and to convince manufacturers to add local control and privacy-focused features.

When attempting to communicate with manufacturers, it can be helpful to be equipped with information about what kind of a user base your integration has.

For a user's installation of your integration to count the following conditions must be met:
1) The integration must be set up.
2) The integration must not be disabled.
3) The integration must be a core integration OR a custom integration that is included in the [brands repository](https://github.com/home-assistant/brands).
4) The integration must have a config flow.
5) The user must have their usage analytics turned on.

Data for custom integrations can be found [here](https://analytics.home-assistant.io/custom_integrations.json).

Data for core integrations can be found [here](https://analytics.home-assistant.io/integrations/).

It is important to note that only an estimated 1/4th to 1/3rd of users have their analytics enabled - so your user base is more than likely multiple times larger than reported.
