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

{% details "Pairing a Thread device fails" %}

### Symptom: the device is in pairing mode, but commissioning does not complete

You are trying to add a Thread device through the Home Assistant Companion app, but the process fails or times out.

#### Description

Pairing a Thread device involves multiple steps that happen automatically: your phone connects to the device over Bluetooth Low Energy (BLE), shares the Thread network credentials, and then the device joins the Thread mesh and gets commissioned into Home Assistant. A failure at any of these steps can cause pairing to fail.

#### Resolution

First, make sure you have followed all the prerequisites for adding a Matter device, including phone setup and Bluetooth requirements. Refer to the [adding a Matter device to Home Assistant](/integrations/matter/#adding-a-matter-device-to-home-assistant) procedure for the full checklist.

If pairing still fails after verifying the prerequisites, check the following:

- The device is still in pairing mode. Most devices only stay in pairing mode for a limited time. If it expires, reset the device to pairing mode and try again.
- Restart your phone. If commissioning fails or stalls, a full restart of your phone can clear stale Bluetooth state or stale Thread routes and often resolves the issue.
- Mesh Wi-Fi access points are not blocking multicast. Some mesh Wi-Fi systems aggressively filter multicast traffic on Wi-Fi. This can prevent your phone from discovering the border router via mDNS. If you suspect this, check your mesh system's settings for options related to multicast, IGMP snooping, or mDNS.

{% enddetails %}
```

## Exceptions

There are no exceptions to this rule.
