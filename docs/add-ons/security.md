---
title: "App security"
---

Home Assistant rates every app (formerly known as add-on) based on the wanted rights. An app with a rating of 6 is very secure. If an app has a rating of 1, you shouldn't run this app unless you are 100% sure that you can trust the source.

## API role

For access to the Supervisor API you need to define a role or run in default mode. This is only required for the Supervisor API and not the Home Assistant proxy. All of the roles already have access to the default API calls, and do not require any additional settings.

### Available roles

| Role | Description |
|------|-------------|
| `default` | Have access to all `info` calls |
| `homeassistant` | Can access all Home Assistant API endpoints |
| `backup` | Can access all backup API endpoints |
| `manager` | Is for Apps that run CLIs and need extended rights |
| `admin` | Have access to every API call. That is the only one they can disable/enable the App protection mode |

## Codenotary CAS

You can sign your images and also verify our base image which you build from to provide a full chain of trust. This feature is supported by our [Builder](https://github.com/home-assistant/builder) and the [build config](/docs/add-ons/configuration#app-extended-build). To enable this feature on the Supervisor for your app, you simply need to add your email address to the app configuration `codenotary`.

## Protection

By default, all apps run in protection-enabled mode. This mode prevents the app from getting any rights on the system. If an app requires more rights, you can disable this protection via the API app options for that app. But be careful, an app with disabled protection can destroy your system!

## Making a secure app

As a developer, follow the following best practices to make your app secure:

- Don't run on host network
- Create an AppArmor profile
- Map folders read only if you don't need write access
- If you need any API access, make sure that you do not grant permission that aren't needed
- Sign the image with [Codenotary CAS](https://cas.codenotary.com/)

## Use Home Assistant user backend

Instead of allowing users to set new login credentials in plain text config, use the Home Assistant [Auth backend](/docs/api/supervisor/endpoints#auth). You can enable the access to the API with `auth_api: true`. Now you are able to send the login credentials to the auth backend and validate them in Home Assistant.

## Authenticating a user when using ingress

When the addon is accessed via the supervisor's ingress, the authorized user can be identified by its session token. The supervisor then adds some headers identifying the user to every request:

| Header name                | Description                                 |
| -------------------------- | ------------------------------------------- |
| X-Remote-User-Id           | ID of the authenticated Home Assistant user |
| X-Remote-User-Name         | The username of the authenticated user      |
| X-Remote-User-Display-Name | The display name of the authenticated user  |
