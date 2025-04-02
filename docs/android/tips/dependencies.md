---
title: "Android dependencies"
sidebar_label: "Dependencies"
---

## Version catalog

We use the [version catalog](https://docs.gradle.org/current/userguide/version_catalogs.html) to manage all libraries directly used in the project. This is the **only allowed method** for adding dependencies. Adding a dependency outside of the catalog is strictly forbidden to maintain consistency and traceability.

### Benefits of using a version catalog

- **Centralized management**: All dependencies are defined in one place (`gradle/libs.versions.toml`), making it easier to track and update them.
- **Consistency**: Ensures that all modules use the same versions of shared dependencies.
- **Simplified updates**: Makes it easier to update dependencies across the entire project.

## Managing dependencies and lockfiles

This project utilizes Gradle's [dependency locking](https://docs.gradle.org/current/userguide/dependency_locking.html) feature to ensure consistent and reproducible builds by tracking the precise versions of all libraries used.

### Why use dependency locking

- **Reproducible builds**: Ensures that builds are consistent across different environments by locking the exact versions of all dependencies.
- **Avoids surprises**: Prevents unexpected updates to transitive dependencies that could break the build.

### Updating dependencies and lockfiles

When adding or updating a dependency in `gradle/libs.versions.toml`, it's crucial to also update the corresponding lockfiles. The lockfiles capture the exact versions of all direct and transitive dependencies.

To update the lockfiles, run the following command from the project root:

```bash
./gradlew alldependencies --write-locks
```

This command resolves all dependencies and updates the gradle.lockfile in each module.

:::info
If the version catalog is updated but the lockfiles are not updated, the CI pipeline will fail.
:::

## Automated dependency updates with Renovate

To streamline dependency management, we've integrated [Renovate](https://docs.renovatebot.com/) into the repository. Renovate automatically creates pull requests to update dependencies and the lockfiles.

### How Renovate works

- **Automated updates:** Renovate scans the project for outdated dependencies and creates pull requests to update them.
- **Lockfile updates:** Renovate ensures that lockfiles are updated alongside the dependencies.
- **Custom configuration:** Renovate is configured to respect the project's versioning policies and update strategies.

### Benefits of using Renovate

- **Saves time:** Automates the tedious process of checking for and updating dependencies.
- **Reduces risk:** Ensures that updates are applied consistently and tested through the CI pipeline.
- **Improves security:** Keeps dependencies up-to-date, reducing the risk of vulnerabilities.
