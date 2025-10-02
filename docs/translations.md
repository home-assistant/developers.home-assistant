---
title: "Contributing translation"
---

Translations for Home Assistant are managed through [Lokalise](https://lokalise.com/), an online translation management tool. Our translations are split between four projects: a backend project for platform-specific translations, a frontend project for UI translations, and two for the official companion apps. Click the links below to join the projects! Even if your language is completely translated, extra proofreading is a big help! Please feel free to review the existing translations, and vote for alternatives that might be more appropriate.

- [Join the frontend translation team](https://app.lokalise.com/signup/3420425759f6d6d241f598.13594006/all/)
- [Join the backend translation team](https://app.lokalise.com/signup/130246255a974bd3b5e8a1.51616605/all/)
- [Join the iOS translation team](https://app.lokalise.com/signup/834452985a05254348aee2.46389241/all/)
- [Join the Android translation team](https://app.lokalise.com/public/145814835dd655bc5ab0d0.36753359/)

For more information about the translation editor and tools, please see the [Lokalise translate and collaborate documents](https://docs.lokalise.com/en/collections/2909016-translate-and-collaborate).

Translations are downloaded from Lokalise on every build, so all major, minor, beta releases and nightly builds will have the latest translations available. 

## Translation placeholders

Some translation strings will contain special placeholders that will be replaced at runtime. 

Placeholders defined in square brackets `[]` (shown in green in Lokalise) are [Lokalise key references](https://docs.lokalise.com/en/articles/1400528-key-referencing). These are primarily used to link translation strings that will be duplicated, rather then redefining the same translation over and over again. Where sensible, the translation should make use of those (the square brackets placeholder value can be easily taken over by clicking on the "Source Alt+0" button in the Lokalise edit mode). Different languages may not have the same duplicates as English, and are welcome to link duplicate translations that are not linked in English. 

Placeholders shown in curly brackets `{}` are [translation arguments](https://formatjs.github.io/docs/core-concepts/icu-syntax/) that will be replaced with a live value when Home Assistant is running. Any translation argument placeholders present in the original string must be included in the translated string and must not be translated! These placeholders may include special syntax for defining plurals or other replacement rules. The above linked format.js guide explains the syntax for adding plural definitions and other rules.

## Rules

1. Only native speakers should submit translations.
2. Stick to [Material Design guidelines](https://material.io/design/communication/writing.html).
3. Don't translate or change proper nouns like `Home Assistant`, `Supervisor` or `Hue`.
4. For a region-specific translation, keys that will be the same as the base translation should clone the source string. You can do this with **Ctrl+Insert** or selecting **Insert Source** in the interface. This helps keep track of what has, or has not been reviewed whilst also simplifying the workflow. 
5. Translations under the `state_badge` keys will be used for the notification badge display. These translations should be short enough to fit in the badge label without overflowing. This can be tested in the Home Assistant UI either by editing the label text with your browsers development tools, or by using the States tab of developer tools in the Home Assistant UI. In the UI, enter a new entity ID (`device_tracker.test`), and enter the text you want to test in state.
6. If text will be duplicated across different translation keys, make use of the Lokalise key reference feature where possible. The base translation provides examples of this underneath the `states` translations. Please see the [Lokalise key referencing](https://docs.lokalise.com/articles/1400528-key-referencing) documentation for more details.

## Adding a new language

If your language is not listed you can request it at [GitHub](https://github.com/home-assistant/frontend/discussions/new?category=localization). Please provide both the English name and the native name for your language. For example:

```txt
English Name: German
Native Name: Deutsch
```

:::info
Region specific translations (`en-US`, `fr-CA`) will only be included if translations for that region need to differ from the base language translation.
:::

### Maintainer steps to add a new language

1. Language tags  have to follow [BCP 47](https://tools.ietf.org/html/bcp47). A list of most language tags can be found here: [IANA subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Examples: `fr`, `fr-CA`, `zh-Hans`. Only include the country code if country specific overrides are being included, and the base language is already translated.
2. Add the language tag and native name in `src/translations/translationMetadata.json`.  Examples: "Français", "Français (CA)"
3. Add the new language in Lokalize.
Note: Sometimes you have to change the tag in Lokalise (Language -> Language settings -> custom ISO code).

## Language specific guidelines

Most languages have multiple possible translations of a sentence. Please take a look at the guidelines for your language here, where you can also find some typical mistakes to prevent.
The sections are written in their corresponding languages, as this makes explaining the grammar easier and only native speakers should submit translations (see [Rules](#rules)).

### German

- Du/Sie: Duze in den Übersetzungen, und verwende nicht das formale "Sie".

#### Typische Fehler

- Achte auf den richtigen Imperativ. Der Imperativ ist die Befehlsform, z. B. "Gib mir das Wasser". Falsch wäre hier: "Gebe mir das Wasser" (siehe [Bildung des Imperativs](https://www.duden.de/sprachwissen/sprachratgeber/Bildung-des-Imperativs)).

### French

- *Blueprint*: il a été décidé de ne pas traduire ce mot et de le considérer comme un nom propre. Cela évite les confusions avec les traductions de *map* et *template* et facilite la recherche de Blueprint à importer sur Internet. Il faut donc toujours utiliser `Blueprint` avec une majuscule.
