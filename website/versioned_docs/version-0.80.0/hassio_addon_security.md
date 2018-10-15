---
title: Add-on security
id: version-0.80.0-hassio_addon_security
original_id: hassio_addon_security
---

Hass.io rates every add-on based on the wanted rights. An add-on with a rating of 6 is very secure. If an add-on has a rating of 1, you shouldn't run this add-on unless you are 100% sure that you can trust the source.

## API Role

For access to Hass.io API you need define a role or you run in default mode. This is only required for Hass.io API not Home Assistant proxy. Any of the role have also the default API calls inheret for that are no settings are required.

### Available Roles

| Role | Description |
|------|-------------|
| default | Have access to all `info` calls |
| homeassistant | Can access to all Home Assistant API endpoints |
| backup | Can access to all snapshot API endpoints |
| manager | Is for Add-ons they run CLIs and need extended rights |
| admin | Have access to every API call. That is the only one they can disable/enable the Add-on protection mode |

## Protection

Default, all add-ons run in protection enabled mode. This mode prevents the add-on from getting any rights on the system. If an add-on requires more rights, you can disable this protection via the API add-on options for that add-on. But be carful, an add-on with disabled protection can destroy your system!

## Making a secure add-on

As a developer, follow the following best practices to make your add-on secure:

- Don't run on host network
- Create an AppArmor profile
- Map folders read only if you don't need write access
- If you need any API access, make sure you that you not grant to highest permission if you don't need it
