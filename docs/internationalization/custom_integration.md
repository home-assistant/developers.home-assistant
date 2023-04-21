---
title: "Custom Integration Localization"
---

## Translation Strings

Unlike localized strings merged in the `home-assistant` repository, custom integrations cannot take advantage of Lokalise for user-submitted translations. However, custom integration authors can still include translations with their integrations. These will be read from the `translations` directory, adjacent to the integration source. They are named `<language_code>.json` in the `translations` directory, e.g., for the German translation `de.json`.

This file will contain the different strings that will be translatable for different things that the custom integration offers that need to be translated. These files follow the same formatting as [backend translation string files](internationalization/core.md), but a copy will exist for each translated language.

The language codes follow the [BCP47](https://tools.ietf.org/html/bcp47) format.

To make sure that your translation files are correct, test with our integration validator Hassfest. [Set up instructions here.](https://developers.home-assistant.io/blog/2020/04/16/hassfest)
