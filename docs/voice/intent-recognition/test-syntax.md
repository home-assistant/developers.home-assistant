---
title: "Intent Matching Test Syntax"
sidebar_label: "Test Syntax"
---

To ensure that the template sentences work as expected, we have an extensive test suite. This test suite is based on YAML files that contain a list of input sentences and the expected matched intent and slots.

The tests are stored [on GitHub](https://github.com/home-assistant/intents/tree/main/tests) and are organized by having for each language a directory of files `tests/<language>/`:

 - `_fixtures.yaml` - Fake entities and areas that can be referenced during testing
 - `<domain>_<intent>.yaml` - Sentences for a [single intent](../../intent_builtin) and domain. These files should only test sentences that are defined in the [match sentences file](./template-sentence-syntax) with the same name.

``` yaml
# Example homeassistant_HassTurnOn.yaml
language: "en"
tests:
  # You can have multiple blocks of tests, each with different expected match data
  - sentences:
      # Multiple sentences can be tested at once
      - "turn on the ceiling fan"
      - "turn the ceiling fan on"
    # Expected match data
    intent:
      name: "HassTurnOn"
      slots:
        name: "fan.ceiling"
```

## Fixtures

When Home Assistant is matching sentences, it will provide a list of areas and entities that can be referenced in the sentence. For tests we define these in `_fixtures.yaml`.

```yaml
# Example _fixtures.yaml for English
language: "en"
areas:
  - name: "Kitchen"
    id: "kitchen"
  - name: "Living Room"
    id: "living_room"
entities:
  - name: "Kitchen Switch"
    id: "switch.kitchen"
    area: "kitchen"
  - name: "Curtain Left"
    id: "cover.curtain_left"
    area: "living_room"
```

Make sure that fixtures do not have generic names like "garage door" or "curtains". Instead, use a unique name like "garage door left" or "curtains left". This is necessary to allow defining matching sentences based on the generic names, like "open the garage door".
