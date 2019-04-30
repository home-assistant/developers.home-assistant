---
title: "Add-on security"
---

Hass.io rates every add-on based on the wanted rights. An add-on with a rating of 6 is very secure. If an add-on has a rating of 1, you shouldn't run this add-on unless you are 100% sure that you can trust the source.

## API Role

For access to Hass.io API you need define a role or you run in default mode. This is only required for Hass.io API not Home Assistant proxy. Any of the roles already have access to the default API calls, and do not require any additional settings.

### Available Roles

| Role | Description |
|------|-------------|
| default | Have access to all `info` calls |
| homeassistant | Can access all Home Assistant API endpoints |
| backup | Can access all snapshot API endpoints |
| manager | Is for Add-ons that run CLIs and need extended rights |
| admin | Have access to every API call. That is the only one they can disable/enable the Add-on protection mode |

## Protection

Default, all add-ons run in protection enabled mode. This mode prevents the add-on from getting any rights on the system. If an add-on requires more rights, you can disable this protection via the API add-on options for that add-on. But be careful, an add-on with disabled protection can destroy your system!

## Making a secure add-on

As a developer, follow the following best practices to make your add-on secure:

- Don't run on host network
- Create an AppArmor profile
- Map folders read only if you don't need write access
- If you need any API access, make sure that you do not grant permission that aren't needed

## Use Home Assistant User backend

Instead of allowing users to set new login credential in plain text config, use the Home Assistant [Auth backend][hassio-api-auth]. You can enable the access to API with `auth_api: true`. Now you are able to send the login credential to auth backend and validate it again Home Assistant.

We have some sample and helpers around that system collected in a [GitHub repository][hassio-auth]. Feel free to copy and paste it or provide your own scripts.

[hassio-auth]: https://github.com/home-assistant/hassio-auth
[hassio-api-auth]: https://github.com/home-assistant/hassio/blob/dev/API.md#auth--sso-api
