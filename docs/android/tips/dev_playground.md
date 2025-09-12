---
title: "Developer playground"
sidebar_label: "Developer playground"
---

## Why a developer playground?

The application relies heavily on the WebView and an active connection to a server, making it challenging to quickly test features during development. Often, you may need to rebuild the app multiple times to test specific behaviors. While the **Compose preview** capabilities can help with UI testing, they are sometimes insufficient, requiring you to go through the whole UX flow that can be tedious.

To save time during development, we’ve created a **developer playground**. This playground is accessible only in debug builds through an application [shortcut](https://developer.android.com/develop/ui/views/launch/shortcuts/creating-shortcuts#static). This ensures it does not interfere with the rest of the application.

:::note
The playground code is located in the `app/src/debug` sourceSet.
:::

You are free to use the playground as needed, but only commit changes if they provide value to other developers. When committing changes to the playground, ensure you follow the [codestyle](/docs/android/codestyle) and [best practices](/docs/android/best_practices.md). Translations, however, can be omitted.

### Examples of valuable contributions

- A method to intentionally crash the application to test error reporting in the cache folder.
- A tool to display all components and themes used within the application.
