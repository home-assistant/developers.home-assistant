---
author: thomasddn
authorURL: https://github.com/thomasddn
title: "Hassfest prioritizes strings.json for custom integrations"
---

The hassfest validation will now check against `strings.json` instead of `translations/en.json` for custom integrations, but only if `strings.json` exists. If `strings.json` does not exist, then the validation will run against `translations/en.json`, just like it did before.

Custom integrations might resolve to `strings.json` in combination with a translation provider (e.g. Lokalise). The advantage is that you can reference other keys for common translation values, which makes translating to different languages less tedious and less error prone.

If you are not actually using `strings.json` in your custom integration but still have it there (because it was copied from examples or core components), you can remove the file to make hassfest work like before.
