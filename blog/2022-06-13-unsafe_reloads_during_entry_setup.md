---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Avoiding reloading config entries while they are setting up"
---

Before 2022.7, it was possible to trigger a reload of a config entry while it was still setting up. Reloading during config entry setup often led to unexpected failure modes, which required restarting Home Assistant to get the config entry back in a good state. Attempting a reload during setup now raises the `OperationNotAllowed` exception.