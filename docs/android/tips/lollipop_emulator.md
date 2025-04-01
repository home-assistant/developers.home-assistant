---
title: "Test on lollipop emulator"
sidebar_label: "Lollipop emulator"
---

## Overview

This guide explains how to set up and test your application on an Android Lollipop emulator. It includes steps to create an AVD (Android Virtual Device) and update the outdated WebView to ensure compatibility with your app.

## Steps to Create an AVD

1. Open **Android Studio**.
2. Navigate to **Tools > Device Manager**.
3. Click on **Create Device**.
4. Select a device model (e.g., Pixel 2) and click **Next**.
5. Choose the **Lollipop (API 21)** system image and download it if necessary.
6. Complete the setup and click **Finish**.

## Look for the latest APK of the WebView

@Unfortunately, the WebView installed on the emulator is outdated and makes the app unusable. You need to find the newest APK of the WebView and follow the steps from this [Stackoverflow post](https://stackoverflow.com/a/79514205/3289338).
