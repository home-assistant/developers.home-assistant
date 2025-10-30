---
title: "Removing an integration page"
---

If you remove an integration, also remove the related integration documentation.

1. Delete the related [integration documentation page](https://github.com/home-assistant/home-assistant.io/tree/current/source/_integrations).
2. Remove the related logos and icons from the [Brands repository](https://github.com/home-assistant/brands).
3. Remove the entry in the [`codeowners` file](https://github.com/home-assistant/home-assistant.io/blob/current/CODEOWNERS), as they did in [this PR](https://github.com/home-assistant/home-assistant.io/pull/41531/files#diff-fcf14c4b7b34fe7a11916195871ae66a59be87a395f28db73e345ebdc828085bL268).
4. Add a 301 entry in the [redirect file](https://github.com/home-assistant/home-assistant.io/blob/current/source/_redirects#L516), in the section on **Removed integrations**.