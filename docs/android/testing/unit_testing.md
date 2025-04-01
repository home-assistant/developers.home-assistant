---
title: "Android Unit Testing"
sidebar_label: "Unit Tests"
---

🚧🚧🚧 Under Construction 🚧🚧🚧

## Why do we perform unit testing?

Unit testing helps you build your features with confidence and ensures that your code behaves as expected. It should be a tool to assist development, not a burden. [Test-Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development) is a well-known methodology where tests are written before or alongside the actual code. This approach allows you to quickly validate your code without waiting for the entire application to run.

:::info
Don't write tests just for the sake of writing tests. Tests should either help you during development or assist future developers in maintaining the codebase.
:::

Unit tests focus on testing **your code**. Avoid testing the behavior of external libraries unless absolutely necessary. If you find yourself testing a library's behavior, consider contributing to that library instead and add the test there.

:::note
There are exceptions to this rule. Sometimes, we add tests to ensure that the behavior of a library doesn't change over time. In such cases, explicitly document the reason for the test.
:::

## Testing the public interface

Focus on testing the **public API** of your classes rather than every single function. Writing tests for all functions, especially small ones, can lead to an overwhelming number of tests that are difficult to maintain. By concentrating on the public interface, you ensure that your tests remain relevant and resilient to internal changes.

When you need to access private parts of a class for testing, consider using the [VisibleForTesting](https://developer.android.com/reference/kotlin/androidx/annotation/VisibleForTesting) annotation. This annotation allows you to expose private methods or properties for testing purposes only. The [linter](../linter) ensures that this exposure is limited to the test scope.

:::note
Avoid using `VisibleForTesting` unless absolutely necessary. It’s better to design your code in a way that doesn’t require exposing private members.
:::

## Test frameworks and mocking

The project is configured to use [JUnit 5](https://junit.org/junit5/), which should be your primary testing framework.

### Mocking

When writing unit tests, you often need to isolate the code under test by mocking its dependencies. The project uses [MockK](https://mockk.io/). Use this tool to create mocks or fakes for external dependencies, ensuring that your tests remain focused on the behavior of your code.

## Testing with Android APIs

For cases where your code interacts with Android APIs that cannot be mocked or faked properly, the project includes [Robolectric](https://robolectric.org/). Robolectric allows you to run Android-specific tests in a JVM environment, avoiding the need for an emulator.

### When to use Robolectric

- Use Robolectric when testing Android APIs that are difficult to mock or fake.
- Prefer Robolectric over instrumentation tests whenever possible, as instrumentation tests require more resources and are more complex to set up.

### Caveats

- Robolectric does not work with JUnit 5 (follow the [issue](https://github.com/robolectric/robolectric/issues/3477)). To address this, the project includes a dependency on JUnit 4 for tests that require Robolectric.
- Ensure that the code you are testing does not depend on the state of the Android API, as this can lead to unreliable tests. If that is the case consider writing an [instrumented test](integration_testing).

## Best practices for unit testing

- **Write tests alongside code**: Writing tests as you develop ensures that your code is testable and reduces the risk of bugs.
- **Focus on behavior**: Test the behavior of your code, not its implementation details.
- **Keep tests small and focused**: Each test should validate a single behavior or scenario.
- **Use descriptive test names**: Test names should clearly describe the scenario being tested and the expected outcome.
- **Mock external dependencies**: Use mocks or fakes to isolate the code under test.
- **Avoid over-testing**: Don’t write tests for trivial methods or internal implementation details unless they are critical to the functionality.

## Example: writing a unit test

Here’s an example of a well-structured unit test using JUnit 5 and MockK:

```kotlin
@Test
fun `Given a valid user ID when fetching user details then return user data`() {
    // Given
    val userId = "12345"
    val expectedUser = User(id = userId, name = "John Doe")
    every { userRepository.getUser(userId) } returns expectedUser

    // When
    val result = userService.getUserDetails(userId)

    // Then
    assertEquals(expectedUser, result)
}
