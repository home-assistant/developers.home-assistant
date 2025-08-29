---
title: "Android best practices"
sidebar_label: "Best Practices"
---

## General principles

In general, we should follow standard development principles such as:

- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Learn more with [Kotlin SOLID Principles Examples](https://medium.com/huawei-developers/kotlin-solid-principles-tutorial-examples-192bf8c049dd)
- **KISS**: Keep It Simple, Stupid.
- **DRY**: Don't Repeat Yourself
- **Community guidelines**: Follow the practices showcased in the [NowInAndroid](https://github.com/android/nowinandroid) repository.

## Documentation

Documentation in the code should bring value and evolve with the codebase. Keep the following in mind:

- **Stay up-to-date**: Documentation must be updated as the code changes.
- **Balance comments**: Avoid over-commenting, but don’t forget to comment where necessary.
- **Future-proof**: Ask yourself, *"Will I understand what I did in 6 months?"*

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

:::note[Example]

#### ❌ Don't do this

```kotlin
const val THRESHOLD = 600000

fun main() {
    val now = System.currentTimeMillis()
    
    if (now > THRESHOLD) {
        // Do something
    }
}
```

#### ✅ Do this

```kotlin
val THRESHOLD = Instant.ofEpochSecond(60)

fun main() {
    val now = Instant.now()

    if (now > THRESHOLD) {
        // Do something
    }
}
```

:::

:::warning
If you must use primitive types, ensure the variable name includes the unit (e.g., `THRESHOLD_MS` instead of `THRESHOLD`) to reduce ambiguity.
:::

- Apply the same logic to dates, durations, and timestamps.
- For APIs that use `long` for timestamps (e.g., milliseconds vs. seconds), convert the values to a strong type as soon as possible to minimize exposure to untyped units.

## Concurrency

Concurrency is powerful but requires careful handling to avoid issues like memory leaks and race conditions.

### Coroutine scope

Tie your coroutines to an Android lifecycle (e.g., `viewModelScope` or `lifecycleScope`) to prevent memory leaks.

### Concurrent access

- Ensure that any references accessed outside of a coroutine are thread-safe.
- If a reference is not safe, either make it safe or don't use it.
- Debugging concurrency issues (e.g., race conditions) can be extremely challenging, so design carefully.

For more details on race conditions, see [Race Condition](https://en.wikipedia.org/wiki/Race_condition#In_software).

## Use strong types instead of strings for logic

Use strings for storing and displaying text, not for controlling logic or behavior in your code. Relying on strings for logic-such as passing a string to determine a destination or behavior-can introduce errors like typos and make it harder to track or refactor your code. Instead, use strong types, such as a `sealed` class or, if necessary, an `enum`, to represent these concepts. Reserve strings for raw values from third-party sources or for UI display. If you must use strings, define them as `const val` (following our [codestyle](/docs/android/codestyle#avoid-magic-numbers-and-strings)) or wrap them in a strong type, such as an [inline value class](https://kotlinlang.org/docs/inline-classes.html).

:::note[Example]

#### ❌ Avoid this pattern

```kotlin
fun newInstance(destination: String): Intent {
    // Logic based on string value
    return Intent().apply {
        putExtra("destination", destination)
    }
}
```

#### ✅ Prefer this approach

```kotlin
private const val DESTINATION_KEY = "destination"

@Parcelize
sealed interface Destination : Parcelable {
    data object General : Destination
    data object Notifications : Destination
    data object Privacy : Destination
}

fun newInstance(destination: Destination): Intent {
    return Intent().apply {
        putExtra(DESTINATION_KEY, destination)
    }
}

fun onIntent(intent: Intent) {
    val destination = IntentCompat.getParcelableExtra(intent,DESTINATION_KEY, Destination::class.java)
    when (destination) {
        Destination.General -> // Handle General
        Destination.Notifications -> // Handle Notifications
        Destination.Privacy -> // Handle Privacy
        null -> // Handle missing destination
    }
}
```

:::

Using strong types for destinations helps prevent errors, improves code navigation, and makes refactoring more reliable. When you use `sealed` classes with `when`, the compiler can catch missing cases, and your IDE can quickly locate all usages of a specific destination, making updates and maintenance easier.

### Why sealed classes are better than enums

Sealed classes provide more flexibility and safety than enums. With sealed classes, you can define subclasses with their own properties, allowing you to pass additional data as needed for each type. This makes your APIs more expressive and adaptable.

For example, if the `Notifications` destination needs a `title` parameter, define it like this:

```kotlin

private const val DESTINATION_KEY = "destination"

@Parcelize
sealed interface Destination : Parcelable {
    data object General : Destination
    data class Notifications(val title: String) : Destination
    data object Privacy : Destination
}

fun onIntent(intent: Intent) {
    val destination = IntentCompat.getParcelableExtra(intent,DESTINATION_KEY, Destination::class.java)
    when (destination) {
        Destination.General -> // Handle General
        is Destination.Notifications -> {
            val title = destination.title
            // Handle Notifications with title
        }
        Destination.Privacy -> // Handle Privacy
        null -> // Handle missing destination
    }
}
```

:::note
When you use `when` with a sealed class, avoid adding an `else` branch. This ensures that if you add a new case, the compiler will require you to handle it, making your code safer and easier to maintain.
:::

By using sealed classes, you can safely add new destination types with their own required fields, and the compiler will enforce handling all cases. This approach makes your code more robust, maintainable, and less error-prone than using enums or strings for logic control.

Read more about sealed modifier on the [Kotlin documentation](https://kotlinlang.org/docs/sealed-classes.html).

## Code organization

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

## Keep your PRs small

- **Why?** Smaller PRs are easier to review, reduce delays, and minimize frustration.
- **How?** Break down large changes into smaller, logical chunks.

For more details, see [submit](/docs/android/submit).

## Dependency injection (DI)

We use Dependency injection (DI) to help write modular, testable, and maintainable code. By using DI, we can decouple the classes from their dependencies, making it easier to swap implementations, write unit tests, and manage complex object graphs. DI also improves code readability and helps enforce the single responsibility principle.

### Use explicit qualifier annotations over `@Named`

When you need to inject multiple implementations of the same type (or primitive types), you must use a qualifier to distinguish between them. While the `@Named` annotation is a common approach, it relies on string identifiers, which can be error-prone and harder to refactor. Using custom qualifier annotations instead of `@Named` offers several advantages:

- **Discoverability**: Custom qualifiers make it easier to find where a specific dependency is used in the codebase.
- **Refactorability**: Renaming a custom annotation is straightforward and safe, while changing a string identifier requires searching for all string usages.
- **Type safety**: Custom annotations are checked at compile time, reducing the risk of typos or mismatches that can occur with strings.
- **Clarity**: Custom qualifiers make the code more self-explanatory and easier to understand.

:::note[Example]

#### ❌ Don't do this

```kotlin
@Inject
@Named("keyChainRepository")
lateinit var keyChainRepository: KeyChainRepository
```

#### ✅ Do this

```kotlin
@Inject
@NamedKeyChain
lateinit var keyChainRepository: KeyChainRepository
```

Define the annotation like this:

```kotlin
package io.homeassistant.companion.android.common.data.keychain

import javax.inject.Qualifier

/**
 * Qualifier for the [KeyChainRepository] used to select the key chain.
 */
@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class NamedKeyChain
```

:::

For a real-world example of migrating from `@Named("keyChainRepository")` to `@NamedKeyChain`, see [this pull request](https://github.com/home-assistant/android/pull/5667).

## Fail fast

The further you progress in development, the more difficult it becomes to debug issues. Do not ignore errors, even those you think are unlikely to occur. Always aim to catch errors at build time rather than at runtime. Use Kotlin compiler features whenever possible, and consider adding a [lint rule](/docs/android/linter) if you cannot enforce a check at compile time.

### Leverage Kotlin compiler

The Kotlin compiler can help you catch issues early. For example, using the `when` operator with `sealed` classes/interfaces ensures that all cases are handled.

:::note
Favor [composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) when designing your classes. Composition leads to more flexible, maintainable, and testable code by allowing you to build complex behavior from simpler, reusable components, rather than relying on rigid class hierarchies.
:::

**Example:**

```kotlin
sealed interface Shape {
    class Rectangle: Shape
    class Oval: Shape
}

fun foo(shape: Shape) {
    when(shape) {
        is Shape.Oval -> TODO()
        is Shape.Rectangle -> TODO()
    }
}
```

If you add a new class that implements `Shape`, the compiler will fail to build until you handle the new case. This is especially useful when the interface is used throughout the codebase. Note that this only works if you do not add an `else` branch.

### Don't silently ignore exceptions

While it is important to catch exceptions to prevent crashes, silently ignoring them can hide deeper issues and make debugging more difficult. For example, consider a third-party library that requires initialization with an API key. If initialization fails and the exception is caught without proper logging, it can be challenging to identify the root cause if something stops working.

**Example:**

```kotlin
fun foo() {
    
    // Always catch the error and proceed with fallback value
    val value = try {
        ExternalThirdPartyJavaAPI.value()    
    } catch (e: Exception) {
        // Fortunately we log the error to help with troubleshooting
        Timber.w(e, "Couldn't get ExternalThirdParty value, current state: ${ExternalThirdPartyJavaAPI.state()}")
        "fallback"
    }
}
```

Proper logging ensures that users and developers can spot errors in the logs and report issues effectively.

To further improve error handling during development, use the `FailFast` API. This API applies offensive programming principles by crashing the app in the `debug` flavor when an error occurs, making issues more visible early in the development process.

**Example:**

```kotlin
import io.homeassistant.companion.android.common.util.FailFast

fun foo() {

    // In case of a failure, this will print a message and stack trace to the logs. In debug builds, it
    // will also crash the app, while in production it will use the fallback value instead of crashing.
    val value = FailFast.failOnCatch(
        message = { "Couldn't get ExternalThirdParty value, current state: ${ExternalThirdPartyJavaAPI.state()}" },
        fallback = "fallback",
    ) {
        ExternalThirdPartyJavaAPI.value()
    }
}
```

By failing fast and logging errors clearly, you make it easier to identify, 
debug, and fix issues before they reach production.

When the FailFast API is triggered, it produces a clear and visible log entry, making it easy to spot and investigate:

```log
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  ██████████████████████
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  !!! CRITICAL FAILURE: FAIL-FAST !!!
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  ██████████████████████
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  An unrecoverable error has occurred, and the FailFast mechanism
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  has been triggered. The application cannot continue and will now exit.
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  ACTION REQUIRED: This error must be investigated and resolved.
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  Review the accompanying stack trace for details.
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  ----------------------------------------------------------------
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  io.homeassistant.companion.android.common.util.FailFastException: Couldn't get ExternalThirdParty value, current state: null
2025-06-12 10:53:20.841 29743-29743 CrashFailFastHandler    io....stant.companion.android.debug  E  	at io.homeassistant.companion.android.developer.DevPlaygroundActivityKt.DevPlayGroundScreen$lambda$14$lambda$13$lambda$12(DevPlaygroundActivity.kt:80)
```
