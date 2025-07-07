---
title: "Strict mode"
sidebar_label: "Strict mode"
---

## Strict mode in debug builds

Strict Mode is enabled by default when you run the app in debug mode on Android. Strict Mode helps you identify accidental disk or network access on the main thread, as well as other potential issues during development. For more information, see the [StrictMode documentation](https://developer.android.com/reference/android/os/StrictMode).

Strict Mode also helps us migrate to new versions of the Android API by highlighting deprecated or problematic behaviors early in development.

The [VM policy](https://developer.android.com/reference/android/os/StrictMode.VmPolicy.Builder) is configured with the `death` penalty, and the [threading policy](https://developer.android.com/reference/android/os/StrictMode.ThreadPolicy.Builder) is set to `log`. Review the logs carefully while developing to spot and address any issues.

If you encounter a problem caused by Strict Mode during development, you can temporarily disable it by setting the `noStrictMode` Gradle flag:

```bash
./gradlew app:assembleFullDebug -PnoStrictMode
```

If you need to disable Strict Mode, open an issue on GitHub or reach out on Discord. This helps ensure the problem is tracked and does not impact other developers.
