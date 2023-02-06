---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Translation files removed from Core repository
---

We have removed all translation files from the Home Assistant Core repository
and put in place a helper script to compile English translations from the
translation strings files (`strings.json`) for development purposes.

Previously, all translation files (including all languages) were part of the
Home Assistant Core repository. Every night we would update the translations
by downloading them from Lokalise and committing them into the Core repository.

Instead, we have moved this process @ build time. We now download the latest
translations from Lokalise when we ship a new release (including betas
& nightly builds).

This approach comes with some benefits:

- We no longer have to commit translation files into the Core repository.
  This means as a developer, this is also no longer a confusing burden.
- People will no longer (incorrectly) try to contribute language
  translations via GitHub.
- Each release, including patch, beta, and nightly versions,
  will now also have the latest translations.

## Local development

For local development, we have our translations development helper script. This
always has been in place already, except now, it can compile the English
translations for all integrations at once.

```bash
python3 -m script.translations develop --all
```

This script is automatically run when a dev environment is set up, and each
time you run running Home Assistant in your VSCode (as a pre-launch task).
