---
title: "Targets"
sidebar_label: "Targets"
---

## Apple platform targets

The Home Assistant iOS repository is a multi-target workspace. A single change can affect more than the main app, so it helps to know the main surfaces in the project.

## Main app

The primary application target is the iPhone and iPad app. For local development, the usual entry point is the `App-Debug` scheme. The repository also contains `App-Beta` and `App-Release` schemes for release-oriented builds.

## Widgets and App Intents

The project includes widget and App Intent targets under `Sources/Extensions/Widgets` and `Sources/Extensions/AppIntents`.

These targets power Home Screen widgets, interactive controls, and system integrations that surface Home Assistant actions outside the main app.

## Apple Watch

Watch-related code lives in `Sources/Watch`, `Sources/WatchApp`, and watch-related extension code under `Sources/Extensions/Watch`.

Changes involving actions, notifications, complications, or shared configuration often need watch-specific validation.

## CarPlay

CarPlay functionality lives under `Sources/CarPlay`. This includes templates, list items, filtering, and action execution behavior for supported entities.

## Notification extensions

The repository contains dedicated notification targets for richer push handling:

- Notification service extension
- Notification content extension
- Push provider support

These targets matter when working on notifications, attachments, or command handling.

## Share and other extensions

The project also includes additional extensions such as:

- Share extension
- Matter extension

If your feature interacts with incoming content, home platform setup, or extension-safe shared code, check these targets too.

## macOS support

The repository also builds macOS artifacts in CI. `Sources/MacBridge` contains macOS-specific bridge code used by those builds.

Even if you are working on an iOS feature, shared code may also be compiled for Mac builds.

## Supporting packages

The repository includes standalone Swift packages that support the app ecosystem:

- `Sources/PushServer`
- `Sources/SharedPush`

These are tested separately from the main Xcode workspace when their code changes.
