---
title: "General style guide"
---

Documentation should follow the [Microsoft Style Guide](https://learn.microsoft.com/style-guide/welcome/).

A few of the most common cases picked up in reviews are listed below:

- The language of the documentation should be American-English.
- Don't put two spaces after a period.
- Use a serial comma (also known as the Oxford comma) before the conjunction in a list of three or more items. For example, "Through the use of additional adapters, Home Assistant allows the use of Zigbee, Z-Wave, and other protocols".
- There is no limit for the line length. You are allowed to write in a flowing text style. This will make it easier to use the GitHub online editor in the future.
- Be objective and not gender favoring, polarizing, race related or religion inconsiderate. Contributions which do not follow this may be in breach of our [Code of Conduct](https://github.com/home-assistant/core/blob/master/CODE_OF_CONDUCT.md).
- The case of brand names, services, protocols, integrations, and platforms must match their respective counterparts. For example, "Z-Wave" _not_ "Zwave", "Z-wave", "Z Wave", or "ZWave". Also, "Input Select" _not_ "input select" or "Input select".
- Do not use ALL CAPITALS for emphasis - use _italics_ instead.
- Use [sentence-style capitalization](https://learn.microsoft.com/en-us/style-guide/capitalization), also in headings.
- Use **bold** to markup UI strings, for example:
  - Under **Settings**, select the three dots menu. Then, select **Restart Home Assistant** > **Quick reload**.
- Don't use "e.g.". Instead, use _for example_, _such as_, or _like_.
- All examples containing Jinja2 templates should be wrapped _outside_ of the code markdown with the `{% raw %}` tag.

## Tables

- Avoid the use of tables. Use lists instead. If you cannot avoid a table, minimize the number of columns and keep the amount of text as short as possible:
  - Tables that are too wide can be difficult to browse on handheld devices.
  - Less content makes tables easier to read.
- When limiting the amount of text is not possible, consider using other data structures for representing the information. For example, lists or `{% configuration_basic %}` can be used.

## Markdown

A few notes about the use of markdown in this documentation:

### Markdown lists

- For unordered lists, use `-`, not `*`.
- For ordered lists, use increasing numbers.

  ```yaml
  # Good
  1. List item 1.
  2. List item 2.
  3. List item 3.

  # Bad
  1. List item 1.
  1. List item 2.
  1. List item 3.
  ```
## Images

If you use images, upload them to the images folder in the documentation repository. Do not link to external images, for example on your private GitHub repository.

See also the [section on images and integration logos](https://developers.home-assistant.io/docs/documenting/create-page#images-icons-and-logos).

## YAML and templates

We have a separate styling guide for YAML and the use of Jinja2 templates
inside that YAML.

[YAML Style Guide](documenting/yaml-style-guide.md)
