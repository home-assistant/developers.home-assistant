---
title: "Android architecture"
sidebar_label: "Architecture"
---

## Introduction

The Android project for Home Assistant started in 2019. Since then, the Android ecosystem has evolved significantly, and many contributors have shaped the project. As a result, you may encounter legacy code that does not adhere to current best practices. This documentation serves as the source of truth for the app's architecture and development practices.

Home Assistant has been a frontrunner in [PWA](https://en.wikipedia.org/wiki/Progressive_web_app) development, and this philosophy is reflected in the native application. The app's centerpiece is a [WebView](https://developer.android.com/reference/android/webkit/WebView), which integrates with Home Assistant's frontend. Over time, native capabilities have been added, such as background sensor data collection.

## Core principles

### Kotlin first

The entire codebase is written in [Kotlin](https://kotlinlang.org), ensuring modern, concise, and type-safe development.

### Android version support

- **Target SDK**: We aim to keep up with the latest Android SDK releases and test new versions as they are released.
- **Min SDK**: To ensure broad compatibility, the app supports Android [Lollipop](https://en.wikipedia.org/wiki/Android_Lollipop) (API 21).

## Application architecture

We follow Google's recommended [Android architecture](https://developer.android.com/topic/architecture) and draw inspiration from the [NowInAndroid repository](https://github.com/android/nowinandroid).

### Build logic

The project uses multiple Gradle modules. Shared logic is centralized in a separate Gradle project named `build-logic`, included in the main project via `includeBuild`.

### Common Gradle module

To share code across different applications, we use a common Gradle module named `:common`.

## UI development

### Native UI

All new UI components are built using [Jetpack Compose](https://developer.android.com/compose), ensuring a modern and declarative approach to UI development.

### Legacy UI

Some legacy XML layouts, `databinding`, and `viewbinding` still exist in the app. These should be replaced with Compose as part of ongoing modernization efforts.

### Theming

The app uses multiple themes to support both legacy XML and Compose-based UI. All new components should use `HomeAssistantAppTheme`, which is based on [Material Design](https://developer.android.com/develop/ui/compose/components).

## Key features

### Dependency injection (DI)

We use [Hilt](https://developer.android.com/training/dependency-injection/hilt-android) extensively for dependency injection, ensuring modular and testable code.

### Concurrency

All concurrency is handled using [Kotlin Coroutines](https://kotlinlang.org/docs/coroutines-overview.html), providing a structured and efficient way to manage asynchronous tasks.

### Services

We use [Foreground Services](https://developer.android.com/develop/background-work/services/fgs) for retrieving sensor values and uploading them to Home Assistant Core asynchronously.

### WebSocket

The app maintains a direct connection to Home Assistant Core's WebSocket using [OkHttp](https://square.github.io/okhttp/). This is essential for features like Assist and real-time discussions.

### REST API

Communication with Home Assistant's REST API is handled using [Retrofit](https://square.github.io/retrofit/), enabling seamless interaction with the backend.

### Local storage

- **Room**: User data is stored locally using [Room](https://developer.android.com/training/data-storage/room), which provides a robust database solution.
- **SharedPreferences**: For app-specific settings, we use [SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences) with an abstraction layer named `LocalStorage`.

### Deep linking

The app supports deep linking using `homeassistant://` URLs to navigate to specific parts of the app. For more details, refer to the [user documentation](https://companion.home-assistant.io/docs/integrations/url-handler/).

## Platform-specific features

### Automotive

The automotive application reuses the sources of the `:app` module, simplifying development.

### Wear OS

The Wear OS app communicates with the mobile app to retrieve credentials for the Home Assistant server and other configurations using the [Messaging API](https://developer.android.com/training/wearables/data/messages). It only works with the `full` flavor, as it requires Google Play Services. Once the initial setup is complete, all further communication is handled directly with Home Assistant through the WebSocket and the [webhook](../api/native-app-integration/sending-data) that is created for the app.
