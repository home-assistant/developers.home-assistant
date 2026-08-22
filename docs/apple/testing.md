---
title: "Testing"
sidebar_label: "Testing"
---

## Why tests matter

The Home Assistant iOS app covers multiple targets and platforms. Tests help ensure stable behavior as contributors change shared logic, onboarding, widgets, notifications, watch features, and integrations with Home Assistant.

## Default test command

To run the default tests in your local environment, execute:

```bash
bundle exec fastlane test
```

This runs the `Tests-Unit` scheme in `HomeAssistant.xcworkspace` on the simulator configured by the local Fastlane test lane.

## Test layout

The repository contains several test areas:

- `Tests/App`: app-specific behavior
- `Tests/Shared`: shared logic, models, database, sensors, notifications, and utilities
- `Tests/UI`: UI automation tests
- `Tests/Widgets`: widget-focused and snapshot-style tests

## Types of tests in the repository

### Unit and feature tests

Most contributor changes should come with targeted tests in `Tests/App` or `Tests/Shared`. These are the tests run by the default CI test lane.

### UI tests

UI tests live under `Tests/UI`. Use them when a behavior is best validated through user interaction instead of isolated logic.

### Snapshot and widget tests

The repository includes widget and snapshot-oriented tests, including stored snapshots under `Tests/Widgets/__Snapshots__`. If you intentionally change a widget or visual output, review snapshot updates carefully.

### Push server tests

Changes under `Sources/PushServer` should also be validated with:

```bash
cd Sources/PushServer
swift test
```

## Good testing habits

- Keep tests focused on one behavior.
- Prefer deterministic tests over timing-sensitive ones.
- Add coverage where regressions are likely, especially in shared code.
- When changing cross-target behavior, think beyond the main app and add tests close to the shared logic when possible.

## Running tests from Xcode

In Xcode, run the relevant test scheme from **HomeAssistant.xcworkspace**:

- **Tests-Unit** for the main automated suite
- **Tests-UI** for UI automation coverage

Using the same workspace and schemes as CI reduces surprises later.
