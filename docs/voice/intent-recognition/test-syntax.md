---
title: "Intent matching test syntax"
sidebar_label: "Test syntax"
---

To ensure that the template sentences work as expected, we have an extensive test suite. This test suite is based on YAML files that contain input sentences along with the slots and the response they are expected to produce.

The tests are stored [on GitHub](https://github.com/home-assistant/intents/tree/main/tests) and mirror the layout of the [template sentences](/docs/voice/intent-recognition/template-sentence-syntax), one file per intent and slot combination:

- `tests/<language>/<intent>/<slot_combination>.yaml`

Each test file is self-contained: it declares its own entities, areas, floors, timers, and media alongside the sentences that use them. Nothing is shared between files, so a test file can be read and changed on its own.

```yaml
# Example tests/en/HassTurnOn/name_only.yaml
language: "en"

entities:
  - name: "Overhead Light"
    domain: "light"
  - name: "Ceiling Fan"
    domain: "fan"
  - name: "Sliding Door"
    domain: "cover"

tests:
  # You can have multiple blocks of tests, each with different expected results
  - sentences:
      # Multiple sentences can be tested at once
      - "turn on Overhead Light"
      - "Overhead light on"
    slots:
      name: "Overhead Light"
    response: "Turned on the light"

  - sentences:
      - "open Sliding Door"
    slots:
      name: "Sliding Door"
    response: "Opening"
```

Every sentence must match the intent and slot combination that the file is named after. The `slots` block must name exactly the slots that the combination declares in `intents.yaml`, and `response` is the fully rendered text that Home Assistant will speak, compared as an exact string.

**Every sentence template in a slot combination must be exercised by at least one test sentence.** Tests fail with a list of untested templates if one is never matched, so adding a template means adding a sentence that reaches it.

## Fixtures

When Home Assistant is matching sentences, it provides the areas, floors, and entities that can be referenced. In tests these are declared at the top of the file. Identifiers are derived from the names, so there is no need to write them out.

```yaml
language: "en"

floors:
  - name: "First Floor"

areas:
  - name: "Kitchen"
    floor: "First Floor"
  - name: "Living Room"

entities:
  - name: "Kitchen Switch"
    domain: "switch"
    area: "Kitchen"
  - name: "Curtain Left"
    domain: "cover"
    area: "Living Room"
```

An entity accepts:

- `name` (required) - the entity name that sentences will refer to.
- `domain` (required) - the entity domain, such as `light` or `cover`.
- `area` - the name of an area declared in the same file.
- `state` - the entity state, needed when the response reads it. Use the in-out form (`in:`/`out:`) when the spoken state differs from the state Home Assistant stores.
- `state_with_unit` - the state combined with its unit of measurement.
- `attributes` - extra attributes the response or the match depends on. A device class goes here, as `device_class`, because that is how Home Assistant exposes it.
- `is_exposed` - set to `false` to test that an unexposed entity is not matched.

```yaml
entities:
  - name: "Living Room Window"
    domain: "cover"
    state: "open"
    attributes:
      device_class: "window"
```

Make sure that fixtures do not have generic names like "garage door" or "curtains". Instead, use a unique name like "garage door left" or "curtains left". This is necessary to allow defining matching sentences based on the generic names, like "open the garage door".

### Timers and media

Intents that act on timers or media declare them the same way, either for the whole file or for a single block of tests:

```yaml
# Example tests/en/HassTimerStatus/area_only.yaml
language: "en"

areas:
  - name: "Kitchen"

timers:
  - is_active: true
    area: "Kitchen"
    start_minutes: 5
    total_seconds_left: 180
    rounded_hours_left: 0
    rounded_minutes_left: 3
    rounded_seconds_left: 0

tests:
  - sentences:
      - "how much time is left on the kitchen timer"
      - "kitchen timer status"
    slots:
      area: "Kitchen"
    response: "3 minutes left."
```

```yaml
# Example tests/en/HassMediaSearchAndPlay/area_only.yaml
language: "en"

areas:
  - name: "Kitchen"

media:
  - title: "The Office"

tests:
  - sentences:
      - "play The Office in the Kitchen"
    slots:
      search_query: "The Office"
      area: "Kitchen"
    response: "Playing media"
```

## Context areas

Some slot combinations are marked `context_area: true` in `intents.yaml`, which means the area comes from the voice satellite rather than from the sentence. Home Assistant passes that area's name as intent context, so a response such as `Cleaning {{ slots.area }}` speaks the real area name.

Mark which of the file's areas the satellite is in with `context_area: true`, and write that name out in the expected response:

```yaml
# Example tests/en/HassVacuumCleanArea/context_area.yaml
language: "en"

areas:
  - name: "Living Room"
    context_area: true

tests:
  - sentences:
      - "vacuum in here"
      - "clean this room"
    response: "Cleaning Living Room"
```

Only one area may be marked, and only in a test file for a slot combination that has `context_area: true`. Entities the response needs to read must be in the marked area, since the satellite's area filters them just like a spoken area does.

## Running the tests

Run the tests for a language with:

```bash
pytest tests --language en
```

Leave off `--language` to test all languages, add `-k <intent>` to narrow it down to a single intent, and add `-n auto` to run them in parallel. In VS Code you can also use `terminal -> run task` to run the tests for the file you have open.
