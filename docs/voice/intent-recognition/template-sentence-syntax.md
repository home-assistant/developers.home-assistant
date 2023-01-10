---
title: "Template Sentence Syntax"
---

Template sentences are defined in YAML files using the format of [Hassil, our template matcher](https://github.com/home-assistant/hassil). Our template sentences are stored [on GitHub](https://github.com/home-assistant/intents/tree/main/sentences) and are organized by having for each language a directory of files:

 - `_common.yaml` - Lists, expansion rules and skip words to be used across all template sentences.
 - `<domain>_<intent>.yaml` - Template sentences for a [single intent](../intents/supported-intents.md) and domain.

Besides the data in `_common.yaml`, template sentences can also use the lists `name` and `area`. These lists are made available by Home Assistant during intent recognition.

``` yaml
# Example light_HassTurnOn.yaml
language: "en"
intents:
  HassTurnOn:  # Intent name
    data:
      - sentences:
          - "<turn> on [all] [the] (light | lights) in [the] {area}"
          - "<turn> on [all] [the] {area} (light | lights)"
          - "<turn> [all] [the] (light | lights) in [the] {area} on"
        # Optional; used to set fixed slot values when the intent is matched
        slots:
          domain: "light"
```

The above example will match the sentence `turn on all the lights in the living room` to the intent `HassTurnOn` and extract the area `living room`. The domain value is set to `light`. In Home Assistant, when the intent is executed, it will turn on all entities of type `light` in the area `living room`.

## Sentence Templates Syntax

* Alternative word, phrases, or parts of a word
  * `(red | green | blue)`
  * `turn(ed | ing)`
* Optional word, phrases, or parts of a word
  * `[the]`
  * `[this | that]`
  * `light[s]`
* Slot Lists
  * `{list_name}`
  * `{list_name:slot_name}` (if intent slot is named different)
  * Every value of the list is a different option
  * In YAML, `list_name` should be under `lists`
  * Use `values` for text lists, `range` for numeric lists
* Expansion Rules
  * `<rule_name>`
  * The body of the rule is substituted for `<rule_name>`
  * In YAML, `rule_name` should be under `expansion_rules`. If the `rule_name` wraps a slot name, it should match the slot name. Otherwise it should be in the native language.

## The common file

The common file `_common.yaml` contains lists, expansion rules, and skip words that are used across template sentences for all intents and domains.

### Lists

Lists are possible values for a slot. Slots are data that we want to extract from a sentence. For example, we can make a list `color` to match possible colors.

```yaml
lists:
  color:
    values:
      - "white"
      - "red"
      - "orange"
```

Intent handlers in Home Assistant expect color to be defined in English. To allow other languages to define colors, lists support the in-out format. This allows you to define a list of values in the native language, but the intent handler will receive the values in English.

```yaml
lists:
  color:
    values:
      - in: "rood"
        out: "red"
      - in: "oranje"
        out: "orange"
```

A list can also be a range of numbers. This is useful for defining a range of brightness values or temperature that you want to match.

```yaml
lists:
  brightness:
    range:
      type: "percentage"
      from: 0
      to: 100
```

### Expansion Rules

A lot of template sentences can be written in a similar way. To avoid having to repeat the same matching structure multiple times, we can define expansion rules. For example, a user might add "the" in front of the area name, or they might not. We can define an expansion rule to match both cases.

Expansion rules can contain slots, lists, and other expansion rules.

```yaml
expansion_rules:
  name: "[the] {name}"
  area: "[the] {area}"
  what_is: "(what's | whats | what is)"
  brightness: "{brightness} [percent]"
  turn: "(turn | switch)"
```

### Skip Words

Skip words are words that the intent recognizer will skip during recognition. This is useful for words that are not part of the intent, but are commonly used in sentences. For example, a user might use the word "please" in a sentence, but it is not part of the intent.

```yaml
skip_words:
  - "please"
  - "can you"
```
