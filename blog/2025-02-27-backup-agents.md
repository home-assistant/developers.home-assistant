---
author: Martin Hjelmare
authorURL: https://github.com/MartinHjelmare
title: "Backup agents"
---

In the January release of 2025 we introduced a new feature for backups called backup agents.

Previously backup platforms were only used to pause or prepare integration operations before creating a backup and/or run some operation after a backup. With the introduction of backup agents, the backup platform now allows integrations to add one or more backup agents that can upload backups to some local or remote location.

The first integration to implement a backup agent was the Home Assistant Cloud integration. In the February release of 2025, three more integrations implemented backup agents: Google Drive, OneDrive and Synology DSM. If you are an integration author, and want to add support for your favorite backup location, you can find more information on how to implement backup agents in the [developer documentation](/docs/core/platform/backup).
