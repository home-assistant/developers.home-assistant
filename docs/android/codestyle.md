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

In this example, it’s unclear why the value 42 is being used. At the very least, you should add a comment explaining its purpose. Even better for future evolutions, it should be defined as a constant.

#### ✅ Do this

```kotlin
// Explanation or link about why we picked 42
const val SUPER_IMPORTANT_THRESHOLD = 42

if (value == SUPER_IMPORTANT_THRESHOLD) {
    // Do something
}
```

### Organizing constants

General rule is if the constant is exposed outside of the file it needs to be properly be identifiable when imported either by its name or by its parents name.

#### Within a dedicated file

If you need to group related constants together, create an `object` to namespace them. Place the constants in a file suffixed with `*Constants.kt`. This approach improves organization and avoids cluttering unrelated files.

**Example:**

```kotlin
// filepath: NetworkConstants.kt
package package io.homeassistant.companion.android.network

object NetworkConstants {
    val TIMEOUT = 30.seconds
    const val BASE_URL = "https://api.example.com"
}
```

OR

```kotlin
// filepath: NetworkConstants.kt
package package io.homeassistant.companion.android.network

val NETWORK_TIMEOUT = 30.seconds
const val BASE_URL = "https://api.example.com"
```

#### Alongside a class

For constants that are tightly coupled to a specific class, you can define them within the same file. Avoid using companion object unless absolutely necessary. Instead, place private constants outside the class definition at the top level. This reduces boilerplate and keeps the class focused.

**Example:**

```kotlin
// filepath: UserRepository.kt
package package io.homeassistant.companion.android.user

private const val DEFAULT_USER_ID = "guest"

class UserRepository {
    fun getUserById(userId: String = DEFAULT_USER_ID): User {
        // Implementation here
    }
}
```

:::note
If you need the constant in test to avoid leaking it to the rest of the production code you can use the `VisibleForTesting` annotation.

```kotlin
@VisibleForTesting
const val DEFAULT_USER_ID = "guest"
```

:::

#### Using companion objects

Use companion object only when constants or utility functions need to be exposed externally. This provides a clear namespace and avoids naming collisions.

When to use companion objects:

- **Namespacing for external use**: When constants or utility functions must be accessed externally (e.g., public or internal).
- **Intentional naming conflicts**: When multiple classes or entities in the same file share the same name for conceptually similar constants (e.g., EMPTY, DEFAULT).

**Example:**

```kotlin
// filepath: ApiClient.kt
package package io.homeassistant.companion.android.network

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
