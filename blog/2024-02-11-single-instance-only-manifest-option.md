---
author: Jan-Philipp Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "New single instance only manifest option"
---

In Home Assistant 2024.3, we introduced a new `single_instance_only` option for the integration manifest file.
This option allows you to say that your integration supports only one config entry.

Home Assistant will take care and prevent the initialization of a config flow if there is already a config entry for the integration.
This way you won't have to implement the check in the config flow.

Integrations that have this option not set and do the check in the config flow should replace it with the new option.