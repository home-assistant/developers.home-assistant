---
title: "Android release process"
sidebar_label: "Release process"
---

## Android release process

This document outlines the steps to take an Android application from development on your machine to production for end users. It also covers the roles of CI/CD pipelines, internal testing, beta testing, and Google Play Store validation.

## Release workflow: from debug to production

### Development and debug builds

- During development, you typically build the **debug application** on your local machine.
- Once your changes are ready, you push a **Pull Request (PR)** to the repository.

### Continuous integration (CI)

- The CI system automatically:
  - Builds the application.
  - Runs linters and tests to ensure code quality.
- If the PR is approved and merged into the `main` branch:
  - The CI builds the **release application**.
  - The release build is pushed to the **internal tester group** on both the Google Play Store and Firebase.

:::note
You can download pre-built APKs for every commit on the `main` branch from the [GitHub Actions page](https://github.com/home-assistant/android/actions/workflows/onPush.yml).
:::

### Internal testing

- Internal testers validate the release build to ensure functionality.
- Every approved and merged PR is pushed to the internal beta channel on Play Store for immediate feedback. This is the only way to do real world testing for Android Auto/Automotive as the debug builds will not show up in an actual vehicle.
- Due to the app's complexity, not all features can be tested exhaustively during this phase.

### Weekly beta releases

- Every week at 9pm PST on Saturday, the latest version of the `main` branch is pushed to the **open beta** channel.
- On Friday or Saturday prior to the beta cut off above, update the beta change log highlighting new features and breaking changes (if applicable)
- Open beta users help test the application in real-world scenarios and report issues.

:::note
You can join the beta program directly through the [Google Play Store](https://play.google.com/apps/testing/io.homeassistant.companion.android).
:::

### Production release

If the beta version is stable and approved by maintainers, it is promoted to **production**, making it available to all users. The following steps need to be checked for each release:

- Update the change log to include all latest changes and the version number to the latest beta
- Uncheck the pre-release checkbox in Github for the latest beta
- Prepare companion docs PR removing all beta labels for the release, PR should be merged once Google approves the release
- Notify Community Manager and Android discord channel about the upcoming release and highlights for social media

:::note
You can find the app on the [Google Play Store](https://play.google.com/store/apps/details?id=io.homeassistant.companion.android).
:::

## Google Play Store validation

- Google validates applications when they are pushed to the **open beta** phase.
- Validation times can vary:
  - It may take more than a week in some cases.
  - Since releases are weekly, the previous beta release might still be under validation when a new beta is submitted. If this happens the previous beta is removed and not validated by Google.
- This delay does not block the release process but requires careful planning to ensure timely updates.
