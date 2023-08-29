---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "HomeAssistant.__init__ requires passing a string to it"
---

The signature of `HomeAssistant.__init__` has been changed from no arguments to require the configuration directory as a string to be passed to it. Scripts, tests etc. outside of the HomeAssistant core repo which create `HomeAssistant` objects will need to be updated.

The change was introduced in [core PR#98442](https://github.com/home-assistant/core/pull/98442)

An example of how to maintain backwards compatibility can be found in [this HACS PR](https://github.com/hacs/integration/pull/3233/files#diff-065c5ee13b4f5b63ecbf9db332e84b7cee7c5fcaa5d3daff7d3d076ade925009).
