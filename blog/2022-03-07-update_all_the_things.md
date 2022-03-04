---
author: Joakim Sørensen
authorURL: https://github.com/ludeeus
authorImageURL: /img/profile/ludeeus.jpg
authorTwitter: ludeeus
title: "Update all the things!🎉"
---

In Home Assistant Core [2021.12](https://www.home-assistant.io/blog/2021/12/11/release-202112/#brand-new-configuration-panel) we moved updates provided by
the Supervisor to the Configuration panel, starting with Home Assistant Core 2022.4 this is no longer limited to the Supervisor integration.

All integrations can now provide an update platform (`update.py`) to show and
perform updates.

For more details on how to implement the update platform in your integration have a look at the [update platform documentation](/docs/core/update_platform)
