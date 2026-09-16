---
title: "The documentation provides troubleshooting information"
sidebar_label: 🥇 docs-troubleshooting
---

## Reasoning

We should provide instructions on how to fix a common issue.
A troubleshooting topic should help users recognize the problem they are experiencing and provide concrete steps to resolve or narrow it down.
When useful, include the exact error message, unavailable state, missing device or entity, repair issue, or other observable symptom.
This decreases the amount of support requests and improves the user experience.

## Example implementation

When an integration has multiple independent troubleshooting cases, use a separate collapsible details block for each recognizable user-facing problem.
The details title should describe the problem from the user's perspective.
Inside the block, start with the observable symptom, add a short explanation only when it helps, and then provide actionable resolution steps.

```liquid showLineNumbers
## Troubleshooting

{% details "Connection error during setup" %}

**Symptom:** Setup shows the message **This device can't be reached**.

This means the device is not currently reachable for local communication.

1. Make sure the device is powered on.
2. Make sure the device is connected to the network.
3. Make sure local communication is enabled on the device.

{% enddetails %}

{% details "Device does not appear after setup" %}

**Symptom:** Setup completes, but no device appears in Home Assistant.

1. Verify that the device appears in the manufacturer's app.
2. Check that the device is linked to the same account or hub used during setup.
3. Go to **Settings** > **Devices & services**, select the integration, then select the three-dot menu and choose **Reload**. Verify whether the device appears.

{% enddetails %}
```

For a single, very short troubleshooting note, plain prose under `## Troubleshooting` can be appropriate if a details block would add more markup than clarity.
Do not add `Description`, `Cause`, or `Resolution` subheadings unless they materially improve the readability of a longer troubleshooting case.

## Exceptions

There are no exceptions to this rule.
