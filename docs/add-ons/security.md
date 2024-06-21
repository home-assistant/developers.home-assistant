---
title: "Add-on security"
---

Home Assistant rates every add-on based on the wanted rights. An add-on with a rating of 6 is very secure. If an add-on has a rating of 1, you shouldn't run this add-on unless you are 100% sure that you can trust the source.

## API role

For access to the Supervisor API you need to define a role or run in default mode. This is only required for the Supervisor API and not the Home Assistant proxy. All of the roles already have access to the default API calls, and do not require any additional settings.

### Available roles

| Role | Description |
|------|-------------|
| `default` | Have access to all `info` calls |
| `homeassistant` | Can access all Home Assistant API endpoints |
| `backup` | Can access all backup API endpoints |
| `manager` | Is for Add-ons that run CLIs and need extended rights |
| `admin` | Have access to every API call. That is the only one they can disable/enable the Add-on protection mode |

## Codenotary CAS

You can sign your images and also verify our base image which you build from to provide a full chain of trust. This feature is supported by our [Builder](https://github.com/home-assistant/builder) and the [build config](/docs/add-ons/configuration#add-on-extended-build). To enable this feature on the Supervisor for your add-on, you simply need to add your email address to the add-on configuration `codenotary`.

## Protection

Default, all add-ons run in protection enabled mode. This mode prevents the add-on from getting any rights on the system. If an add-on requires more rights, you can disable this protection via the API add-on options for that add-on. But be careful, an add-on with disabled protection can destroy your system!

## Making a secure add-on

As a developer, follow the following best practices to make your add-on secure:

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
