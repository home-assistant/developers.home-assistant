---
author: Joost Lekkerkerker
authorURL: https://github.com/joostlek
authorImageURL: https://avatars.githubusercontent.com/u/7083755?v=4
title: "model_id added to DeviceInfo"
---

Starting from 2024.8, you can now add a model identifier to the `DeviceInfo` class. This identifier can be used to identify the device model in integrations and the frontend.

For example, the Philips Hue ambiance spot was previously listed as "Hue ambiance spot (LTG002)". This can now be split up, where the `model` is "Hue ambiance spot" and the `model_id` is "LTG002".