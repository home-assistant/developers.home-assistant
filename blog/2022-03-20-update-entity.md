---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorTwitter: frenck
title: "Introducing the update entity"
---

Home Assistant 2022.4 will provide a brand new entity platform:
the `update` entity.

The `update` entity can be provided by integrations to indicate there is an
update available, for a device or service, towards the Home Assistant user. It
allows you to provide additional information about the update, such as
the latest version available, a summary of the release notes and a link to the
full release announcement online.

Additionally, the `install` method can be implemented, so the user can install
the update directly from within Home Assistant.

Adding the `update` platform to your integration is relatively simple to do, as
it is just a couple of properties and, if available for the integration,
a single `install` method. Most other details are handled by Home Assistant 
automatically.

In Home Assistant Core [2021.12](https://www.home-assistant.io/blog/2021/12/11/release-202112/#brand-new-configuration-panel) we moved updates provided by
the Supervisor to the Configuration panel, using this new platform, we will
be able to extend that in the near future by the information provided by these
brand new entities.

See our [developer documentation](/docs/core/entity/update) for how to implement this in an integration.

If your integration previously provided a `binary_sensor` or `button` entity
with the `update` device class, please consider replacing those with the
`update` entity.
