---
title: "Architecture"
sidebar_label: "Architecture"
---

Home Assistant iOS is a multi-target Apple platform project. It started as a companion app centered around a web experience and has grown into a hybrid codebase with native onboarding, sensors, widgets, Apple Watch support, CarPlay, App Intents, and notification-driven features.

The repository combines app-specific code, shared platform code, extensions, and a small Swift server component in a single workspace.

## Core principles

### Multi-target by design

The repository is organized to share as much logic as possible across targets while still allowing platform-specific implementations where needed. Cross-cutting concerns such as database access, networking, design system pieces, notifications, widgets, and shared models live in common modules so multiple targets can reuse them. See the [targets guide](/docs/apple/targets) for an overview of each surface.

### Hybrid UI stack

The project uses both **SwiftUI** and **UIKit**. Newer flows and components increasingly use SwiftUI, while legacy and platform-specific integrations still rely on UIKit and other Apple frameworks directly.

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

- [**Swift**](https://www.swift.org/)
- **Xcode workspaces and schemes**
- [**CocoaPods**](https://cocoapods.org/)
- [**Fastlane**](https://fastlane.tools/)
- [**WKWebView**](https://developer.apple.com/documentation/webkit/wkwebview) for frontend integration
- [**SwiftUI**](https://developer.apple.com/xcode/swiftui/) and [**UIKit**](https://developer.apple.com/documentation/uikit)
- [**App Intents**](https://developer.apple.com/documentation/appintents) and [**WidgetKit**](https://developer.apple.com/documentation/widgetkit)

## Notable third-party dependencies

Beyond Apple frameworks, the app relies on several open-source libraries. The complete list lives in the [`Podfile`](https://github.com/home-assistant/iOS/blob/main/Podfile), but these are the most commonly touched:

- [**HAKit**](https://github.com/home-assistant/HAKit) — Home Assistant API client (WebSocket and REST)
- [**GRDB.swift**](https://github.com/groue/GRDB.swift) — SQLite database access
- [**Alamofire**](https://github.com/Alamofire/Alamofire) — HTTP networking
- [**PromiseKit**](https://github.com/mxcl/PromiseKit) — promise-based async flows
- [**Starscream**](https://github.com/daltoniam/Starscream) — WebSocket transport used by HAKit (we track a fork with a specific fix)
- [**SFSafeSymbols**](https://github.com/SFSafeSymbols/SFSafeSymbols) — type-safe access to SF Symbols
- [**KeychainAccess**](https://github.com/kishikawakatsumi/KeychainAccess) — keychain storage helper
- [**Eureka**](https://github.com/xmartlabs/Eureka) — form-based UI in legacy screens
- [**ObjectMapper**](https://github.com/tristanhimmelman/ObjectMapper) — JSON mapping in legacy models
- [**XCGLogger**](https://github.com/DaveWoodCom/XCGLogger) — logging
- [**Improv-iOS**](https://github.com/home-assistant/Improv-iOS) — Improv Bluetooth onboarding

## Architectural patterns in practice

### Shared environment access

The project uses a shared `Current` environment pattern (see [How to control the world](https://www.pointfree.co/blog/posts/21-how-to-control-the-world)) in many places to access dependencies and services. In practice, this means a single `Current` value groups the dependencies the app needs, which makes them easy to read from anywhere and easy to swap out in tests. The codebase treats this carefully enough that SwiftLint has a custom rule to prevent casual reassignment.

### Extensions are first-class

We encourage you to take widgets, notifications, CarPlay, watchOS support, and App Intents into account from the start. The app needs to work well across all these surfaces while maintaining code quality, so changes often need to consider extension-safe code, shared storage, and cross-target reuse.

### App plus platform surfaces

A feature may touch more than the main app. For example, an entity action could appear in the app UI, widgets, Apple Watch, App Intents, or CarPlay. It is worth checking whether a change belongs in `Sources/App`, `Sources/Shared`, or an extension target before you start coding.

## How to navigate the codebase

The diagram below shows the actual Xcode shipping products on top and the `Sources/*` directories that feed into each one. Read it in either direction:

- **Starting from a product** (for example, the Apple Watch app): follow the arrows out to see every source directory that ships in it.
- **Starting from a source directory** (for example, `Shared`): follow the inbound arrows to see every product that consumes it.

A few pieces live outside the main workspace:

- [`Sources/PushServer`](https://github.com/home-assistant/iOS/tree/main/Sources/PushServer) is a standalone Swift package for the server-side push relay.
- [`Sources/SharedTesting`](https://github.com/home-assistant/iOS/tree/main/Sources/SharedTesting) is a test-only framework used by the test targets.

If you are new to the repository, a good way to orient yourself is:

1. Start in `Sources/App` to see how the main iPhone and iPad app is structured. Most features originate here.
2. Place logic that multiple targets need in `Sources/Shared` so it can be reused by extensions, watch, and CarPlay.
3. For target-specific features (for example a watch-only or widget-only change), look in `Sources/Extensions`, `Sources/CarPlay`, or `Sources/Watch` for the matching surface.
4. Look in `Tests/App` and `Tests/Shared` for examples before adding new code.
