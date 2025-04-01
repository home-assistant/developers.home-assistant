---
title: "Android Release Process"
sidebar_label: "Release Process"
---

## Android Release Process

This document outlines the steps to take an Android application from development on your machine to production for end users. It also covers the roles of CI/CD pipelines, internal testing, beta testing, and Google Play Store validation.

## Release Workflow: From Debug to Production

### Development and Debug Builds

- During development, you typically build the **debug application** on your local machine.
- Once your changes are ready, you push a **Pull Request (PR)** to the repository.

### Continuous Integration (CI)

- The CI system automatically:
  - Builds the application.
  - Runs linters and tests to ensure code quality.
- If the PR is approved and merged into the `main` branch:
  - The CI builds the **release application**.
  - The release build is pushed to the **internal tester group** on both the Google Play Store and Firebase.

### Internal Testing

- Internal testers validate the release build to ensure functionality.
- Due to the app's complexity, not all features can be tested exhaustively during this phase.

### Weekly Beta Releases

- Every week, the latest version of the `main` branch is pushed to the **open beta** channel.
- Open beta users help test the application in real-world scenarios and report issues.

### Production Release

- If the beta version is stable and approved by maintainers, it is promoted to **production**, making it available to all users.

## Google Play Store Validation

- Google validates applications when they are pushed to the **open beta** phase.
- Validation times can vary:
  - It may take more than a week in some cases.
  - Since releases are weekly, the previous beta release might still be under validation when a new beta is submitted. If this happens the previous beta is removed and not validated by Google.
- This delay does not block the release process but requires careful planning to ensure timely updates.

## Key Notes

- **Testing Coverage**: Internal testers focus on critical functionality, but open beta users provide broader coverage.
- **Release Cadence**: Weekly releases ensure a steady flow of updates, but Google validation delays can overlap releases.
- **CI/CD Automation**: Automating builds and tests ensures consistency and reduces manual effort.
