---
title: "Add-on security"
---

Hass.io rates every add-on based on the wanted rights. An add-on with a rating of 6 is very secure. If an add-on has a rating of 1, you shouldn't run this add-on unless you are 100% sure that you can trust the source.

## Protection

Default, all add-ons run in protection enabled mode. This mode prevents the add-on from getting any rights on the system. If an add-on requires more rights, you can disable this protection via the API add-on options for that add-on. But be carful, an add-on with disabled protection can destroy your system!

## Making a secure add-on

As a developer, follow the following best practices to make your add-on secure:

- Don't run on host network
- Create an AppArmor profile
- Map folders read only if you don't need write access
