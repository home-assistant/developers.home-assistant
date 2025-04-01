---
title: "Android Continuous Integration and Delivery"
sidebar_label: "Continuous Integration"
---

🚧🚧🚧 Under construction 🚧🚧🚧

## Android Continuous Integration and Delivery

This document outlines the Continuous Integration (CI) and Continuous Delivery (CD) processes for the Android project. We use **GitHub Actions** as our CI/CD platform, with multiple workflows configured to ensure code quality, automate builds, and streamline deployments.

## Overview

The main goals of our CI/CD process are:

- ✅ Validate that everything is working as expected.
- 🚨 Notify relevant people if something breaks.
- 🚀 Enable fully automated continuous delivery of applications.
- 🔄 Avoid duplication by extracting common code into reusable local actions under `.github/actions`.

## Versioning

We follow the same versioning convention as the core project, using [CalVer] (Calendar Versioning). This ensures consistency across all releases.

## Workflows

### On Pull Request

When a pull request (PR) is opened or updated, the `pr.yml` workflow is triggered. Its goals are:

- 🧹 Validate code compliance with our [linters](linter).
- 🔨 Ensure the code builds successfully.
- ✅ Run all tests to verify correctness.
- 📦 Persist generated APKs in the GitHub Actions tab for review.

If any step fails:

- The CI notifies the PR owner.
- The PR is blocked from being merged until the issues are resolved.
- Fixes must be committed, which automatically restarts the workflow.

:::note
Only one workflow runs at a time for a given PR. If multiple commits are pushed in quick succession, the CI cancels ongoing builds and processes only the latest commit.
:::

#### Debug Builds

To build the application in debug on CI, we use a mock Google services file located at `/.github/mock-google-services.json`.

### On Push to `main`

When a commit is pushed to the `main` branch, the `onPush.yml` workflow is triggered. Its goals are:

- 🌐 Download translations from [Lokalise](../translations).
- 📝 Generate release notes.
- 🔧 Build release variants of all applications.
- 📤 Deploy applications to Firebase.
- 🛒 Deploy to the internal track of the Play Store.
- 📦 Persist generated APKs in the GitHub Actions tab.
- 🔐 Inject secrets and files required for publishing.

We use [Fastlane](https://fastlane.tools/) to simplify deployment to different stores. All Fastlane configurations can be found in the `fastlane` folder.

:::note
This workflow can also be manually triggered with the `beta` flag to promote a build to the beta track on the stores.
:::

### Weekly Builds

Every Sunday at 4:00 AM, the `weekly.yml` workflow is triggered automatically. Its goals are:

- 🛠 Create a weekly GitHub pre-release.
- 🚀 Invoke the `onPush.yml` workflow with the `beta` flag set to `true`.

This ensures that a new version of the applications is pushed to the beta track on the Play Store every week.

### Monthly Version Tags

On the first day of every month, the `monthly.yml` workflow runs to create an initial version tag in the format `YYYY.MM.0`. This aligns with our [CalVer] versioning strategy.

### Releases

The `release.yml` workflow is triggered manually to promote the latest beta build to production. This ensures that only stable and tested builds are released to end users.

#### Release on F-Droid

The [F-Droid](https://f-droid.org) store builds the applications themselves when we push a GitHub release. This process uses [metadata](https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/io.homeassistant.companion.android.minimal.yml).

:::warning
We do not guarantee when the applications will be available on F-Droid after a release. You can find the app [here](https://f-droid.org/packages/io.homeassistant.companion.android.minimal/).
:::

## Summary of Workflows

| Workflow         | Trigger                     | Goals                                                                 |
|-------------------|-----------------------------|----------------------------------------------------------------------|
| `pr.yml`         | On PR open or update        | Lint, build, test, and persist APKs.                                |
| `onPush.yml`     | On push to `main`         | Build, deploy, and publish to Firebase and Play Store.              |
| `weekly.yml`     | Every Sunday at 4:00 AM     | Create pre-release and push beta builds to Play Store.              |
| `monthly.yml`    | First day of the month      | Create initial version tag (`YYYY.MM.0`).                           |
| `release.yml`    | Manual trigger              | Promote beta builds to production.                                  |

---

## Notes and Best Practices

- 🛠 Extract common code into reusable actions under `.github/actions` to avoid duplication.
- 🕒 Be mindful of workflow triggers to avoid unnecessary resource usage.
- 🔒 Ensure secrets and sensitive files are properly managed and injected during workflows.

[CalVer]: https://calver.org/