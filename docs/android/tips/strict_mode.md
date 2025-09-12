---
title: "StrictMode"
sidebar_label: "StrictMode"
---

## StrictMode in debug builds

StrictMode is enabled by default when you run the app in debug mode on Android. StrictMode helps you identify accidental disk or network access on the main thread, as well as other potential issues during development. For more information, see the [StrictMode documentation](https://developer.android.com/reference/android/os/StrictMode).

StrictMode also helps us migrate to new versions of the Android API by highlighting deprecated or problematic behaviors early in development.

The [VM policy](https://developer.android.com/reference/android/os/StrictMode.VmPolicy.Builder) is configured with the `death` penalty, and the [threading policy](https://developer.android.com/reference/android/os/StrictMode.ThreadPolicy.Builder) is set to `log`. Review the logs carefully while developing to spot and address any issues.

If you encounter a problem caused by StrictMode during development, you can temporarily disable it by setting the `noStrictMode` Gradle flag:

```bash
./gradlew app:assembleFullDebug -PnoStrictMode
```

If you need to disable StrictMode, open an issue on GitHub or reach out on Discord. This helps ensure the problem is tracked and does not impact other developers.
