---
title: "Create a new page"
---

For a platform or component page, the fastest way is to make a copy of an existing page and edit it. The [Component overview](https://www.home-assistant.io/components/) and the [Examples section](https://www.home-assistant.io/cookbook/) are generated automatically, so there is no need to add a link to those pages.

Please honor the [Standards](documentation_standards.md) we have for the documentation.

If you start from scratch with a page, you need to add a header. Different sections of the documentation may need different headers.

```text
---
layout: page
title: "Awesome Sensor"
description: "home-assistant.io web presence"
date: 2015-06-17 08:00
sidebar: true
comments: false
sharing: true
footer: true
ha_release: "0.38"
ha_category: Sensor
ha_iot_class: "Local Polling"
ha_qa_scale: silver
---

Content... Written in markdown. 

### {% linkable_title Linkable Header %}
...
```

Please keep in mind that if the `date:` entry is in the future then the page will not show up.

Additional keys for the file header:

- `logo`: Please check the separate section below.
- `ha_release`: The release when the integration was included, e.g., "0.38". If the current release is 0.37, make `ha_release` 0.38. If it's 0.30 or 0.40 please quote it with `" "`.
- `ha_category`: This entry is used to group the integration on the [Components overview](https://www.home-assistant.io/components/).
- `ha_iot_class`: [IoT class](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things) is the classifier for the device's behavior.
- `ha_qa_scale`: [Quality scale](https://www.home-assistant.io/docs/quality_scale/) is the representation of the integration's quality.

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
- **`type:`**: The type of the variable. Allowed entries: `boolean`, `string`, `integer`, `float`, `time`, `template`, `device_class`, `icon` or `map`/`list` (for a list of entries). For multiple possibilities use `[string, integer]`. If you use `map`/`list` then should define `keys:` (see the [`template` sensor](https://www.home-assistant.io/components/sensor.template/) for an example). If you use `boolean`, then `default:` must be defined.
- **`default:`**: The default value for the variable.

### Embedding Code

You can use the [default markdown syntax](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code) to generate syntax highlighted code. For inline code wrap your code in back-ticks. 

When you're writing code that is to be executed on the terminal, prefix it with `$`.

### Templates

For the [configuration templating](https://www.home-assistant.io/docs/configuration/templating/) [Jinja](http://jinja.pocoo.org/) is used. Check the [Documentation Standards](documentation_standards.md) for further details.

If you are don't escape templates then they will be rendered and appear blank on the website.

### HTML

The direct usage of HTML is supported but not recommended. The note boxes are an exception.

```html
<p class='note warning'>
  You need to enable telnet on your router. 
</p>
```

### Images, icons and logos

The images which are displayed on the pages are stored in various directories according to their purpose. If you want to use a logo and placed `logo:` in the file header then this image should be stored in `source/images/supported_brands`. The background must be transparent.

| Type         | Location                                      |
| :----------- |:----------------------------------------------|
| logos        | source/images/supported_brands                |
| blog         | source/images/blog                            |
| screenshots  | source/images/components                      |

Not everything (product, component, etc.) should have a logo. To show something for internal parts of Home Assistant we are using the [Material Design Icons](https://materialdesignicons.com/).

### Linking From The Sidebar

If you are adding a new page that requires linking from the sidebar, you need to edit the `docs_navigation.html` file in `source/_includes/asides/docs_navigation.html`.
