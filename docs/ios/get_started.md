---
title: "iOS get started"
sidebar_label: "Get started"
---

## Getting started with Home Assistant iOS development

This guide walks through the fastest path to cloning the repository, installing dependencies, configuring local signing, and running the app.

## Requirements

Before you begin, install:

- [Xcode 26.2 or later](https://developer.apple.com/xcode/)
- [CocoaPods](https://cocoapods.org/)
- Ruby 3.1 with either Homebrew, `rbenv`, or `mise`

The project uses **Bundler** for Ruby tooling and **CocoaPods** for Apple platform dependencies.

## Fork, clone, and create a branch

### Fork the repository

1. Open the [Home Assistant iOS repository](https://github.com/home-assistant/iOS).
2. Click **Fork** to create your own copy.

### Clone your fork

```bash
git clone https://github.com/<your-github-username>/iOS.git
cd iOS
```

### Create a branch

Create a branch before making changes:

```bash
git checkout -b feature/my-change
```

## Install dependencies

Choose one Ruby setup that works for you, then install gems and pods.

### Example with Homebrew Ruby

```bash
brew install ruby@3.1 cocoapods
$(brew --prefix)/opt/ruby@3.1/bin/bundle install
$(brew --prefix)/opt/ruby@3.1/bin/bundle exec pod install --repo-update
```

### Example with `mise`

```bash
brew install mise
mise install
bundle install
bundle exec pod install --repo-update
```

If you already have a working Ruby environment, `bundle install` followed by `bundle exec pod install --repo-update` is enough.

## Configure local code signing

Debug builds use automatic provisioning, but you still need local overrides because the app uses several entitlements.

Create `Configuration/HomeAssistant.overrides.xcconfig` and add:

```xcconfig
DEVELOPMENT_TEAM = YourTeamID
BUNDLE_ID_PREFIX = some.bundle.prefix
```

- `DEVELOPMENT_TEAM` is your Apple developer team identifier.
- `BUNDLE_ID_PREFIX` should be a prefix you control so Xcode can create local provisioning profiles.

This file is ignored by Git and should stay local.

## Open and run the app

After dependency installation finishes:

1. In Xcode, open **HomeAssistant.xcworkspace**.
2. In the scheme picker, select **App-Debug**.
3. In the destination selector, choose an iOS simulator or development device.
4. In Xcode, build and run.

**App-Debug** is the normal entry point for local development.

## Useful local commands

Run repo quality checks:

```bash
bundle exec fastlane lint
```

Run autocorrect on supported issues:

```bash
bundle exec fastlane autocorrect
```

Run the default automated test suite:

```bash
bundle exec fastlane test
```

## Testing just the frontend

If you only want to validate frontend changes, you can install the simulator app artifact produced by CI and debug the embedded WebView with Safari Web Inspector. The repository README documents that workflow in more detail.

## What's next?

- Read the [architecture guide](/docs/ios/architecture) for the codebase layout.
- Review the [code style guide](/docs/ios/codestyle) before opening a pull request.
- Learn how CI works in the [continuous integration guide](/docs/ios/ci).
