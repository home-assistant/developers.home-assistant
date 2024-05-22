---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: Alarm Control Panel Entity default code and validation
---

The `AlarmControlPanelEntity` is now enforcing validation of code so for integrations that are creating such entities and are setting `code_arm_required` to `True` (default behavior). The validation will fail unless the user is actually providing a code.

Previously this was entirely optional and a user could skip code entry regardless if it was needed by the integration or not (and as such each integration needed to implement it's own check).

As the default behavior is that code is required, custom integrations that don't require a code input needs to set `code_arm_required` to `False` or the user will always have to input a code regardless if needed by the service calls.
