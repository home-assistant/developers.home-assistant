---
title: "Standards"
---

To ensure that the documentation for Home Assistant is consistent and easy to follow for both novice and expert users, we ask that you follow a very strict set of standards for developing the documentation.

## General Documentation

Broadly speaking documentation should be written following Microsoft's house style, which is detailed [here](https://docs.microsoft.com/en-us/style-guide).

- The language of the documentation should be American-English.
- Don't put two spaces after a period.
- Use a serial comma (also known as the Oxford comma) before the conjunction in a list of three or more items. E.g., "Through the use of additional adapters, Home Assistant allows the use of Zigbee, Z-Wave, and other protocols".
- There is no limit for the line length. You are allowed to write in a flowing text style. This will make it easier to use the GitHub online editor in the future.
- Be objective and not gender favoring, polarizing, race related or religion inconsiderate. Contributions which do not follow this may be in breach of our [Code of Conduct](https://github.com/home-assistant/core/blob/master/CODE_OF_CONDUCT.md).
- The case of brand names, services, protocols, integrations and platforms must match its respective counterpart. E.g., "Z-Wave" **not** "Zwave", "Z-wave", "Z Wave" or "ZWave". Also, "Input Select" **not** "input select" or "Input select".
- Do not use ALL CAPITALS for emphasis - use _italics_ instead.
- All examples containing Jinja2 templates should be wrapped **outside** of the code markdown with the `{% raw %}` tag.

## Integration and Platform Pages

- The **Configuration Variables** section must use the `{% configuration %}` tag.
- The **Configuration Variables** section is only used for YAML configuration.
- For describing **UI Variables** the `{% configuration_basic %}` section can be used.
- Configuration variables must document the requirement status (`false` or `true`).
- Configuration variables must document the default value, if any.
- Configuration variables must document the accepted value types (see [Configuration variables details](documenting/create-page.md#configuration)).
  - For configuration variables that accept multiple types, separate the types with a comma (i.e. `string, integer`).
- All examples should be formatted to be included in `configuration.yaml` unless explicitly stated.
  - Use capital letters and `_` to indicate that the value needs to be replaced. E.g., `api_key: YOUR_API_KEY` or `api_key: REPLACE_ME`.
- Integration and platform names should be a link to their respective documentation pages.

Example configuration block

```yaml
{% configuration %}
some_key:
  description: This is a description of what this key is for.
  required: false
  type: string
  default: Optional default value - leave out if there isn't one
{% endconfiguration %}
```

## YAML and Templates

We have a separate styling guide for YAML and the use of Jinja2 templates
inside that YAML.

[YAML Style Guide](documenting/yaml-style-guide.md)

## Renaming Pages

It can happen that an integration or platform is renamed, in this case the documentation needs to be updated as well. If you rename a page, add an entry to the `_redirects` file as shown below. Please consider to add details, like release number or old integration/platform name, to the page in a [note](/documenting/create-page.md/#html).

```text
---
...
/getting-started/scripts /docs/scripts
---
```

Adding a redirect also applies if you move content around in the [documentation](https://www.home-assistant.io/docs/).
