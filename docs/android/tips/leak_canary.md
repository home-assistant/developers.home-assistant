---
title: "LeakCanary 🐤"
sidebar_label: "LeakCanary"
---

## How to disable LeakCanary in debug builds

[LeakCanary](https://square.github.io/leakcanary/) is a powerful tool for detecting memory leaks in Android applications. However, there are scenarios where you might want to disable it, such as when preparing a debug build for performance testing or when it's not needed.

### Disabling LeakCanary via Gradle command

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
If you disable LeakCanary, you need to update the lockfile; otherwise, Gradle will complain about an issue with the dependencies.

[How to update lockfiles](dependencies#updating-dependencies-and-lockfiles).
::::

## Best practices for using LeakCanary

- **Regularly monitor memory leaks:** Use LeakCanary during development to identify and fix memory leaks early.
- **Document known leaks:** If a memory leak is caused by a third-party library and cannot be fixed immediately, document it for future reference.
+**Report leaks:** If a leak is reported by LeakCanary, open a GitHub issue.
