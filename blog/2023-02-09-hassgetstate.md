---
author: Michael Hansen
authorURL: https://twitter.com/rhasspy
authorImageURL: /img/profile/mike_hansen.png
authorTwitter: rhasspy
title: The HassGetState intent
---

We've added a new [built-in intent](/docs/intent_builtin/): `HassGetState`

This intent will enable users to ask questions to [Assist](https://www.home-assistant.io/docs/assist) once we've added translations to the [intents repository](https://github.com/home-assistant/intents/).
You can try it out now by adding [custom sentences](https://www.home-assistant.io/docs/assist/custom_sentences):

```yaml
# Example <config>/custom_sentences/en/get_state.yaml

language: en
intents:
  HassGetState:
    data:
      - sentences:
          - what is <name> [in <area>]
          - is <name> {state} [in <area>]

responses:
  intents:
    HassGetState:
      default: "{{ slots.name }} is {{ state.state_with_unit }}"

lists:
  state:
    values:
      - "on"
      - "off"
      - open
      - closed
      - locked
      - unlocked
      - wet
      - dry
```

With these sentences, you can now ask Assist things like "what is the outside temperature?", "is the front door locked?", or "is the floor in the basement wet?"
This relies on having entity names (or aliases) set up just right, of course. For example, a sensor named "outside temperature" and a binary moisture sensor named "floor" in the "basement" area.

As we add translations, more types of questions will be possible such as "which lights are in the living room?" and "are any doors unlocked?"
