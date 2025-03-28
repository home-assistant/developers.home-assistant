---
title: "Android Targets"
sidebar_label: "Targets"
---

## Android Targets

This document outlines the various Android targets supported by the Home Assistant application. Each target has its own specific requirements and considerations.

## 📱 Application (Main Target)

The main target is based on the Gradle `:app` module. It supports a **minimum API level of 21**. This is the primary application used by most users.

## 🚗 Automotive

The Automotive target is also based on the `:app` module but includes specific manifest entries tailored for automotive use cases. It shares the same source code as the main application.

## 📺 TV

The application can be installed on Android TV, but the navigation experience is currently suboptimal. To provide a better experience, a dedicated Gradle module and improved navigation support are needed.

### Current Status:

- **Not officially supported**.
- The classic application can be installed but requires enhancements for a better user experience.

## ⌚ Wear OS

The Wear OS target brings Home Assistant functionality to wearable devices. It is a **dedicated application** but requires the mobile application for onboarding and connecting to a server.

### Key Notes

- Designed specifically for Wear OS devices.
- Onboarding must be completed via the mobile application.
