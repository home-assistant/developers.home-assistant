---
title: "Leak Canary 🐤"
sidebar_label: "Leak Canary"
---

## How to Disable Leak Canary in Debug Builds

[LeakCanary](https://square.github.io/leakcanary/) is a powerful tool for detecting memory leaks in Android applications. However, there are scenarios where you might want to disable it, such as when preparing a debug build for performance testing or when it's not needed.

### Disabling LeakCanary via Gradle Command

You can disable LeakCanary manually by passing the `-PnoLeakCanary` flag in the Gradle command. For example:

```bash
./gradlew app:assembleFullDebug -PnoLeakCanary
```
This flag ensures that LeakCanary is excluded from the build.

### Disabling LeakCanary via properties file

Alternatively, you can disable LeakCanary by setting the noLeakCanary property in the gradle.properties file. This can be done at either the project level or the home level.

```properties
noLeakCanary=true
```

::::warning
If it is set you need to update the lockfile otherwise gradle complains about the deps being not used.
It can be done with

```bash
./gradlew alldependencies --write-locks
```

::::

## Best Practices for Using LeakCanary

- **Enable Only in Debug Builds:** LeakCanary should only be included in debug builds to avoid impacting performance in production builds.
- **Regularly Monitor Memory Leaks:** Use LeakCanary during development to identify and fix memory leaks early.
- **Document Known Leaks:** If a memory leak is caused by a third-party library and cannot be fixed immediately, document it for future reference.
- **Speak about it:** If a leak is reported don't hesitate to get in touch with other contributors on Discord about it.
