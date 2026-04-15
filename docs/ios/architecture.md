---
title: "iOS architecture"
sidebar_label: "Architecture"
---

## Introduction

Home Assistant iOS is a multi-target Apple platform project. It started as a companion app centered around a web experience and has grown into a hybrid codebase with native onboarding, sensors, widgets, Apple Watch support, CarPlay, App Intents, and notification-driven features.

The repository combines app-specific code, shared platform code, extensions, and a small Swift server component in a single workspace.

## Core principles

### Multi-target by design

The repository is organized to share as much logic as possible across targets while still allowing platform-specific implementations where needed.

### Hybrid UI stack

The project uses both **SwiftUI** and **UIKit**. Newer flows and components increasingly use SwiftUI, while legacy and platform-specific integrations still rely on UIKit and other Apple frameworks directly.

### Shared infrastructure

Cross-cutting concerns such as database access, networking, design system pieces, notifications, widgets, and shared models live in common modules so multiple targets can reuse them.

## Repository structure

### `Sources/App`

This contains iOS app-specific functionality such as onboarding, settings, scenes, cameras, notifications, web/frontend integration, kiosk features, and utilities.

### `Sources/Shared`

This is the heart of the shared codebase. It includes:

- API and networking support
- Database code built around GRDB
- Shared models and domain logic
- Design system utilities
- Widget and notification support
- Location, Assist, and service integrations

### `Sources/Extensions`

This area contains code for extensions and system integrations, including:

- Widgets
- App Intents
- Share extension
- Notification service and content extensions
- Matter support
- Push provider support

### Other important directories

- `Sources/CarPlay`: CarPlay templates and feature logic
- `Sources/Watch` and `Sources/WatchApp`: Apple Watch communication and watch app code
- `Sources/Thread`: Thread credential management and sharing flows
- `Sources/MacBridge`: macOS-specific bridge code used for Mac builds
- `Sources/PushServer` and `Sources/SharedPush`: Swift package-based server and shared push logic
- `Tests`: App, shared, UI, and widget tests
- `fastlane`: Linting, testing, versioning, and build automation

## Key technologies

The current codebase makes heavy use of:

- **Swift**
- **Xcode workspaces and schemes**
- **CocoaPods**
- **Fastlane**
- **WKWebView** for frontend integration
- **SwiftUI** and **UIKit**
- **App Intents** and **WidgetKit**
- **GRDB** for database access
- **HAKit** for Home Assistant API interactions

## Architectural patterns in practice

### Shared environment access

The project uses a shared `Current` environment pattern in many places to access dependencies and services. The codebase treats this carefully enough that SwiftLint has a custom rule to prevent casual reassignment.

### Extensions are first-class

Widgets, notifications, CarPlay, watchOS support, and App Intents are not afterthoughts. Many changes need to consider extension-safe code, shared storage, and cross-target reuse from the start.

### App plus platform surfaces

A feature may touch more than the main app. For example, an entity action could appear in the app UI, widgets, Apple Watch, App Intents, or CarPlay. It is worth checking whether a change belongs in `Sources/App`, `Sources/Shared`, or an extension target before you start coding.

## How to navigate the codebase

If you are new to the repository, a good way to orient yourself is:

1. Start in `Sources/App` if the feature is clearly app-only.
2. Move shared logic into `Sources/Shared` when multiple targets need it.
3. Check `Sources/Extensions`, `Sources/CarPlay`, and `Sources/Watch` when behavior crosses platform surfaces.
4. Look in `Tests/App` and `Tests/Shared` for examples before adding new code.
