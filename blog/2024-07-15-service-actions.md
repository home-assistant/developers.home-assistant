---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Services are now actions
---

The term "Services" has been a source of confusion for many users, as it is not immediately clear what it refers to; it could be a web or STT service, but in the context of Home Assistant, it means something entirely different (service calls).

In Home Assistant 2024.8, "Services" (as in service calls) will be renamed to "Actions". This change is part of our ongoing effort to make Home Assistant more user-friendly and easier to understand for new users. The term fits in with the UI changes we have been implementing over the past months (call services no longer exist in our automations and script editors). Effectively, one is performing actions in ones automations.

This change will be reflected in the Home Assistant UI, documentation, and other places where the term "Services" is used. For example, the "Services" tab in the Developer Tools will be renamed to "Actions".

For developers, there is no need to worry about this change. In the developer documentation, we will update all references to "services" to "service actions", as we have different types of actions in our backend (for example, device actions). The underlying functionality will remain the same, and the transition is seamless.

This is, just like the end-user change, a terminology change only.
