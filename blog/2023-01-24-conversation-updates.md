---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
title: "Future proofing the Conversation integration"
---

The Home Assistant 2023.2 release contains [PR 86592](https://github.com/home-assistant/core/pull/86592) and [PR 86484](https://github.com/home-assistant/core/pull/86484) which include breaking changes to [the conversation agent](/docs/core/conversation/custom_agent) API to future proof it.

- Setting an agent now requires a config entry: `conversation.async_set_agent(hass, config_entry, agent).
- Unsetting an agent now goes via a new endpoint: `conversation.async_unset_agent(hass, config_entry)
- `AbstractConversationAgent` API has changed:
  - All onboarding logic removed
  - `async_process` now takes new `ConversationInput` parameter with the same arguments. Language is now always set.
  - `async_process` should now always return a `ConversationResult`. It's no longer allowed to return `None` or expect error handling to be done for you.
