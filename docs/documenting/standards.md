---
title: "Standards"
---

To ensure that the documentation for Home Assistant is consistent and easy to follow for both novice and expert users, we ask that you follow a very strict set of standards for developing the documentation.

## General Documentation

Broadly speaking documentation should be written following Microsoft's house style, which is detailed [here](https://learn.microsoft.com/style-guide/welcome/).

- The language of the documentation should be American-English.
- Don't put two spaces after a period.
- Use a serial comma (also known as the Oxford comma) before the conjunction in a list of three or more items. E.g., "Through the use of additional adapters, Home Assistant allows the use of Zigbee, Z-Wave, and other protocols".
- There is no limit for the line length. You are allowed to write in a flowing text style. This will make it easier to use the GitHub online editor in the future.
- Be objective and not gender favoring, polarizing, race related or religion inconsiderate. Contributions which do not follow this may be in breach of our [Code of Conduct](https://github.com/home-assistant/core/blob/master/CODE_OF_CONDUCT.md).
- The case of brand names, services, protocols, integrations and platforms must match its respective counterpart. E.g., "Z-Wave" **not** "Zwave", "Z-wave", "Z Wave" or "ZWave". Also, "Input Select" **not** "input select" or "Input select".
- Do not use ALL CAPITALS for emphasis - use _italics_ instead.
- All examples containing Jinja2 templates should be wrapped **outside** of the code markdown with the `{% raw %}` tag.

## Integration and Platform Pages

- All examples should be formatted to be included in `configuration.yaml` unless explicitly stated.
  - Use capital letters and `_` to indicate that the value needs to be replaced. E.g., `api_key: YOUR_API_KEY` or `api_key: REPLACE_ME`.
- Integration and platform names should be a link to their respective documentation pages.

### Configuration Variables

- The **Configuration Variables** section is only used for YAML configuration.
- The **Configuration Variables** section must use the `{% configuration %}` tag.
- Configuration variables must document the requirement status (`false` or `true`).
- Configuration variables must document the default value, if any.
- Configuration variables must document the accepted value types (see [Configuration variables details](documenting/create-page.md#configuration)).
  - For configuration variables that accept multiple types, separate the types with a comma (i.e. `string, integer`).

#### Example Configuration Variables Block

```yaml
{% configuration %}
some_key:
  description: This is a description of what this key is for.
  required: false
  type: string
  default: Optional default value - leave out if there isn't one
{% endconfiguration %}
```

### UI Variables

- For describing **UI Variables** the `{% configuration_basic %}` section can be used.

### Tables

- Be succinct. Minimize the number of columns and keep the amount of text as short as possible:
  - Tables that are too wide can be difficult to browse on handheld devices
  - Less content makes tables easier to read
- When limiting the amount of text is not possible, consider using other data structures for representing the information. For example, lists or `{% configuration_basic %}` can be used.

## YAML and Templates

We have a separate styling guide for YAML and the use of Jinja2 templates
inside that YAML.

[YAML Style Guide](documenting/yaml-style-guide.md)

## Glossary & Terminology Tooltips

The documentation should be written in a way that is understandable for
everyone. To help with that, we have a [glossary of terms](https://www.home-assistant.io/docs/glossary/)
that are used across Home Assistant, including our documentation.

If you use a term that is not in the glossary, feel free to add; or improve
the definition of an existing term.

Additionally, we have a terminology tooltip available, that can be added and
works everywhere in the documentation. This tooltip will show a definition
of the term when the user hovers over it with a link for more information.
It provides instant context to terminology an user might not be familiar with.

The syntax for adding terminology tooltips is:

```liquid
{% term <term> [<text>] %}
```

The term referenced must, of course, be listed in our glossary, which is the
source for the tooltips.

For example, if you write a text about automations, you could add a tooltip
like this:

```liquid
This is an example text about {% term automations %}, which is used
to demonstrate the use of tooltips, in this case, for the term
"automations" earlier in this sentence.
```

The `<text>` is optional and can be useful if you want to add a terminology
tooltip to a piece of text that differs from the term itself. In the following
example the automation term tooltip is added to the "automate everything" text:

```liquid
Awesome, because this allowed me to {% term automation "automate everything" %}
in my home! I love it!
```

## Renaming Pages

It can happen that an integration or platform is renamed, in this case the documentation needs to be updated as well. If you rename a page, add an entry to the `_redirects` file as shown below. Please consider to add details, like release number or old integration/platform name, to the page in a [note](/documenting/create-page.md/#html).

```text
---
...
/getting-started/scripts /docs/scripts
---
```

Adding a redirect also applies if you move content around in the [documentation](https://www.home-assistant.io/docs/).
