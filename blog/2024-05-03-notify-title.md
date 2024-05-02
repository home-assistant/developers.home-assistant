---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Second phase of notify entity platform implementation
---

### Title option for send_message service notify entity platform

Recently we added the notify [entity platform](https://developers.home-assistant.io/docs/core/entity/notify/). The new `notify` platform method implements and service `send_message` now also accepts an optional `title` as argument. This allows some new integrations that can be migrated now to use the new entity platform:

- cisco_webex_teams
- file
- sendgrid
- syslog
- tibber

The [architecture discussion](https://github.com/home-assistant/architecture/discussions/1041) is still ongoing.

When integrations are migrated, users will need to use the new `notify.send_message` service, so the migration changes will cause automations to break after the deprecation period is over.
