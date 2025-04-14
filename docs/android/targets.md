---
title: "Android targets"
sidebar_label: "Targets"
---

## Android targets

This document outlines the various Android targets supported by the Home Assistant application. Each target has its own specific requirements and considerations.

## 📱 Application (main target)

The main target is based on the Gradle `:app` module. It supports a **minimum API level of 21**. This is the primary application used by most users.

## 🚗 Automotive

The Automotive target is also based on the `:app` module but includes specific manifest entries tailored for automotive use cases. It shares the same source code as the main application and supports a **minimum API level of 29**.

## 📺 TV

The application can be installed on Android TV, although the navigation experience is currently suboptimal. To provide a better experience, a dedicated Gradle module and improved navigation support are needed.

## ⌚ Wear OS

The Wear OS target brings Home Assistant functionality to wearable devices. It supports a **minimum API level of 26**. It is a **dedicated application** however it requires the mobile application for onboarding and connecting to a server.
