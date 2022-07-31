---
author: Allen Porter
authorURL: https://github.com/allenporter
title: "Local OAuth2 Updates"
---

As of Home Assistant Core 2022.5, integrations that register a `config_entry_oauth2_flow.LocalOAuth2Implementation` must have a [manifest dependency](https://developers.home-assistant.io/docs/creating_integration_manifest?_highlight=manifest#dependencies) on the `auth` component.

This is motivated by a broader effort to improve OAuth [Application Credentials](https://github.com/home-assistant/architecture/discussions/692#discussioncomment-2121633) handling, which required changing how the HTTP endpoint for the OAuth callback is registered.