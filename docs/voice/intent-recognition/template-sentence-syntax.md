---
title: "Template sentence syntax"
---

Template sentences are defined in YAML files using the format of [Hassil, our template matcher](https://github.com/home-assistant/hassil). Our template sentences are stored [on GitHub](https://github.com/home-assistant/intents/tree/main/sentences).

Sentences are grouped by **intent** and by **slot combination**. A slot combination is the set of slots that a sentence fills in: "turn on the kitchen lights" fills `area` and `domain`, while "turn on the overhead light" only fills `name`. Every intent and its slot combinations are declared in [`intents.yaml`](https://github.com/home-assistant/intents/blob/main/intents.yaml) at the root of the repository.

The repository is laid out as follows:

- `sentences/<language>/<intent>/<slot_combination>.yaml` - Template sentences for a [single intent](/docs/intent_builtin) and slot combination.
- `sentences/<language>/_common.yaml` - Error responses, skip words, and language settings.
- `lists/<language>/<group>.yaml` - Slot lists for a single language.
- `lists/<group>.yaml` - Slot lists shared by all languages (number ranges and wildcards only).
- `rules/<language>/<group>.yaml` - Expansion rules for a single language.
- `responses/<language>/<intent>.yaml` - Response templates for a single intent.
- `tests/<language>/<intent>/<slot_combination>.yaml` - Tests, [documented separately](/docs/voice/intent-recognition/test-syntax).

Besides the lists defined in `lists/`, template sentences can also use the lists `name`, `area`, and `floor`. These lists are made available by Home Assistant during intent recognition.

## Slot combinations

Each slot combination in `intents.yaml` names the slots its sentences must fill, an importance level, and an English example:

```yaml
# Example from intents.yaml
HassTurnOn:
  slot_combinations:
    name_only:
      description: "Turns on a device or opens a cover by name"
      slots:
        - "name"
      name_domains:
        required:
          - "light"
          - "switch"
          - "cover"
        optional:
          - "valve"
      example:
        - "turn on the overhead light"
        - "open sliding door"
```

Importance levels are:

- `required` - the bare minimum; sentences must be provided or validation fails.
- `usable` - expected by users; a warning is issued if sentences are missing.
- `complete` - needed for 100% coverage of the language.
- `optional` - extra, not needed for 100% coverage.

When a combination uses the built-in `{name}` slot, the importance levels move into `name_domains`, which lists the entity domains that `{name}` is allowed to match. When the domain of the targeted entities is inferred from the words of the sentence ("turn on the lights in here"), the levels move into `inferred_domains` instead. `context_area: true` means the area comes from the voice satellite rather than from the sentence.

Because `intents.yaml` already describes which entities a slot combination targets, sentence files no longer carry `requires_context`, `excludes_context`, or fixed `slots` values. That part is generated, which keeps it consistent across languages.

## Sentence files

A sentence file contains the language and one or more groups of sentences under `data`:

```yaml
# Example sentences/en/HassTurnOn/name_only.yaml
language: "en"
data:
  # on-able domains
  - sentences:
      - "<turn> on [<the>] {name}"
      - "activate [<the>] {name}"
    example: "turn on the overhead light"
    name_domains:
      - "light"
      - "switch"
    response: "default"

  # covers
  - sentences:
      - "<open> [<the>] {name}"
    example: "open the sliding door"
    name_domains:
      - "cover"
    response: "cover"
```

Every template in the file must fill exactly the slots that `intents.yaml` declares for the combination - no more, no fewer. A slot may be filled directly with `{slot}` or through an expansion rule whose body references it. The `domain` slot is the exception: it is not written in the template, it comes from the group's `inferred_domain`.

Each group in `data` supports:

- `sentences` (required) - the sentence templates.
- `response` (required) - the [response](#responses) key to speak when these sentences match.
- `name_domains` - required when the combination uses `{name}`: the entity domains these sentences target. Every domain marked `required` in `intents.yaml` must be covered, but not necessarily by the same group, so you can split sentences in whatever way suits the language. A named group from `name_domain_groups` (such as `"default"`) can be used instead of repeating the list.
- `inferred_domain` - required when the combination uses the `domain` slot: the domain that the words of these sentences imply. Note the singular, only one domain can be inferred per group. Every domain marked `required` in `intents.yaml` must be covered by some group.
- `example` - a sentence this group matches, in the language of the file. Keep it localized; an example that is byte-identical to the English one is reported as a warning.
- `speech_to_phrase` - marks a group for inclusion in the Speech-to-Phrase constrained speech-to-text grammar. When a slot combination has both tagged and untagged groups, the tagged group is a Speech-to-Phrase-only subset of the untagged ones and is stripped from the Home Assistant grammar. When every group is tagged, they serve both.

## Sentence template syntax

- Alternative words, phrases, or parts of a word
  - `(red | green | blue)`
  - `turn(ed | ing)`
- Optional words, phrases, or parts of a word
  - `[the]`
  - `[this | that]`
  - `light[s]`
- Slot lists
  - `{list_name}`
  - `{list_name:slot_name}` (if the intent slot is named differently)
  - Every value of the list is a different option
  - Lists are defined under `lists/`, see [lists](#lists)
  - A list reference may **not** appear inside an alternative or an optional: `(text | {list_name})` and `[{list_name}]` are not allowed, because a template has to always fill the same slots
- Expansion rules
  - `<rule_name>`
  - The body of the rule is substituted for `<rule_name>`
  - Rules are defined under `rules/<language>/`, see [expansion rules](#expansion-rules)
- [Permutations](https://en.wikipedia.org/wiki/Permutation) of 2 or more items
  - `(patience;you must have)`
  - Permutation items are always padded with spaces to prevent new word formations
  - Limit the number of items to 2-4, as the number of permutations for `n` items increases very quickly with `n`, this number being `n! == 1 * 2 * ... * n`

## Lists

Lists are the possible values for a slot. Any text matched by a list is put into an intent slot of the same name, or into `slot_name` when the reference is written `{list_name:slot_name}`.

A list is one of three types: fixed values, a range of numbers, or a wildcard.

Lists for a single language live in `lists/<language>/<group>.yaml`, grouped into files however makes sense for that language - a `lights.yaml` file may hold color names and brightness levels, for example. These files declare their language:

```yaml
# Example lists/en/lights.yaml
language: "en"
lists:
  color:
    values:
      - "white"
      - "red"
      - "orange"
```

Intent handlers in Home Assistant expect color to be defined in English. To allow other languages to define colors, lists support the in-out format. This allows you to define a list of values in the native language, but the intent handler will receive the values in English.

```yaml
language: "nl"
lists:
  color:
    values:
      - in: "rood"
        out: "red"
      - in: "oranje"
        out: "orange"
```

A list can also be a range of numbers. This is useful for defining a range of brightness values or temperatures that you want to match. Number words work too, so both "set brightness to 50 percent" and "set brightness to fifty percent" will match.

```yaml
language: "en"
lists:
  brightness:
    range:
      type: "percentage"
      from: 0
      to: 100
      step: 1
```

A range also accepts `fractions` (`halves` or `tenths`) and a `multiplier`. Because numbers need no translation, ranges are usually defined once as a [shared list](#shared-lists) instead.

Specific numbers can also be matched by a list, like returning 100 from the keyword maximum. To use this list to set the brightness in a sentence, use the following syntax: `{brightness_level:brightness}`. This will get the value from the list but put it in the slot for brightness.

```yaml
language: "en"
lists:
  brightness_level:
    values:
      - in: (max | maximum | highest)
        out: 100
      - in: (minimum | lowest)
        out: 1
```

### Wildcards

Wildcard lists match any text:

```yaml
language: "en"
lists:
  album:
    wildcard: true
  artist:
    wildcard: true
```

With the template `play {album} by {artist}`, a sentence such as "play the white album by the beatles" will produce an `album` slot with "the white album " (note the trailing whitespace) and an `artist` slot with "the beatles".

### Shared lists

Number ranges and wildcards do not need translation, so they can be shared across all languages by putting them in `lists/<group>.yaml` at the root. Shared list files have no `language` key:

```yaml
# Example lists/lights.yaml
lists:
  brightness:
    range:
      type: "percentage"
      from: 0
      to: 100
  color_temperature:
    range:
      from: 1000
      to: 10000
      step: 100
```

Value lists cannot be shared, since their values must be translated per language.

## Expansion rules

A lot of template sentences can be written in a similar way. To avoid having to repeat the same matching structure multiple times, we can define expansion rules. For example, a user might add "the" in front of a name, or they might not. We can define an expansion rule to match both cases.

Rules live in `rules/<language>/<group>.yaml`, grouped into files however makes sense for the language - a `verbs.yaml` file may hold the verb groups for turning things on and off, setting timers, and so on:

```yaml
# Example rules/en/common.yaml
language: "en"
expansion_rules:
  the: "(the|my|our)"
  here: "([in] here|[in] (this|the|my|our) (room|area|space))"
  home: "(home|house|apartment|flat)"
```

```yaml
# Example rules/en/verbs.yaml
language: "en"
expansion_rules:
  turn: "(turn|switch)"
  open: "(open|raise|lift) [up]"
```

A rule must contain some required text; it cannot be entirely optional.

Rules are powerful, but can quickly make sentence templates unreadable or explode their complexity. For these reasons we **recommend** the following restrictions.

### Rules should not contain lists

A rule should not contain `{list_name}`.

While convenient, allowing list references inside rules makes it impossible to know which slots a sentence template will match by just looking at it. A `<name>` rule containing the `{name}` list also tends to produce duplicated optional words, such as `[the] <name>` expanding to `[the] [the] {name}`.

### Rules should not reference other rules

A rule should not contain `<rule_name>`.

Nested rules require readers to follow a chain just to understand what text can be recognized. With alternatives in the rule (for example `(a|b|c)`), the number of possible sentences can also grow very large very quickly with nesting.

## Responses

Every group of sentences names a `response` key, which refers to a template in `responses/<language>/<intent>.yaml`:

```yaml
# Example sentences/en/HassLightSet/name_brightness.yaml
language: "en"
data:
  - sentences:
      - "set [the] {name} brightness to {brightness} percent"
    example: "set the bedroom lamp brightness to 50 percent"
    name_domains:
      - "light"
    response: "brightness"
```

```yaml
# Example responses/en/HassLightSet.yaml
language: "en"
responses:
  intents:
    HassLightSet:
      brightness: "{{ slots.name }} brightness set to {{ slots.brightness }}"
```

Response templates use [Jinja2 syntax](https://jinja.palletsprojects.com/en/latest/templates/) and may refer to the `slots` object, whose attributes are the matched intent's slot values. Some intents make extra variables available, such as `state` for the first matched entity or `query` for the entities a state question matched; these are declared under `response_variables` for the intent in `intents.yaml`.

See all [translated responses](https://github.com/home-assistant/intents/tree/main/responses) for more examples.

## The common file

`sentences/<language>/_common.yaml` holds the parts of a language that are not tied to a single intent: error responses, skip words, and matching settings. Lists and expansion rules used to live here too; they are now in [`lists/`](#lists) and [`rules/`](#expansion-rules).

### Error responses

Error responses are spoken when an intent cannot be handled, for example because no matching entity exists:

```yaml
language: "en"
responses:
  errors:
    no_intent: "Sorry, I couldn't understand that"
    no_area: "Sorry, I am not aware of any area called {{ area }}"
    no_entity: "Sorry, I am not aware of any device called {{ entity }}"
```

### Skip words

Skip words are words that the intent recognizer will skip during recognition. This is useful for words that are not part of the intent, but are commonly used in sentences. For example, a user might use the word "please" in a sentence, but it is not part of the intent.

```yaml
skip_words:
  - "please"
  - "can you"
```

### Settings

Languages that are not written with spaces between words can adjust how matching works:

```yaml
language: "zh-CN"
settings:
  ignore_whitespace: true
```

- `ignore_whitespace` - ignore whitespace when matching, for languages such as Chinese and Japanese.
- `filter_with_regex` - deprecated and ignored. Templates are now pre-filtered by the literal text they require, which never skips a template that could have matched, so languages no longer need to opt out. The key is still accepted so existing files keep loading.
