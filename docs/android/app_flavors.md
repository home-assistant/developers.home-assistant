---
title: "Android Flavors"
sidebar_label: "Flavors"
---

:::info
Only the `:app` and `:automotive` modules are affected by these flavors.
:::

## Overview

The Android app is built with two flavors: `full` and `minimal`. These flavors allow us to cater to different user preferences. This document explains the differences between the flavors, their features, and the rationale behind their implementation.

## App Flavors

### Full Flavor

The `full` flavor uses the **Google Play Services**, enabling features such as:

- Location tracking
- Push notifications
- Communication with Wear OS devices

This flavor is the primary focus of development and is distributed via the Google Play Store.

### Minimal Flavor

The `minimal` flavor is designed for users who prefer or require an app without **Google Play Services**. It is available on F-droid and has the following limitations:

- ❌ No location tracking sensor
- ❌ No push notifications (except if using [local notification](https://companion.home-assistant.io/docs/notifications/notification-local#requirements) over the WebSocket)
- ❌ No communication with Wear OS devices
- ❌ No crash reporting

Despite these limitations, the `minimal` flavor allows us to offer the app to a broader audience, including users of devices without Google Play Services. If viable open-source alternatives to Google Play Services features are found, they may be considered for inclusion in the `minimal` flavor to remove this limitations.

## Crash Reporting

We use [Sentry](https://sentry.io) for crash reporting, but it is only enabled for the `full` flavor. This means:

- Crashes in the `minimal` flavor are **not tracked**.
- Developers relying on crash reports for debugging should focus on the `full` flavor.

## Development Focus

While the `minimal` flavor is maintained to support a wider user base, the primary focus of development is on the `full` flavor. This is because the `full` flavor provides a richer feature set and aligns with the majority of user needs.

## Notes

- The `minimal` flavor is ideal for users who prioritize privacy or use devices without Google Play Services.
- The `full` flavor is recommended for users who want the complete feature set, including advanced integrations like location tracking and notifications.
- Both flavors share the same core functionality, ensuring a consistent experience where possible.
