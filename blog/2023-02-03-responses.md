---
author: Michael Hansen
authorURL: https://twitter.com/rhasspy
authorImageURL: /img/profile/mike_hansen.png
authorTwitter: rhasspy
title: Intent Responses and Whitespace
---

The [intents repository](https://github.com/home-assistant/intents/) which powers [Assist](https://www.home-assistant.io/docs/assist), has had two important changes.

First, data blocks in the intents YAML can now have a `response` key. For example:

```yaml
language: en
intents:
  HassTurnOn:
    data:
      - sentences:
          - "open {name}"
        response: cover
```

A response with a matching key must be defined in `responses/<language>/<intent>.yaml`:

```yaml
language: en
responses:
  intents:
    HassTurnOn:
      cover: "Opened {{ slots.name }}"
```

Response templates are in the [Jinja2 format](https://www.home-assistant.io/docs/configuration/templating/), and may access the matched intent's `slots` as well as the `state` of the affected entity.

The second change comes from [hassil](https://github.com/home-assistant/hassil), the parser for our [intent template syntax](/docs/voice/intent-recognition/template-sentence-syntax/). In addition to an 8-10x speed-up in parsing, whitespace inside templates is taken literally.

Previously, a template like `light(s | ing)` would match both "lights" and "lighting". Now, "light s" and "light ing" would be matched instead due to the extra space around `|`. The correct template would be `light(s|ing)`
