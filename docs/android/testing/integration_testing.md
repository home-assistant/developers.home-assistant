---
title: "Android Integration Testing"
sidebar_label: "Integration Testing"
---

🚧🚧🚧 Under Construction 🚧🚧🚧

## Why Perform Integration Testing?

[Unit tests](unit_testing) are great and should be your primary choice when writing tests. However, integration testing ensures that the behavior of the application in a real Android environment is validated. Integration tests run on a real Android OS through an emulator, using the same JVM that will be used by end users.

### Testing on a Real JVM

Some libraries we use have specific requirements, such as a minimum Java version above 8. Since our application targets Android API 21, which uses Java 8, these libraries cannot always be used. 

During development, you might only test on the latest Android OS version, which uses a Java version above 8. If no one catches this during the review process, users on Android API 21 may encounter crashes.

A concrete example is the [Jackson library](https://github.com/FasterXML/jackson). Starting from version 2.14, it requires a minimum Android version of 26. Unfortunately, such errors only arise at runtime, so the only way to catch them is through instrumentation tests. You can see the concrete example on this [PR](https://github.com/home-assistant/android/pull/5108).

### UI or No UI?

Integration tests do not always involve displaying a UI. They are also used to test [foreground services](https://developer.android.com/develop/background-work/services/fgs), where no UI is displayed. In these cases, we only verify the data and the interaction with the system.

### Testing with the Corresponding Home Assistant Core Version

🚧🚧🚧 Under Construction 🚧🚧🚧

We aim to run integration tests against the corresponding version of Home Assistant Core. This ensures that the current code works seamlessly with the core version in a straightforward manner.

### Testing Without Home Assistant Core

🚧🚧🚧 Under Construction 🚧🚧🚧

Most of our tests should not depend on Home Assistant Core to avoid introducing additional sources of error. These tests are designed to validate the behavior of the screen during user interactions. For this, we use the [Espresso](https://developer.android.com/training/testing/espresso) framework.

In this scenario, interactions with the core can be replaced using mocks with [mockk](https://mockk.io/) or, even better, fake objects to control the behavior.

## Flakiness in Android Emulators

Android emulators are notoriously unreliable. Occasionally, a platform may fail for unknown reasons. The only solution is to restart the job. Note that only maintainers can re-run a job.

## Testing on Android 5 (API 21)

If your tests require the WebView, you may need to follow these [tips for the Lollipop emulator](../tips/lollipop_emulator.md).
