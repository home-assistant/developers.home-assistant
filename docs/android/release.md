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
- Every approved and merged PR is pushed to the internal beta channel on Google Play Store for immediate feedback. This is the only way to do real‑world testing for Android Auto/Automotive, as the debug builds will not show up in an actual vehicle.
- Due to the app's complexity, not all features can be tested exhaustively during this phase.

### Weekly beta releases

- Every Saturday at 9pm PST, the latest `main` build is pushed to the **open beta** channel.
- Before that cutoff (Friday or Saturday), update the beta changelog to highlight new features and breaking changes.
- Open beta users help test the application in real-world scenarios and report issues.

:::note
You can join the beta program directly through the [Google Play Store](https://play.google.com/apps/testing/io.homeassistant.companion.android).
:::

### Production release

If the beta version is stable and approved by maintainers, it is promoted to **production**, making it available to all users. The detailed checklist is described in [Release process (promoting beta to prod)](#release-process-promoting-beta-to-prod) below.

:::note
You can find the app on the [Google Play Store](https://play.google.com/store/apps/details?id=io.homeassistant.companion.android).
:::

## Google Play Store validation

- Google validates applications when they are pushed to the **open beta** phase.
- Validation times can vary:
  - It may take more than a week in some cases.
  - Since releases are weekly, the previous beta release might still be under validation when a new beta is submitted. If this happens the previous beta is removed and not validated by Google.
- This delay does not block the release process but requires careful planning to ensure timely updates.

## Release process (promoting beta to prod)

The promotion is performed by a maintainer following this checklist:

### Before promoting

- Wait a few days after the beta has been released to give beta users time to catch regressions.
- Check that the in-app changelog (`app/src/main/res/xml/changelog_master.xml`) is up to date and that its version matches the beta being promoted. The version bump is automated through a PR created by the `prepareNextRelease.yml` workflow (see [CI documentation](/docs/android/ci#on-pre-release-or-monthly-tag)), but the content should be verified manually.
- Open the Sentry dashboard and look for any abnormally high number of issues on the beta version.
- Open the [Google Play Console](https://play.google.com/console) and look for any anomalies reported (crashes, ANRs, Android vitals).
- Prepare a [companion docs](https://github.com/home-assistant/companion.home-assistant) PR removing all beta labels for the features shipped in this release.

### Promoting

- Edit the latest beta release on [GitHub](https://github.com/home-assistant/android/releases): keep the generated list of all commits, but manually add a **Highlights of this release** section on top of it matching the content of the in-app changelog XML file (see [2026.6.1](https://github.com/home-assistant/android/releases/tag/2026.6.1) for an example), uncheck the **pre-release** checkbox, and set it as the **latest** release.
- Unchecking the pre-release checkbox triggers the [`release.yml` workflow](/docs/android/ci#releases) automatically, which uses Fastlane to promote the beta track to production on the Play Store for the mobile, Wear OS, and Automotive apps.
- Wait for Google approval (this usually takes a few days).

### Other stores

The Play Store promotion only covers the `full` flavor. The other stores are updated as follows:

- Send the automotive `minimal` flavor to the Harman Ignite store.
- Manually submit the release for review in the [Amazon developer console](https://developer.amazon.com/apps-and-games/console/apps/list.html). The APK and changelogs were already uploaded when the beta was created via the `prep_amazon` Fastlane lane in the `onPush.yml` workflow.
- Release the `minimal` flavor on the Meta Quest store.
- F-Droid picks up the release automatically after a few days by building from the GitHub release (see [Release on F-Droid](/docs/android/ci#release-on-f-droid)).

### After the release

- Update the GitHub release notes with the CVE disclosures, if any security issues were fixed in this release.
- Once the release is available on the Play Store, merge the companion docs PR that removes the beta labels.
