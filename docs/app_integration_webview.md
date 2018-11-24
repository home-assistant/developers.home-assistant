---
title: "Authenticated Webview"
---

Your application already asked the user to authenticate. This means that your app should not ask the user to authenticate again when they open the Home Assistant UI.

To make this possible, the Home Assistant UI supports [external authentication](frontend_external_auth). This allows your app to provide hooks so that the frontend will ask your app for access tokens.

Note that this feature requires a direct connection to the instance.
