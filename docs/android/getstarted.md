---
title: "Android Get Started"
sidebar_label: "Get Started"
---

## Getting Started with Home Assistant Android Development

Welcome to the Home Assistant Android development guide! This document will help you set up your environment, fork the repository, and build your first app.

## Setting Up Your Development Environment

To get started, install the latest stable version of [Android Studio](https://developer.android.com/studio). This is the only tool you need to build the applications.

## Fork, Clone, and Create a Branch

### Fork the Repository

1. Open the [Home Assistant Android repository](https://github.com/home-assistant/android).
2. Click **Fork** to create your own copy of the repository.

> 💡 **Tip:** If you encounter any issues, refer to the [GitHub documentation on forking a repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

### Clone Your Forked Repository

Once you've forked the repository, clone it to your local machine using the following command:

```bash
git clone https://github.com/<your-github-username>/android.git
```

Alternatively, you can use Android Studio:

1. Go to `File -> New -> Project from Version Control...`.
2. Enter your repository URL and clone it.

### Create a Branch

Before making any changes, create a new branch with a meaningful name that reflects the work you are doing. For example:

```bash
git checkout -b feature/add-new-feature
```

> 💡 **Tip:** If you're new to Git, check out the [Git Branching Guide](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging). You can also create branches directly in Android Studio.

## Build Your First App

Once you have the repository cloned locally, you can build the app using Android Studio or the terminal.

### From Android Studio

1. Open the project in Android Studio.
2. Sync the Gradle files.
3. Click the green **Play** button in the top bar. Android Studio will automatically create an emulator and run the app for you.

### From the Terminal

:::info
You will need the `JAVA_HOME` environment variable set to a JDK. We are currently using the JDK 21.
:::

#### On macOS/Linux

```bash
./gradlew assembleDebug
```

#### On Windows

```powershell
gradlew.bat assembleDebug
```

## Firebase Setup

Firebase is used for notifications and distributing builds. If you don't need these features, you can use a mocked Firebase configuration.

### Setting Up a Real Firebase Project

1. Create a Firebase project at the [Firebase Console](https://console.firebase.google.com).
2. Add four Android apps to the project with the following package names:
   - `io.homeassistant.companion.android`
   - `io.homeassistant.companion.android.debug`
   - `io.homeassistant.companion.android.minimal`
   - `io.homeassistant.companion.android.minimal.debug`
3. Download the `google-services.json` file and place it in the following folders:
   - `/app`
   - `/automotive`
   - `/wear`

   > **Note:** The `google-services.json` file must contain client IDs for all the package names listed above. Without this, FCM push notifications will not work (only WebSocket notifications will).

4. (Optional) Follow our [Push Notification Guide](tips/push_notification) for additional setup instructions.

### Setting Up a Mock Firebase Project

If you don't need real Firebase functionality, you can use the mock configuration:

1. Copy the file located at `/.github/mock-google-services.json`.
2. Place it in the following folders:
   - `/app`
   - `/automotive`
   - `/wear`

## What's Next?

Now that you've built the app, explore the rest of the documentation to deepen your understanding of the project. A good starting point is the [Architecture Guide](architecture), which explains the general structure of the codebase.

## Need Help?

If you get stuck, don't hesitate to ask for help! Join our [Discord](https://discord.gg/c5DvZ4e) channel and head to **#Android** for assistance.
