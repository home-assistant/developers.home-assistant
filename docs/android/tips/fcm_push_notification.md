---
title: "Android FCM push notifications"
sidebar_label: "FCM push notifications"
---

## FCM push notifications setup

:::note
Setting up Firebase Cloud Messaging (FCM) can be complex. Unless you specifically need it, consider using notifications through the WebSocket instead.
:::

If you want your own FCM setup for push notifications, follow these steps:

1. **Create a Firebase project**  
   Go to the [Firebase Console](https://console.firebase.google.com) and create a new Firebase project.

2. **Add Android apps to the Firebase project**  
   Add the following package names as Android apps in your Firebase project:
   - `io.homeassistant.companion.android`
   - `io.homeassistant.companion.android.debug`
   - `io.homeassistant.companion.android.minimal`
   - `io.homeassistant.companion.android.minimal.debug`

3. **Deploy the push notification service**  
   Visit the [mobile-apps-fcm-push repository](https://github.com/home-assistant/mobile-apps-fcm-push) and deploy the service to your Firebase project.

4. **Set the push notification URL**  
   Once you have the `androidV1` URL for the deployed service, add it to your `${GRADLE_USER_HOME}/gradle.properties` file. For example:

   ```properties
   homeAssistantAndroidPushUrl=https://mydomain.cloudfunctions.net/androidV1
   ```

   Optionally, you can also define the rate limit function URL:

   ```properties
   homeAssistantAndroidRateLimitUrl=https://mydomain.cloudfunctions.net/checkRateLimits
   ```

5. **Download and place the `google-services.json` File**  
   Download the `google-services.json` file from your Firebase project and place it in the following folders:
   - `/app`
   - `/automotive`
   - `/wear`

:::note
The `google-services.json` file must include client IDs for all the package names listed above. Without this, FCM push notifications will not work (only WebSocket notifications will function).
:::
