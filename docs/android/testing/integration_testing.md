---
title: "Android integration testing"
sidebar_label: "Integration testing"
---

## Why perform integration testing?

[Unit tests](/docs/android/unit_testing) are great and should be your primary choice when writing tests. However, integration testing ensures that the behavior of the application in a real Android environment is validated. Integration tests run on a real Android OS through an emulator, using the same JVM that will be used by end users.

### Testing on a real JVM

During development, you might only test on the latest Android OS version or your locally installed JVM, most likely JDK 21. However, keep in mind the following:

- Android API 21 only partially supports [Java 8 language features](https://developer.android.com/studio/write/java8-support).
- Android uses a dedicated [runtime](https://source.android.com/docs/core/runtime) that is different from the one used in your development environment (which is typically used to execute unit tests).

#### Concrete example

Consider the [Jackson library](https://github.com/FasterXML/jackson). Starting from version 2.14, it requires a minimum Android version of 26. Unfortunately, this error only arises at runtime, meaning the only way to catch it is through instrumentation tests or a crash reported by a user. You can see a concrete example of this issue in this [PR](https://github.com/home-assistant/android/pull/5108).

### UI or no UI?

Integration tests do not always involve displaying a UI. They are also used to test [foreground services](https://developer.android.com/develop/background-work/services/fgs), where no UI is displayed. In these cases, we only verify the data and the interaction with the system.

### Testing with the corresponding Home Assistant Core version

:::note
These tests are currently under development
:::

We aim to run integration tests against the latest version of Home Assistant Core. This ensures that the current code works seamlessly with the core version in a straightforward manner.

### Testing without Home Assistant Core

Most of our tests should not depend on Home Assistant Core to avoid introducing additional sources of error. These tests are designed to validate the behavior of the screen during user interactions. For this, we use the [Espresso](https://developer.android.com/training/testing/espresso) framework.

In this scenario, interactions with the core can be replaced using mocks with [mockk](https://mockk.io/) or, even better, fake objects to control the behavior.

## Flakiness in Android emulators

Android emulators are notoriously unreliable. Occasionally, a platform may fail for unknown reasons. The only solution is to restart the job. Note that only maintainers can re-run a job.

## Testing on Android 5 (API 21)

If your tests require the WebView, you may need to follow these [tips for the Lollipop emulator](/docs/android/tips/lollipop_emulator.md).
