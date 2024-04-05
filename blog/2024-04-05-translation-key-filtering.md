---
author: Joost Lekkerkerker
authorURL: https://github.com/joostlek
authorImageURL: https://avatars.githubusercontent.com/u/7083755?v=4
title: "Changing the way translation keys are handled"
---

In Home Assistant Core 2024.4.2, we are changing the way translation keys are downloaded.

Previously the script would download every translated string.
With this change, we only download the strings that are verified.

A verified string is a translated string, and it becomes unverified when the original string changes.
So whenever someone changes something in the original string, the translated string becomes unverified and needs to be reviewed again.
This is very beneficial for the translation keys that make use of translation key placeholders, since they can now never have a mismatch between the original and translated string.

More information about this change can be found in the [pull request](https://github.com/home-assistant/core/pull/114968).
