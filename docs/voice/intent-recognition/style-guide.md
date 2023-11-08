---
title: Response Style Guide
---

This document describes the style guide for responses.

## Be concise

Responses should be concise and to the point. They should not contain unnecessary information.

- If a command is targeting a single device, don't repeat the name of the entity in the response.
- If a command is targeting an area, don't repeat the name of the area or it's entities in the response.
- If a command is asking for a list of entities, list all if 4 or less. Otherwise list first 3 and say "+ 2 more".

Readability is important, so use below code to generate "+ 2 more" style sentence when needed. Do not create your
own variant.

```jinja2
{% if query.matched %}
  {% set match = query.matched | map(attribute="name") | sort | list %}
  {% if match | length > 4 %}
    Yes, {{ match[:3] | join(", ") }} and {{ (match | length - 3) }} more
  {%- else -%}
    Yes,
    {% for name in match -%}
      {% if not loop.first and not loop.last %}, {% elif loop.last and not loop.first %} and {% endif -%}
      {{ name }}
    {%- endfor -%}
  {% endif %}
{% else %}
  No
{% endif %}
```

## Use the correct tense

Responses should be in the present tense. For example, "The light is on" instead of "The light was on".

## Use the correct voice

Responses should be in the active voice. For example, "The light is on" instead of "The light is being turned on".

