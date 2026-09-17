---
title: "The documentation provides troubleshooting information"
sidebar_label: 🥇 docs-troubleshooting
---

## Reasoning

We should provide instructions on how to fix a common issue.
If possible, a troubleshooting topic should include a description of the symptom and the steps needed to fix the situation.
This decreases the amount of support requests and improves the user experience.

## Example implementation

When an integration has multiple independent troubleshooting cases, use a separate collapsible details block for each recognizable user-facing problem.
Keep the standard symptom, description, and resolution structure inside each block.
For a short troubleshooting topic, sections can be omitted when they would add no useful information.

```liquid showLineNumbers
## Troubleshooting

{% details "Can’t set up the device" %}

### Symptom: “This device can’t be reached”

When trying to set up the integration, the form shows the message “This device can’t be reached”.

#### Description

This means the settings on the device are incorrect, since the device needs to be enabled for local communication.

#### Resolution

1. Make sure your device is powered up (LEDs are on).
2. Make sure your device is connected to the internet:
   - Make sure the app of the manufacturer can see the device.
3. Make sure the device has the local communication enabled:
   - Check the device’s settings.
   - Check the device’s manual.

{% enddetails %}

{% details "I can't see my devices" %}

### Symptom: The devices do not appear in Home Assistant

#### Resolution

Make sure the devices are visible and controllable via the manufacturer's app.
If they are not, check the device's power and network connection.

{% enddetails %}
```

## Exceptions

There are no exceptions to this rule.
