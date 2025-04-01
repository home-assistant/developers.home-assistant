---
title: "Android Screenshot Testing"
sidebar_label: "Screenshot Testing"
---

🚧🚧🚧 Under Construction 🚧🚧🚧

## Why Do We Perform Screenshot Testing?

Screenshot testing is used to verify that the current UI matches the reference UI stored in the repository. By doing this, we can ensure that any changes impacting the UI are intentional and validated. The scope of these tests is limited to the UI.

We should test on a variety of device shapes and sizes, ranging from small screens (e.g., Wear OS devices) to very large screens (e.g., 55" TVs).

### Benefits of Screenshot Testing

- **UI Consistency**: Ensures that the UI remains consistent across updates.
- **Library Updates**: Validates that updates to UI libraries do not introduce unintended changes.
- **Broad Device Coverage**: Tests across multiple screen sizes and shapes to ensure compatibility.

### Real-World Example

Screenshot testing has proven useful when using beta versions of libraries, such as the Wear Compose library, where changes in the library could impact the UI.

## Compose Screenshot Testing

We use the [Compose Preview Screenshot Testing](https://developer.android.com/studio/preview/compose-screenshot-testing) framework to assert that the UI does not change unexpectedly.

### Advantages of Compose Screenshot Testing

- **No Emulator Required**: These tests do not require an emulator, making them less resource-intensive and significantly faster than [integration tests](integration_testing).
- **Fast Feedback**: Developers can quickly verify UI changes without waiting for emulator boot times.

### Reference Screenshots

The reference screenshots are stored under `src/debug/screenshotTest/reference` in each Gradle module. To update the reference screenshots, run the following command:

```bash
./gradlew updateDebugScreenshotTest
```

### CI Integration

Our [CI pipeline](../ci) verifies the test reports for any errors. If discrepancies are found, the CI blocks the pull request until the issues are resolved.

## Avoiding Duplication in Compose Previews

To avoid duplicating Compose previews in your tests, ensure that you reuse existing composables and preview annotations wherever possible. This reduces redundancy and ensures consistency between previews and tests.

## Configuring Annotations for Tests

When writing screenshot tests, use appropriate configuration annotations to define the device size, theme, and other parameters. This ensures that the tests accurately reflect the intended UI.

## Handling Threshold Updates

Screenshot tests can fail when run on different operating systems due to subtle differences in rendering, such as antialiasing. This issue is discussed in detail in this [Google issue tracker](https://issuetracker.google.com/issues/348590914).

### Current Approach

- We aim to keep the threshold as low as possible to avoid masking real issues.
- If your tests fail due to minor rendering differences, you may need to adjust the threshold.

To adjust the threshold, update the configuration in your test file to allow for slight variations while still catching significant changes.

## Best Practices for Screenshot Testing

- **Test Across Devices**: Ensure your tests cover a range of screen sizes and shapes.
- **Keep Reference Screenshots Updated**: Regularly update reference screenshots to reflect intentional UI changes, and explain the changes in your PR.
- **Minimize Thresholds**: Use the smallest possible threshold to avoid hiding real issues.
- **Reuse Previews**: Avoid duplicating Compose previews by reusing existing composables and annotations.

By following these practices, you can ensure that your UI remains consistent and reliable across updates and device configurations.
