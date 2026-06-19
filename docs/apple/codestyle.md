---
title: "Code style"
sidebar_label: "Code style"
---

## Why enforcing code style matters

Consistent formatting and linting reduce review noise and make it easier for maintainers to focus on behavior, architecture, and edge cases instead of style nits.

## Tooling used in the repository

The iOS project uses several automated checks:

- **SwiftFormat** for Swift formatting
- **SwiftLint** for Swift linting and project-specific rules
- **RuboCop** for Fastlane and Ruby code
- **Yamllint** for workflow and other YAML files

These run in [pull request](/docs/apple/ci) checks and should be run locally before you open or update a PR.

## Running the checks locally

Run all default linting checks:

```bash
bundle exec fastlane lint
```

Apply supported autocorrections:

```bash
bundle exec fastlane autocorrect
```

## Repository-specific linting details

### SwiftFormat

SwiftFormat is configured through `.swiftformat`. The repo currently targets Swift 5.8 formatting rules and excludes generated or external content such as `Pods`, `vendor`, resources, and `fastlane`.

### SwiftLint

SwiftLint is configured through `.swiftlint.yml` and uses an allowlist of active rules instead of enabling every default rule.

The configuration also includes custom rules, for example:

- Prevent assigning directly to `Current.*` outside approved places
- Prefer `SFSafeSymbols` helpers over raw system symbol strings

### `swiftlint:disable`

Be conservative with `swiftlint:disable`. CI includes a pull request check that comments when new disable directives are added, so every suppression should be intentional and justified.

## General guidance

- Prefer small, well-named types and functions.
- Keep shared code in shared modules instead of duplicating logic across targets.
- Avoid introducing target-specific assumptions into extension-safe or shared code.
- Make changes that are easy to test in isolation.

## Dependencies and generated code

- Do not edit files under `Pods`. This directory is generated from the `Podfile` in the repository root and is refreshed by `bundle exec pod install`.
- Be careful around generated or localization-related files; some are maintained by scripts and workflows. Generated files usually state so in a header comment at the top of the file (for example, `// This file is auto-generated`) and localization files live alongside `.strings` and `.xcstrings` resources.
- When changing Ruby or workflow automation, make sure the related lint checks still pass.
