---
title: "Standards"
---

To ensure that the documentation for Home Assistant is consistent and easy to follow for both novice and expert users, we ask that you follow a very strict set of standards for developing the documentation.

## Style guide

Documentation should follow the [Microsoft Style Guide](https://learn.microsoft.com/style-guide/welcome/). For more details, refer to the section [General style guide](documenting/general-style-guide.md) and the [YAML style guide](documenting/yaml-style-guide.md).

## Integration and platform pages

- All examples should be formatted to be included in `configuration.yaml` unless explicitly stated.
  - Use capital letters and `_` to indicate that the value needs to be replaced. For example, `api_key: YOUR_API_KEY` or `api_key: REPLACE_ME`.
- Integration and platform names should be a link to their respective documentation pages.

### Configuration variables

- The **Configuration Variables** section is only used for YAML configuration.
- The **Configuration Variables** section must use the `{% configuration %}` tag.
- Configuration variables must document the requirement status (`false` or `true`).
- Configuration variables must document the default value, if any.
- Configuration variables must document the accepted value types (see [configuration variables details](documenting/create-page.md#configuration)).
  - For configuration variables that accept multiple types, separate the types with a comma (i.e. `string, integer`).

#### Example configuration variables block

```yaml
{% configuration %}
some_key:
  description: This is a description of what this key is for.
  required: false
  type: string
  default: Optional default value - leave out if there isn't one
{% endconfiguration %}
```

### UI variables

- For describing **UI Variables** the `{% configuration_basic %}` section can be used.

## YAML and templates

We have a separate styling guide for YAML and the use of Jinja2 templates
inside that YAML.

[YAML Style Guide](documenting/yaml-style-guide.md)

## Glossary & terminology tooltips

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

## Renaming pages

It can happen that an integration or platform is renamed, in this case the documentation needs to be updated as well. If you rename a page, add an entry to the `_redirects` file as shown below. Please consider to add details, like release number or old integration/platform name, to the page in a [note](/documenting/create-page.md#html).

```text
---
...
/getting-started/scripts /docs/scripts
---
```

Adding a redirect also applies if you move content around in the [documentation](https://www.home-assistant.io/docs/).
