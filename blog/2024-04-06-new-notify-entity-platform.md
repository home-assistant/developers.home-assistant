---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: New notify entity platform
---

### New notify entity platform

The notify platform is now available as an entity platform. The MVP for the new `notify` platform [implements](https://developers.home-assistant.io/docs/core/entity/notify/) them method and service `send_message` that accepts `message` as a required attribute. No entity features nor device classes are implemented yet.
Unlike the legacy `notify.notify` service we have no targets as argument, as it is an entity we can target multiple `notify` entities when calling `send_message`.

The [architecture discussion](https://github.com/home-assistant/architecture/discussions/1041) is ongoing, and is about the device classes to implement and the implementation of recipient support in the form of [contacts via a contact registry](https://github.com/home-assistant/architecture/discussions/1041#discussioncomment-8947842).

Existing integrations that implement the legacy `notify` services will be migrated in phases. The first step is to migrate the integrations than only use `message` as an attribute to notify.

The integrations identified for migration are:

- mastodon
- knx
- free_mobile
- flock
- circuit
- ecobee
- clickatell
- clicksend
- demo
- command_line

As soon we have `title` and/or `recipient` support we can migrate more integrations to use the new platform. Any help is very appreciated!

As integrations are migrated users will need to use other services, so the migration changes will be breaking changes.
