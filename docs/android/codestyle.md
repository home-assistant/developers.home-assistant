---
title: "Android code style"
sidebar_label: "Code style"
---

## Why enforcing code style

We aim to maintain a **consistent and standard codebase**. By enforcing code style:

- We reduce unnecessary comments on PRs, allowing reviewers to focus on the logic rather than formatting.
- We ensure the code is easier to read and maintain.

## Language guidelines

- All code must be written in **English**.
- Avoid typos and grammatical mistakes. While mistakes are acceptable (as many contributors are non-native speakers), reviewers are encouraged to suggest corrections.
- Use spell checkers to assist in correcting mistakes.

## KTLint formatter

We use [KTLint](https://pinterest.github.io/ktlint) to enforce Kotlin code style. It is integrated into our Gradle modules and configured via the `.editorconfig` file.

### Custom rules

We override some KTLint rules when necessary. To enable or disable a rule:

  1. Submit a **dedicated PR** with a proper explanation of the change.
  2. If the change affects the codebase, create **two commits**:
     - One for updating the rule.
     - Another for applying the changes.

:::note
Add a comment within the `.editorconfig` file above the overridden rule explaining why it was changed. If more explanation is needed, you can link to a GitHub issue.
:::

### Running KTLint

You can use KTLint through Gradle to automatically reformat your code:

```bash
./gradlew :build-logic:convention:ktlintFormat ktlintFormat
```

### CI integration

If a KTLint error is detected, the CI will fail, and GitHub will report it as a comment in the PR using the generated [SARIF](/docs/android/tips/sarif_reports.md) report.

## Yamllint

We use [Yamllint](https://github.com/adrienverge/yamllint) to enforce YAML formatting. The `github` format is followed for all YAML files in the repository.

### Running Yamllint

Run the following command at the root of the repository to check YAML formatting:

```bash
yamllint --strict --format github .
```

:::note
Yamllint does not reformat your code; it only reports errors that need to be fixed. Use your IDE's code formatter or fix issues manually.
:::

### CI integration

If the YAML format is invalid, the CI will block the PR.

## Avoid using TODOs

TODOs in code tend to be forgotten over time. When someone read them later, they are often outdated or irrelevant. We recommend avoiding TODOs in your code. However, if during a review you and the reviewer agree that something needs to be addressed later, you should create a `TODO`. To properly track TODOs, always associate them with a GitHub issue.

### Example

```bash
// TODO Missing feature (linked issue #404)
```
