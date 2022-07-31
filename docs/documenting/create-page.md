---
title: "Create a new page"
---

For a platform or integration page, the fastest way is to make a copy of an existing page and edit it. The [Integration overview](https://www.home-assistant.io/integrations/) and the [Examples section](https://www.home-assistant.io/cookbook/) are generated automatically, so there is no need to add a link to those pages.

Please honor the [Standards](documenting/standards.md) we have for the documentation.

If you start from scratch with a page, you need to add a header. Different sections of the documentation may need different headers.

```text
---
title: "Awesome Sensor"
description: "home-assistant.io web presence"
ha_release: "0.38"
ha_category: Sensor
ha_iot_class: "Local Polling"
ha_quality_scale: silver
ha_config_flow: true
ha_codeowners:
  - '@balloob'
ha_domain: awesome
---

Content... Written in markdown.

### Title Header
...
```

Additional keys for the file header:

- `title`: This title should match with the name of the integration as written in the integration manifest file.
- `ha_release`: The release when the integration was included, e.g., "0.38". If the current release is 0.37, make `ha_release` 0.38. If it's 0.30 or 0.40 please quote it with `' '`.
- `ha_category`: This entry is used to group the integration on the [Integration overview](https://www.home-assistant.io/integrations/).
- `ha_iot_class`: [IoT class](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things) is the classifier for the device's behavior.
- `ha_quality_scale`: [Quality scale](https://www.home-assistant.io/docs/quality_scale/) is the representation of the integration's quality.
- `ha_config_flow`: Set to `true` if the integration has a [Data Entry Flow](/data_entry_flow_index.md), omit otherwise.
- `ha_codeowners`: GitHub usernames or team names (starting with `@`) of people that are responsible for this integration. This should match with the codeowners as listed in the integration manifest file.
- `ha_domain`: The domain of the integration in Home Assistant Core. This must match the name from the integration manifest file.

There are [pre-defined variables](https://jekyllrb.com/docs/variables/) available but usually, it's not necessary to use them when writing documentation.

A couple of points to remember:

- Document the needed steps to retrieve API keys or access token for the third party service or device if needed.
- Add screenshots to support the user where it makes sense.
- Add the type of the device(s) (incl. firmware) you have tested when you know that there are multiple out there.

### Configuration

Every platform page should contain a configuration sample. This sample must contain only the **required** variables to make it easy to copy and paste it for users into their `configuration.yaml` file.

The **Configuration Variables** section must use the `{% configuration %} ... {% endconfiguration %}` tag.

```text
{% configuration %}
api_key:
  description: The API key to access the service.
  required: true
  type: string
name:
  description: Name to use in the frontend.
  required: false
  default: The default name to use in the frontend.
  type: string
monitored_conditions:
  description: Conditions to display in the frontend.
  required: true
  type: map
  keys:
    weather:
      description: A human-readable text summary.
    temperature:
      description: The current temperature.
{% endconfiguration %}
```

Available keys:

- **`description:`**: That the variable is about.
- **`required:`**: If the variable is required.

```text
required: true            #=> Required
required: false           #=> Optional
required: inclusive       #=> Inclusive
required: exclusive       #=> Exclusive
required: any string here #=> Any string here
```

- **`type:`**: The type of the variable. Allowed entries: `action`, `boolean`, `string`, `integer`, `float`, `time`, `template`, `device_class`, `icon`, `map`/`list` (for a list of entries), `date`, `datetime`, `selector`, and `any`. For multiple possibilities use `[string, integer]`. If you use `map`/`list` then should define `keys:` (see the [`template` sensor](https://www.home-assistant.io/integrations/sensor.template/) for an example). If you use `boolean`, then `default:` must be defined. 

### Embedding Code

You can use the [default markdown syntax](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code) to generate syntax highlighted code. For inline code wrap your code in back-ticks.

When you're writing code that is to be executed on the terminal, do not prefix them with `$`, since this makes it hard to copy and paste the commands. However, an exception is made when there is a need to distinguish between typed commands and command output. In those cases, prefixing the commands with a `$` is required.

### Templates

For the [configuration templating](https://www.home-assistant.io/docs/configuration/templating/) [Jinja](http://jinja.pocoo.org/) is used. Check the [Documentation Standards](documenting/standards.md) for further details.

If you don't escape templates then they will be rendered and appear blank on the website.

### HTML

The direct usage of HTML is supported but not recommended. The note boxes are an exception.

```html
<div class='note warning'>
  You need to enable telnet on your router.
</div>
```

Please note, if you want to use Markdown inside an HTML block, it has to be surrounded by a new line.

```html
<div class='note warning'>
  
  You need to enable [**telnet**](https://en.wikipedia.org/wiki/Telnet) on your router.
  
</div>
```

### Images, icons and logos

Having a logo with the integration, makes an integration quickly identifiable with the end-user.
From the documentation side of things, no specific configuration is needed to enable the use of a logo,
however, the logo must exist in our Brands repository.

To add a logo and icon for your integration, open up a pull request at: the [Home Assistant Brands](https://github.com/home-assistant/brands).

Other images, displayed on the pages, are stored in various directories according to their purpose:

| Type        | Location                       |
| :---------- | :----------------------------- |
| blog        | source/images/blog             |
| screenshots | source/images/integration      |

### Linking From The Sidebar

If you are adding a new page that requires linking from the sidebar, you need to edit the `docs_navigation.html` file in `source/_includes/asides/docs_navigation.html`.
