---
title: "Jetpack Compose 101"
sidebar_label: "Jetpack Compose 101"
---

🚧🚧🚧 Under Construction 🚧🚧🚧

## How to create a new screen in the existing app and iterate quickly

To create a new screen in the app and iterate quickly, follow these steps:

1. **Extract the Compose UI screen**:  
   Create a dedicated Kotlin file for your Compose UI screen. Use the `@Preview` annotation to enable preview capabilities within the IDE. This also makes the screen compatible with [screenshot testing](../testing/screenshot_testing).

2. **Leverage hot reload**:  
   After the first build of the app, navigate to your screen. Jetpack Compose provides hot reload capabilities out of the box, allowing you to see changes in real-time. However, note that there are some limitations, such as not being able to reload changes to certain structural elements.

3. **Use previews effectively**:  
   Use multiple `@Preview` annotations to test your screen in different configurations (e.g., light/dark mode, different screen sizes). This helps ensure your UI adapts well to various scenarios.

## Theme/Design system

We use a custom Compose theme, `io.homeassistant.companion.android.util.compose.HomeAssistantAppTheme`, which is based on [Material Design 2](https://m2.material.io/). You must use this theme to ensure consistency with the application's overall UI.

### Key points

- **Material design 2**: The theme adheres to Material Design 2 principles, ensuring a cohesive look and feel.
- **Custom components**: If you need to create custom components, ensure they align with the existing theme and design system.
- **Dark mode support**: The theme supports both light and dark modes. Test your screen in both modes to ensure proper styling.

## Best practices for working with Jetpack Compose

- **Keep UI code modular**: Break down your UI into small, reusable composables. This improves readability and makes testing easier.
- **Use state hoisting**: Follow the [state hoisting pattern](https://developer.android.com/jetpack/compose/state#state-hoisting) to manage state effectively. This ensures that your composables remain stateless and reusable.
- **Test with previews**: Use `@Preview` annotations to test your composables in isolation. Add parameters to simulate different states and configurations.
- **Follow accessibility guidelines**: Ensure your UI is accessible by providing meaningful content descriptions and testing with accessibility tools.
- **Use style**: Use style for component like text.

## Example: creating a new screen

Here’s an example of how to create a new Compose screen with a preview:

```kotlin
// filepath: /path/to/your/screen/MyNewScreen.kt

@Composable
fun MyNewScreen(
    title: String,
    onButtonClick: () -> Unit
) {
    HomeAssistantAppTheme {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = title, style = MaterialTheme.typography.h4)
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = onButtonClick) {
                Text(text = "Click Me")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MyNewScreenPreview() {
    MyNewScreen(
        title = "Welcome to Home Assistant",
        onButtonClick = {}
    )
}
```
