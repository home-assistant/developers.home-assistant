---
title: "Continuous integration"
sidebar_label: "Continuous integration"
---

The Home Assistant iOS repository uses **GitHub Actions** together with **Fastlane** for linting, testing, building, localization updates, and distribution.

## Main CI workflow

CI runs on pull requests and pushes to `main`.

## Linting jobs

On every pull request, CI runs the same linters described in the [code style guide](/docs/apple/codestyle):

- Check Swift formatting with SwiftFormat
- Lint Swift code with SwiftLint, including the repository's custom rules
- Lint Ruby (Fastlane) code with RuboCop
- Lint YAML files (workflows and configuration)

These run on Linux in containers, which keeps style checks fast and independent from the macOS build environment.

## Pull request safety checks

The repository has additional pull request-only checks:

### SwiftLint disable detection

If a PR adds new `// swiftlint:disable` lines, CI comments on the pull request so maintainers can review whether that suppression is necessary.

### Unused localization detection

CI runs `Tools/detect_unused_strings.py` and comments on pull requests when unused localized strings are found.

## Test job

The `test` job runs on macOS and uses:

- the current CI Xcode version
- Bundler for Ruby dependencies
- CocoaPods for Apple platform dependencies
- `bundle exec fastlane test`

The default Fastlane test lane runs the `Tests-Unit` scheme in `HomeAssistant.xcworkspace` on the simulator configured for CI. For the exact Xcode and simulator versions, refer to [`ci.yml`](https://github.com/home-assistant/iOS/blob/main/.github/workflows/ci.yml).

CI also uploads:

- Code coverage from the `Tests-Unit.xcresult` bundle
- Test logs and crash diagnostics
- A simulator `.app` artifact for quick validation and frontend-only testing

## Distribution workflow

The `distribute.yml` workflow runs on pushes to `main` and on manual dispatch by maintainers with write access to the repository. It builds:

- iOS App Store artifacts
- macOS artifacts, including Developer ID and App Store packaging

Those builds use Fastlane lanes for signing, archiving, export, notarization, and upload to Apple services.

## Other workflows

### Localization updates

`download_localized_strings.yml` runs on a schedule and can also be triggered manually by maintainers with write access to the repository. It syncs localized strings with Lokalise and opens a pull request when updates are available.

### Push server tests

`push_ci.yml` runs `swift test` for changes under `Sources/PushServer/**`.

### Version bumps

`set_version.yml` updates `Configuration/Version.xcconfig` through Fastlane and opens a pull request with the version change.

## What this means for you

CI validates more than just compilation: style, strings, and artifacts are part of the review loop too. See the [code style guide](/docs/apple/codestyle) for linting and the [get started guide](/docs/apple/get_started) for running tests locally before pushing.
