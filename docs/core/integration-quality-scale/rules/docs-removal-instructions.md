---
title: "The documentation provides removal instructions"
---

## Reasoning

Removing a device or service from Home Assistant isn't always straightforward.
The documentation should provide clear instructions on how to remove the device or service.

## Example implementation

```markdown showLineNumbers
## Remove integration

This integration can be removed by following these steps:

{% include integrations/remove_device_service.md %}

After deleting the integration, go to the app of the manufacturer and remove the Home Assistant integration from there as well.
```

## Exceptions

There are no exceptions to this rule.