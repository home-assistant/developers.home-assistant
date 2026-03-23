---
title: Documentation structure and example text
---

This page shows the recommended structure of an integration page and useful reusable text.

Use this template together with the following documentation:

- The integration documentation template in the `home-assistant.io` repository under [/_integrations/_integration_docs_template.markdown](https://github.com/home-assistant/home-assistant.io/tree/current/source/_integrations/_integration_docs_template.markdown).
- [Documentation standards](/docs/documenting/standards).
- [Documentation style guide](/docs/documenting/general-style-guide).
- The documentation rules of the [Integration Quality Scale](/docs/core/integration-quality-scale/).

## Integration page structure

This section outlines the high-level structure of an integration page. To view example text, refer to the integration documentation template in the `homeassistant.io` repository under `/_integrations/_integration_docs_template.md`. The example text includes some reusable text blocks (includes) such as `include integrations/config_flow.md` and styling elements such as `configuration_basic`.

The examples are taken from the [Integration Quality Scale](/docs/core/integration-quality-scale/).

### Basic structure of an integration page

- Introduction
  - Use case
- Supported/unsupported devices
- Prerequisites
- Configuration
- Configuration options
- Supported functionality
- Actions
- Examples
- Data updates
- Known limitations
- Troubleshooting
- Community notes
- Removing the integration

## Reusable text for integrations

You can [reuse text](general-style-guide.md#reusable-text) that's repeated across many pages.

The following snippets are useful for integration pages.

### Configuration

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/config_flow.png'
    alt='Screenshot showing predefined configuration text block'
  />
  Screenshot showing the predefined configuration text block
</p>

To use this element, add the following line:

```markdown
{% include integrations/config_flow.md %}
```

For the current snippet contents, see [`config_flow.md`](https://github.com/home-assistant/home-assistant.io/blob/current/source/_includes/integrations/config_flow.md)

#### Configuration_basic block

Use the `configuration_basic` block to describe configuration options if your integration is set up through a config flow.

<p class='img'>
  <img class='invertDark'
      src='/img/en/documentation/configuration_variables_ui.png'
      alt='Screenshot showing a configuration variable block for integrations that are set up in the UI'
    />
    Screenshot showing a configuration variable block for integrations that are set up in the UI
</p>

```markdown
{% configuration_basic %}
Host:
    description: "The IP address of your bridge. You can find it in your router or in the Integration app under **Bridge Settings** > **Local API**."
Local access token:
    description: "The local access token for your bridge. You can find it in the Integration app under **Bridge Settings** > **Local API**."
{% endconfiguration_basic %}
```

#### Configuration block for YAML integrations

Use the `configuration` block to describe configuration options if your integration is set up via YAML only.

<p class='img'>
  <img class='invertDark'
      src='/img/en/documentation/configuration_variables_yaml.png'
      alt='Screenshot showing a configuration variable block for YAML integrations'
    />
    Screenshot showing a configuration variable block for YAML integrations
</p>

```markdown
{% configuration %}
Host:
    description: "The IP address of your bridge. You can find it in your router or in the Integration app under **Bridge Settings** > **Local API**."
    required: false
    type: string
Local access token:
    description: "The local access token for your bridge. You can find it in the Integration app under **Bridge Settings** > **Local API**."
    required: false
    type: string
{% endconfiguration %}
```
