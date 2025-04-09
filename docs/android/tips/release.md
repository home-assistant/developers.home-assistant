---
title: "Build for release"
sidebar_label: "Build for release"
---

:::warning
Ensure the keystore is securely stored and not included in version control. It also applies for the credentials.
:::

## Building for publishing

To build the app for publishing, you need to sign it. Follow these steps:

### Step 1: Create or use an existing keystore

Before building the app, you must have a keystore. You can either create a new one or use an existing keystore.

#### Creating a keystore

You can create a keystore directly from Android Studio:

1. Go to **Menu** > **Build** > **Generate Signed APK**.
2. Select the option to create a new keystore.
3. **Remember the passwords and the key alias** for future use.

#### Using an existing keystore

If you already have a keystore, ensure it is named `release_keystore.keystore` and placed in the following folders:
- `app`
- `wear`

Alternatively, you can specify a custom location by setting the `KEYSTORE_PATH` environment variable.

---

### Step 2: Build the app

You can build the app using either Android Studio or the command line (CLI).

#### From Android Studio

1. Open Android Studio.
2. Go to **Menu** > **Build** > **Generate Signed APK**.
3. Select the keystore you created or an existing one.
4. Follow the steps to build the app.

#### From the CLI

1. **Set environment variables**  
   Define the following environment variables used in `app/build.gradle.kts`:
   - `KEYSTORE_PASSWORD`
   - `KEYSTORE_ALIAS`
   - `KEYSTORE_ALIAS_PASSWORD`
   - `KEYSTORE_PATH` (if your keystore is located in a custom location)

2. **Build the app**  
   To build the APK, run:

   ```bash
   ./gradlew assembleRelease # To build all the apps
   # OR
   ./gradlew :<GRADLE_MODULE>:assembleRelease # To build a specific module, such as :app, :automotive, or :wear
   ```

   To build the AAB, run:

   ```bash
   ./gradlew bundleRelease # To build all the apps
   # OR
   ./gradlew :<GRADLE_MODULE>:bundleRelease # To build a specific module, such as :app, :automotive, or :wear
   ```
