---
title: "Custom Component Localization"
---

## Translation Strings

Unlike localized strings merged in the `home-assistant` repository, custom components cannot take advantage of Lokalise for user-submitted translations. However, custom component authors can still include translations with their components.

Custom components files must be located in the `translations` directory, adjacent to the component source. They are named `<language_code>.json` in the `translations` directory, e.g., for the German translation `de.json`.

This file will contain the different strings that will be translatable for different things that the custom components offers that need to be translated. These files follow the same formatting as [backend translation string files](internationalization/core.md), but a copy will exist for each translated language.

The language codes follow the [BCP47](https://tools.ietf.org/html/bcp47) format. The [frontend translation files](https://github.com/home-assistant/frontend/tree/master/src/translations) can also be referred to if you are unsure of the correct language code to use.

To make sure that your translation files are correct, test with our integration validator Hassfest. [Set up instructions here.](https://developers.home-assistant.io/blog/2020/04/16/hassfest)
