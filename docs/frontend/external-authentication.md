---
title: "External authentication"
---

By default, the frontend will take care of its own authentication tokens. If none are found, it will redirect the user to the login page and it will take care of updating the token.

If you want to embed the Home Assistant frontend in an external app, you will want to store the authentication inside the app but make it available to the frontend. To support this, Home Assistant exposes an external authentication API.

To activate this API, load the frontend with `?external_auth=1` appended to the URL. If this is passed in, Home Assistant will expect either `window.externalAppV2` (Android V2, recommended), `window.externalApp` (Android V1, fallback) or `window.webkit.messageHandlers` (iOS) to be defined containing the methods described below.

:::note
V2 (`window.externalAppV2`) requires the WebView to support [`WebViewFeature.WEB_MESSAGE_LISTENER`][web-message-listener]. The app should fall back to V1 otherwise.
:::

## Get access token

When the frontend loads, it will request an access token from the external authentication. It does so by calling one of the following methods with an options object. The options object defines the callback method to be called with the response and an optional `force` boolean which is set to `true` if the access token should be refreshed, regardless if it has expired or not.

The `force` boolean has been introduced in Home Assistant 0.104 and might not always be available.

```js
// Android V2 (recommended)
window.externalAppV2.postMessage(
  JSON.stringify({
    type: "getExternalAuth",
    payload: { callback: "externalAuthSetToken", force: true },
  })
);

// Android V1 (fallback)
window.externalApp.getExternalAuth(
  JSON.stringify({ callback: "externalAuthSetToken", force: true })
);

// iOS
window.webkit.messageHandlers.getExternalAuth.postMessage({
  callback: "externalAuthSetToken",
  force: true,
});
```

The response should contain a boolean if it was successful and an object containing an access token and the number of seconds that it will remain valid. Pass the response to the function defined in the options object.

```js
// To be called by external app
window.externalAuthSetToken(true, {
  access_token: "qwere",
  expires_in: 1800
});

// If unable to get new access token
window.externalAuthSetToken(false);
```

The frontend will call this method when the page first loads and whenever it needs a valid token but the previous received token has expired.

## Revoke token

When the user presses the logout button on the profile page, the external app will have to [revoke the refresh token](auth_api.md#revoking-a-refresh-token), and log the user out.

```js
// Android V2 (recommended)
window.externalAppV2.postMessage(
  JSON.stringify({
    type: "revokeExternalAuth",
    payload: { callback: "externalAuthRevokeToken" },
  })
);

// Android V1 (fallback)
window.externalApp.revokeExternalAuth(
  JSON.stringify({ callback: "externalAuthRevokeToken" })
);

// iOS
window.webkit.messageHandlers.revokeExternalAuth.postMessage({
  callback: "externalAuthRevokeToken",
});
```

When done, the external app has to call the function defined in the options object.

```js
// To be called by external app
window.externalAuthRevokeToken(true);

// If unable to logout
window.externalAuthRevokeToken(false);
```

[web-message-listener]: https://developer.android.com/reference/androidx/webkit/WebViewCompat.WebMessageListener
