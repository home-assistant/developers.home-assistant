---
title: "Android screenshot testing"
sidebar_label: "Screenshot testing"
---

## Why do we perform screenshot testing?

Screenshot testing is used to verify that the current UI matches the reference UI stored in the repository. By doing this, we can ensure that any changes impacting the UI are intentional and validated. The scope of these tests is limited to the UI.

We should test on various device shapes and sizes, ranging from small screens (e.g., Wear OS devices) to large screens (e.g., 55" TVs).

### Benefits of screenshot testing

- **UI Consistency**: Ensures that the UI remains consistent across updates.
- **Library Updates**: Validates that updates to UI libraries do not introduce unintended changes.
- **Broad Device Coverage**: Tests across multiple screen sizes and shapes to ensure compatibility.

### Real-world example

Screenshot testing has proven useful when using beta versions of libraries, such as the Wear Compose library, where changes in the library could impact the UI.

## Compose screenshot testing

We use the [Compose Preview Screenshot Testing](https://developer.android.com/studio/preview/compose-screenshot-testing) framework to assert that the UI does not change unexpectedly.

### Advantages of compose screenshot testing

- **No emulator required**: These tests do not require an emulator, making them less resource-intensive and significantly faster than [integration tests](/docs/android/testing/integration_testing).
- **Fast feedback**: Developers can quickly verify UI changes without waiting for emulator boot times.

### Reference screenshots

The reference screenshots are stored under `src/debug/screenshotTest/reference` in each Gradle module. To update the reference screenshots, run the following command:

```bash
./gradlew updateDebugScreenshotTest updateFullDebugScreenshotTest
```

### CI integration

Our [CI pipeline](/docs/android/ci) verifies the test reports for any errors. If discrepancies are found, the CI blocks the pull request until the issues are resolved.

## Avoiding duplication in Compose previews

To avoid duplicating Compose previews in your tests, ensure that you reuse existing composables and preview annotations wherever possible. This reduces redundancy and ensures consistency between previews and tests.

## Configuring annotations for tests

When writing screenshot tests, use appropriate configuration annotations to define the device size, theme, and other parameters. This ensures that the tests accurately reflect the intended UI.

## Handling threshold updates

Screenshot tests can fail when run on different operating systems due to subtle differences in rendering, such as antialiasing. This issue is discussed in detail in this [Google issue tracker](https://issuetracker.google.com/issues/348590914).

### Current approach

We keep the threshold as low as possible to avoid masking real issues.

A GitHub Action workflow, `update_screenshots.yml`, is available and can be manually triggered by a repository maintainer to update the screenshots so they match the verification host configuration. If your screenshot tests fail because of threshold differences, the maintainer addresses this during the review process.

:::note
This workflow only works for branches within the repository, not forks. Only people with write access can use it at this time.
:::

:::note
This workflow commits directly to the branch, but it does not trigger the pull request workflow automatically. To trigger the workflow, make a new commit to your branch after the update.
:::

## Best practices for screenshot testing

- **Test across devices**: Ensure your tests cover a range of screen sizes and shapes.
- **Keep reference screenshots updated**: Regularly update reference screenshots to reflect intentional UI changes, and explain the changes in your PR.
- **Minimize thresholds**: Use the smallest possible threshold to avoid hiding real issues.
- **Reuse previews**: Avoid duplicating Compose previews by reusing existing composables and annotations.

By following these practices, you can ensure that your UI remains consistent and reliable across updates and device configurations.
