---
title: "Android Linter"
sidebar_label: "Linter"
---

## What is a linter?

A linter is a static code analyzer that helps identify well-known issues and potential improvements in your code. It goes beyond what a compiler does by ensuring proper usage of the language and adherence to best practices. While a compiler validates code against a grammar, a linter focuses on code quality and architecture.

:::note
Having no complaints from a linter doesn't mean everything is perfect. A review from another developer is still necessary to double-check.
:::

## Why use a linter?

Using a linter ensures:

- **Consistency**: Enforces a standard code style, similar to our [codestyle](codestyle).
- **Focus**: Allows reviewers to focus on logic rather than formatting or trivial issues.
- **Prevention**: Helps avoid crashes and bugs by catching common mistakes, such as using APIs not supported by the target Android API level.

For example, failing to check the Android API version before using an unsupported API can lead to crashes.

## Linters used in the project

### KTLint

We use [KTLint](https://pinterest.github.io/ktlint) as our Kotlin linter, integrated via [Gradle plugin](https://github.com/JLLeitschuh/ktlint-gradle). The configuration is located in the main `build.gradle.kts` file. We mostly use the default configuration but enable [SARIF](tips/sarif_reports) reports for GitHub Actions to annotate issues in pull requests.

#### Ignoring an issue

Always try to fix issues rather than ignoring them. If ignoring is necessary, follow these steps:

1. Use the `@Suppress` annotation for specific constructs:
   ```kotlin
   @Suppress("ktlint:standard:no-wildcard-imports")
   import foo.*
   ```

2. For project-wide suppression, update the `.editorconfig` file as per [this guide](https://pinterest.github.io/ktlint/0.49.1/faq/#how-do-i-globally-disable-a-rule-without-editorconfig). Open a dedicated PR with an explanation for disabling the rule.

#### Running KTLint locally

Run the following command to check all code in the repository:

```bash
./gradlew ktlintCheck :build-logic:convention:ktlintCheck --continue
```

:::note
Use `--continue` to get all issues across Gradle modules instead of stopping at the first failure.
:::

You can add this check to be run automatically through a git [pre-commit hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) by running this command

```bash
./gradlew addKtlintCheckGitPreCommitHook
```

### Android Linter

The Android linter is enabled for all variants to ensure comprehensive checks. Its configuration is located in `build-logic/convention/src/main/kotlin/AndroidCommonConventionPlugin.kt`. SARIF reports are generated for GitHub Actions to annotate issues in pull requests.

#### Ignoring an issue

Follow these steps to ignore an issue:

1. Use the `@Suppress` annotation for specific constructs.
2. Add the issue to the `lint-baseline.xml` file.
3. Disable the issue in the lint settings directly.

If you disable an issue, open a dedicated PR with an explanation.

#### Running the Android linter locally

Run the following command:

```bash
./gradlew lintDebug --continue
```

:::note
Use `--continue` to get all issues across Gradle modules instead of stopping at the first failure.
:::

## Managing lint rules

### Changing the lint level of an issue

The Android linter comes with predefined rules bundled into the Android Gradle plugin. Some libraries, like [Timber](https://github.com/JakeWharton/timber), also provide custom lint rules.

To change the severity of a rule, update the Gradle configuration in `build-logic/convention/src/main/kotlin/AndroidCommonConventionPlugin.kt`:

```kotlin
lint {
    ...
    disable += "MissingTranslation"
    error += "LogNotTimber"
}
```

- **`LogNotTimber`**: Promoted from a warning to an error to enforce the usage of Timber instead of the classic logger.
- **`MissingTranslation`**: Disabled because translations are added only during CI release builds.

Changes to lint levels should be made in a PR with a clear explanation.

## Baseline management

### What is a baseline?

The baseline is an XML file (`lint-baseline.xml`) in each Gradle module that lists ignored errors. It was created when the linter was first enabled to avoid fixing hundreds of pre-existing issues.

:::note
A great first contribution is to remove issues from the baseline by fixing them.
:::

### Updating the baseline

When updating the Android Gradle Plugin, new lint issues may arise, or existing ones may change. To regenerate the baseline:

```bash
./gradlew updateLintBaseline
```

After updating, review the ignored errors to determine if they should be addressed now or later. Open a GitHub PR or issue as needed.

## Extending lint rules

Feel free to propose new linter rules specific to our project. These rules can help identify misuse of APIs or enforce design patterns.

## Tips for contributors

- Fix lint issues rather than ignoring them whenever possible.
- Provide clear explanations in PRs for any changes to lint configurations or baselines.
- Use the linter locally to catch issues early and save CI resources.

Happy linting! 🚀
