---
title: "Test on lollipop emulator"
sidebar_label: "Lollipop emulator"
---

## Overview

To test the app on an Android emulator running Lollipop (Android API 21), you need to update the outdated WebView to ensure compatibility. Without this update, the WebView will crash.

## Updating the WebView

To update the WebView, download the latest WebView APK and follow the instructions provided in this [StackOverflow post](https://stackoverflow.com/a/79514205/3289338).

If you are building your own frontend, set the `ES5` flag to `1` during the build process. This ensures compatibility with the older WebView.

```bash
ES5=1 script/develop
```
