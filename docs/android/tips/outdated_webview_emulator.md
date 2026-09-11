---
title: "Test on an emulator with an outdated WebView"
sidebar_label: "Outdated WebView emulator"
---

## Overview

The app's centerpiece is a [WebView](https://developer.android.com/reference/android/webkit/WebView) that renders the Home Assistant frontend. Emulator system images ship with the WebView version that was current when the image was published, and unlike a real device, an emulator never receives WebView updates from the Play Store. The older the API level you emulate, the older that WebView is.

If the WebView is too old for the frontend you are running, the frontend fails to render or the WebView crashes outright. You are most likely to hit this on the oldest API levels the app still supports.

## Updating the WebView

Download a newer WebView APK and install it on the emulator, following the instructions in this [StackOverflow post](https://stackoverflow.com/a/79514205/3289338).

## Building a compatible frontend

If you are building your own frontend, set the `ES5` flag to `1` during the build process. This produces a legacy build that an older WebView can run:

```bash
ES5=1 script/develop
```
