---
title: "The documentation describes how data is updated"
---

## Reasoning

For the user to know how the integration works, we should describe how the data of the integration is updated.
Because this will help users create an expectation on how well the integration works for their use case.
A motion sensor that only polls every 5 minutes is less usable than a motion sensor that actively pushes updates.

Since users can define their own polling interval for polling integrations, we should add at what rate we poll now and describe any limitations.
For example if the device we connect to has known problems handling too many requests, we should describe that in the documentation.

## Example implementation

```markdown showLineNumbers
## Data updates

My integration fetches data from the device every 5 minutes by default.
Newer devices (the ones running MyOS) have the possibility to {% term push %} data.
At the start of the integration we try to enable that, and if it fails we fall back to {% term polling %}.
```

## Exceptions