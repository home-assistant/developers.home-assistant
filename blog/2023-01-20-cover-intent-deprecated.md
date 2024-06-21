---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
title: "Cover intents deprecated"
---

The intents `HassCoverOpen` and `HassCoverClose` have been deprecated as of Home Assistant 2023.02. Instead, use the intents `HassTurnOn` and `HassTurnOff`. This was done because some languages do not differentiate between Open/On and Close/Off.
