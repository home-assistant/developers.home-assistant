---
title: "External Authentication"
---

By default, the frontend will take care of its own authentication tokens. If none found, it will redirect the user to the login page and it will take care that the token is up to date.

If you want to embed the Home Assistant frontend in an external app, you will want to store the authentication inside the app but make it available to the frontend. To support this, Home Assistant exposes an external authentication API.

To activate this API, load the frontend with `?external_auth=1` appended to the URL. If this is passed in, Home Assistant will expect  either `window.externalApp` (for Android) or `window.webkit.messageHandlers` (for iOS) to be defined containing the methods described below.

## Get Access Token

_This API has been introduced in Home Assistant 0.78._

When the frontend loads, it will request an access token from the external authentication. It does so by calling one of the following methods with an options object. The options object defines the callback method to be called with the response.

```js
window.externalApp.getExternalAuth({
  callback: 'externalAuthSetToken'
});
// or
window.webkit.messageHandlers.getExternalAuth.postMessage({
  callback: 'externalAuthSetToken'
});
```

The response should contain a boolean if it was successful and an object containing an access token and the number of seconds that it will remain valid. Pass the response to the function defined in the options object.

```js
// To be called by external app
window.externalAuthSetToken(true, {
  "access_token": "qwere",
  "expires_in": 1800
});

// If unable to get new access token
window.externalAuthSetToken(false);
```

The frontend will call this method when the page first loads and whenever it needs a valid token but the previous received token has expired.

## Revoke Token

_This API has been introduced in Home Assistant 0.78._

When the user presses the logout button on the profile page, the external app will have to [revoke the refresh token](auth_api.md#revoking-a-refresh-token), and log the user out.

```js
window.externalApp.revokeExternalAuth({
  callback: 'externalAuthSetToken'
});
// or
window.webkit.messageHandlers.revokeExternalAuth.postMessage({
  callback: 'externalAuthSetToken'
});
```

When done, the external app has to call the function defined in the options object.

```js
// To be called by external app
window.externalAuthRevokeToken(true);

// If unable to logout
window.externalAuthRevokeToken(false);
```
