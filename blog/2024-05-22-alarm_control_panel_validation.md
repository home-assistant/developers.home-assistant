---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: Alarm Control Panel Entity code validation
---

The `AlarmControlPanelEntity` is now enforcing validation of code for alarm control panel entities which set `code_arm_required` to `True` (default behavior). Service calls fail if no code is provided when a code is required.

Previously this was entirely optional and a user could skip code entry regardless of it was needed by the integration or not (and as such each integration needed to implement it's own check).

As the default behavior is that code is required, custom integrations that don't require a code input need to set `code_arm_required` to `False` or the user will always have to input a code regardless of if it's needed by the service calls.
