---
title: "Android Dependencies"
sidebar_label: "Dependencies"
---

## Version Catalog

We use the [version catalog](https://docs.gradle.org/current/userguide/version_catalogs.html) to manage all libraries directly used in the project. This is the **only allowed method** for adding dependencies. Adding a dependency outside of the catalog is strictly forbidden to maintain consistency and traceability.

### Benefits of Using a Version Catalog

- **Centralized Management**: All dependencies are defined in one place (`gradle/libs.versions.toml`), making it easier to track and update them.
- **Consistency**: Ensures that all modules use the same versions of shared dependencies.
- **Simplified Updates**: Makes it easier to update dependencies across the entire project.

## Managing Dependencies and Lockfiles

This project utilizes Gradle's [dependency locking](https://docs.gradle.org/current/userguide/dependency_locking.html) feature to ensure consistent and reproducible builds by tracking the precise versions of all libraries used.

### Why Use Dependency Locking

- **Reproducible Builds**: Ensures that builds are consistent across different environments by locking the exact versions of all dependencies.
- **Avoids Surprises**: Prevents unexpected updates to transitive dependencies that could break the build.

### Updating Dependencies and Lockfiles

When adding or updating a dependency in `gradle/libs.versions.toml`, it's crucial to also update the corresponding lockfiles. The lockfiles capture the exact versions of all direct and transitive dependencies.

To update the lockfiles, run the following command from the project root:

```bash
./gradlew alldependencies --write-locks
```

This command resolves all dependencies and updates the gradle.lockfile in each module.

## Best Practices for Managing Dependencies

- **Review Updates Carefully:** Always review dependency updates to ensure they don't introduce breaking changes.
- **Test Thoroughly:** After updating dependencies, run all tests to verify that the changes don't break existing functionality.
- **Keep Dependencies Up-to-Date:** Regularly update dependencies to benefit from bug fixes, performance improvements, and new features.

## Automated Dependency Updates with Renovate

To streamline dependency management, we've integrated [Renovate](https://docs.renovatebot.com/) into the repository. Renovate automatically creates pull requests to update dependencies and the lockfiles.

### How Renovate Works

- **Automated Updates:** Renovate scans the project for outdated dependencies and creates pull requests to update them.
- **Lockfile Updates:** Renovate ensures that lockfiles are updated alongside the dependencies.
- **Custom Configuration:** Renovate is configured to respect the project's versioning policies and update strategies.

### Benefits of Using Renovate

- **Saves Time:** Automates the tedious process of checking for and updating dependencies.
- **Reduces Risk:** Ensures that updates are applied consistently and tested through the CI pipeline.
- **Improves Security:** Keeps dependencies up-to-date, reducing the risk of vulnerabilities.
