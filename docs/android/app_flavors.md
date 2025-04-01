---
title: "Android flavors"
sidebar_label: "Flavors"
---

:::info
Only the `:app` and `:automotive` modules are affected by these flavors.
:::

## Overview

The Android app is built with two flavors: `full` and `minimal`. These flavors allow us to cater to different user preferences. This document explains the differences between the flavors, their features, and the rationale behind their implementation.

## App flavors

### Shared code

We try, as much as possible, to keep everything in the source set agnostic `main` of the flavor so that everyone can benefit from new features. We will always favor open-source solutions if we can.

### Full flavor

The `full` flavor uses the **Google Play Services**, enabling features such as:

- Location tracking
- Push notifications
- Communication with Wear OS devices

This flavor is the one distributed via the Google Play Store.

### Minimal flavor

The `minimal` flavor is designed for users who prefer or require an app without **Google Play Services**. It has the following limitations:

- ❌ No location tracking for [presence detection](https://www.home-assistant.io/getting-started/presence-detection/#adding-zone-presence-detection-with-a-mobile-phone)
- ❌ No push notifications (except when using [local notification](https://companion.home-assistant.io/docs/notifications/notification-local#requirements) over the WebSocket)
- ❌ No communication with Wear OS devices
- ❌ No crash reporting

Despite these limitations, the `minimal` flavor allows us to offer the app to a broader audience, including users of devices without Google Play Services. If viable open-source alternatives to Google Play Services features are found, they may be considered for inclusion in the `minimal` flavor to remove these limitations.

This flavor is used, for instance:

- For manual downloads of the APK or through F-Droid.
- For Meta Quest devices.
- For the Automotive build for OEM.

## Crash reporting

We use [Sentry](https://sentry.io) for crash reporting, but it is only enabled for the `full` flavor. This means:

- Crashes in the `minimal` flavor are **not tracked**.
- Developers relying on crash reports for debugging should focus on the `full` flavor.
