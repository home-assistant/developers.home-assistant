---
title: "Android push notification"
sidebar_label: "Push notification"
---

## Push notifications

If you want to work on push notifications or use a development build with push notifications, please go to the server-side code [here](https://github.com/home-assistant/mobile-apps-fcm-push) and deploy it to your Firebase project. Once you have your androidV1 URL to the deployed service, set it in to your `${GRADLE_USER_HOME}/gradle.properties` file, e.g.:

```properties
homeAssistantAndroidPushUrl=https://mydomain.cloudfunctions.net/androidV1
```

You can also define the rate limit function URL, e.g.:

```properties
homeAssistantAndroidRateLimitUrl=https://mydomain.cloudfunctions.net/checkRateLimits
```
