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

## Constants

### Naming conventions

We follow the [Kotlin property naming guidelines](https://kotlinlang.org/docs/coding-conventions.html#property-names).

### Avoid magic numbers and strings

Magic numbers or strings in code can make it difficult to understand the purpose of a value, leading to poor maintainability. Always replace magic numbers or strings with named constants.

#### ❌ Don't do this

```kotlin
if (value == 42) {
  // Do something
}
```

In this example, it’s unclear why the value 42 is being used. At the very least, you should add a comment explaining its purpose. Defining it as a constant is even better because it provides a clear, descriptive name, making the code easier to read, understand, and maintain. Additionally, defining the value in one place facilitates reuse across the codebase, such as in tests or within functions, classes, or other modules. This approach simplifies future changes, as updating the constant in one location automatically propagates the change wherever it is used. It also allows you to easily find where the constant is used with the IDE, avoiding irrelevant search results like searching for "42" across the entire codebase.

#### ✅ Do this

```kotlin
// Explanation or link about why we picked 42
const val SUPER_IMPORTANT_THRESHOLD = 42

if (value == SUPER_IMPORTANT_THRESHOLD) {
    // Do something
}
```

### Organizing constants

Constants should be organized to ensure clarity, maintainability, and consistency. Follow these guidelines to determine where and how to define constants:

1. If a constant is exposed outside the file, it should be easily identifiable when imported, either by its own name or by its parent’s name.
2. Most constants should be defined in the same file as the class they are associated with (outside of `companion object` if possible).
3. If there are too many constants in a file, move them to a dedicated file grouped under an `object` to provide namespacing.

:::note
This guideline has been introduced recently to standardize the usage of constants across the codebase. As a result, you may encounter instances that break this guideline. Feel free to correct these issues as you come across them to help improve code quality.
:::

#### Alongside a class

For constants that are tightly coupled to a specific class, define them in the same file as the class. Avoid using `companion object` unless absolutely necessary. Instead, place private constants at the top of the file, outside the class definition. This approach reduces boilerplate and keeps the class focused.

**Example:**

```kotlin
// filepath: UserRepository.kt
package io.homeassistant.companion.android.user

private const val DEFAULT_USER_ID = "guest"

class UserRepository {
    fun getUserById(userId: String = DEFAULT_USER_ID): User {
        // Implementation here
    }
}
```

:::note
If you need the constant in tests to avoid exposing it to the rest of the production code, use the `VisibleForTesting` annotation.

```kotlin
@VisibleForTesting
const val DEFAULT_USER_ID = "guest"
```

:::

#### Using companion objects

When to use companion objects:

- **Namespacing for external use**: When constants or utility functions must be accessed externally (e.g., public or internal).
- **Intentional naming conflicts**: When multiple classes or entities in the same file share the same name for conceptually similar constants (e.g., EMPTY, DEFAULT).

**Example:**

```kotlin
// filepath: ApiClient.kt
package io.homeassistant.companion.android.network

class RestApiClient {
    companion object {
        val DEFAULT_TIMEOUT = 60.seconds
    }
}

class WSClient {
    companion object {
        val DEFAULT_TIMEOUT = 10.seconds
    }
}
```

#### Within a dedicated file using an object

If there are too many constants in a file, or if the constants are shared across multiple classes or modules, move them to a dedicated file. Use an object to group related constants and provide namespacing. The file should be suffixed with `*Constants.kt`.

```kotlin
// filepath: NetworkConstants.kt
package io.homeassistant.companion.android.network

object NetworkConstants {
    val TIMEOUT = 30.seconds
    const val BASE_URL = "https://api.example.com"
}

object WSConstants {
    val KEEP_ALIVE_INTERVAL = 5.seconds
}
```
