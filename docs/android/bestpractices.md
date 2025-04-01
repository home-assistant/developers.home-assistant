---
title: "Android Best Practices"
sidebar_label: "Best Practices"
---

## General principles

In general, we should follow standard development principles such as:

- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
- **KISS**: Keep It Simple, Stupid.
- **Separation of Concerns**: Ensure each component has a single responsibility.
- **Community Guidelines**: Follow the practices showcased in the [NowInAndroid](https://github.com/android/nowinandroid) repository.

## Documentation

Documentation in the code should bring value and evolve with the codebase. Keep the following in mind:

- **Stay Up-to-Date**: Documentation must be updated as the code changes.
- **Balance Comments**: Avoid over-commenting, but don’t forget to comment where necessary.
- **Future-Proof**: Ask yourself, *"Will I understand what I did in 6 months?"*

:::info
Documentation should help, not hinder.
:::

## Logging

Logging is essential but should be used judiciously. As Jake Wharton says in his [Timber](https://github.com/JakeWharton/timber) library:

> Every time you log in production, a puppy dies.

- Avoid excessive logging in production.
- Use structured and meaningful log messages.
- Leverage tools like Timber to manage logging effectively.

## Time and duration

When working with time, date, or duration, avoid using primitive types. Instead, use strong types to prevent unit mix-ups.

### ❌ Don't do this

```kotlin
const val THRESHOLD = 600000

fun main() {
    val now = System.currentTimeMillis()
    
    if (now > THRESHOLD) {
        // Do something
    }
}
```

### ✅ Do this

```kotlin
val THRESHOLD = Instant.ofEpochSecond(60)

fun main() {
    val now = Instant.now()

    if (now > THRESHOLD) {
        // Do something
    }
}
```

:::warning
If you must use primitive types, ensure the variable name includes the unit (e.g., `THRESHOLD_MS` instead of `THRESHOLD`) to reduce ambiguity.
:::

- Apply the same logic to dates, durations, and timestamps.
- For APIs that use `long` for timestamps (e.g., milliseconds vs. seconds), convert the values to a strong type as soon as possible to minimize exposure to untyped units.

## Concurrency

Concurrency is powerful but requires careful handling to avoid issues like memory leaks and race conditions.

### Coroutine scope

- Tie your coroutines to an Android lifecycle (e.g., `viewModelScope` or `lifecycleScope`) to prevent memory leaks.

### Concurrent access

- Ensure that any references accessed outside of a coroutine are thread-safe.
- If a reference is not safe, either make it safe or don't use it.
- Debugging concurrency issues (e.g., race conditions) can be extremely challenging, so design carefully.

For more details on race conditions, see [Race Condition](https://en.wikipedia.org/wiki/Race_condition#In_software).

## Code organization

### Keep your PRs small

- **Why?** Smaller PRs are easier to review, reduce delays, and minimize frustration.
- **How?** Break down large changes into smaller, logical chunks.

For more details, see [submit](submit).

### Keep your classes small

- Large classes often have too many responsibilities, making them harder to review, test, and maintain.
- Aim for small classes with proper separation of concerns and abstraction.

### Keep your functions small and meaningful

- Functions should be small and focused on a single responsibility.
- A function's name should clearly describe what it does. If it’s hard to name, the function likely does too much.
- Well-named, small functions reduce the need for documentation and make the code self-explanatory.

:::note
Naming is hard, but smaller functions make it easier to choose meaningful names.
:::

## Additional notes

- **Testing**: Write [unit tests](testing/unit_testing) for critical functionality to ensure reliability.
- **Code reviews**: Always review code for adherence to these best practices.
- **Refactoring**: Regularly refactor code to improve readability, maintainability, and performance.
