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
- Use tools like LLMs or spell checkers to assist in correcting mistakes.

## KTLint formatter

We use [KTLint](https://pinterest.github.io/ktlint) to enforce Kotlin code style. It is integrated into our Gradle modules and configured via the `.editorconfig` file.

### Custom rules

- We override some KTLint rules when necessary. To enable or disable a rule:
  1. Submit a **dedicated PR** with a proper explanation of the change.
  2. If the change affects a large portion of the codebase, create **two commits**:
     - One for updating the rule.
     - Another for applying the changes.

### Running KTLint

You can use KTLint through Gradle to automatically reformat your code:

```bash
./gradlew :build-logic:convention:ktlintFormat ktlintFormat
```

### CI integration

If a KTLint error is detected, the CI will fail, and GitHub will report it as a comment in the PR using the generated [SARIF](tips/sarif_reports.md) report.

## Yamllint

We use [Yamllint](https://github.com/adrienverge/yamllint) to enforce YAML formatting. The `github` format is followed for all YAML files in the repository.

### Running Yamllint

Run the following command at the root of the repository to check YAML formatting:

```bash
yamllint --strict --format github .
```

- **Note:** Yamllint does not reformat your code; it only reports errors that need to be fixed.
- Use your IDE's code formatter or fix issues manually.

### CI integration

If the YAML format is invalid, the CI will block the PR.

## TODOs Are Tracked in GitHub

When working on a PR, you may want to add a `TODO` for later. To properly track TODOs, associate them with a GitHub issue.

### Example

```bash
// TODO Missing feature (linked issue #404)
```
