---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: "Multi-pan temporarily disabled"
---

**Update:** multi-pan has been fixed and users can once again opt-in to the experimental version starting Home Assistant 2023.2.

In [Home Assistant 2022.12](https://www.home-assistant.io/blog/2022/12/07/release-202212/) we soft-launched our experimental multi-pan feature: allowing to run both Zigbee and Thread using the single radio found in both Home Assistant Yellow and Home Assistant SkyConnect. Users had to find it in the hardware menu, confirm the experimental note and opt-in.

We just found a serious bug in the firmware that we need to fix. That's why we have decided to temporarily disable allowing users to opt in to multi-pan starting Home Assistant 2022.12.1.

The bug is that Zigbee end-devices cannot rejoin the network through the coordinator: it kicks them and asks them to re-join, over and over. Normal EmberZNet firmware does not behave this way. It only affects end devices joined directly to the coordinator, not ones joining through an intermediate router, and only those that attempt to re-join the network.

We're working with Silicon Labs to get this issue resolved as soon as possible. Once resolved, we will re-enable multi-pan.

Enabling multi-pan installs a special firmware on your radio. To disable multi-pan, the original Zigbee firmware needs to be installed again. This is not something that can be done automatically from Home Assistant yet. We will be updating this post soon with instructions on how to do this via your browser.
