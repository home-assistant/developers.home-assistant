---
title: "Contributing template sentences"
sidebar_label: "Contributing sentences"
---

Template sentences need to be contributed to our [Intents repository on GitHub](https://github.com/home-assistant/intents). The sentences will be reviewed by [the language leaders](/docs/voice/language-leaders) and merged if they are correct. You can either contribute new sentences or improve existing ones.

Each language has its own set of directories in the repository:

- `sentences/<language>/` - Template sentences - [learn more](/docs/voice/intent-recognition/template-sentence-syntax)
- `tests/<language>/` - Tests - [learn more](/docs/voice/intent-recognition/test-syntax)
- `responses/<language>/` - Response templates, one file per intent
- `lists/<language>/` - Slot lists
- `rules/<language>/` - Expansion rules

Sentences and tests are organized by intent and by **slot combination**, the set of slots that a sentence fills in. So if you are improving how covers are opened and closed by name, you would update the following files:

- `sentences/<language>/HassTurnOn/name_only.yaml`
- `sentences/<language>/HassTurnOff/name_only.yaml`
- `tests/<language>/HassTurnOn/name_only.yaml`
- `tests/<language>/HassTurnOff/name_only.yaml`

The intents and the slot combinations they support are declared in [`intents.yaml`](https://github.com/home-assistant/intents/blob/main/intents.yaml) at the root of the repository. That file applies to every language at once, so it can only be changed by repository admins and maintainers, and a pull request that changes it will fail the `guard-core-files` check. If a slot combination is missing, wrongly marked, or does not fit your language, please open an issue describing what you need instead of editing the file yourself.

Everything under the per-language directories is owned by that language's leaders, as listed in [CODEOWNERS](https://github.com/home-assistant/intents/blob/main/CODEOWNERS).

We prefer a lot of small contributions over a few large ones. Contributions that contain a lot of changes are hard to review. That's why we want each contribution limited to a single language and a single intent.

## How to contribute

All contributions are done via Pull Requests on GitHub. Our recommended way is to use GitHub CodeSpaces. [Follow this tutorial to get started.](https://github.com/home-assistant/intents/blob/main/docs/codespace/README.md)

Our repository has a lot of checks that you can use to make sure that your contributed sentences are valid. You can run them locally from VS Code using `terminal -> run task`, or from a terminal:

```bash
python3 -m script.intentfest validate --language <language>
```

```bash
pytest tests --language <language>
```

Validation checks that your files match the slot combinations declared in `intents.yaml` and that every list and rule you reference exists. The tests check that your sentences match the intent, slots, and response they are supposed to, and that every sentence template is covered by at least one test sentence.

The checks will also run automatically when you create a Pull Request. Contributions cannot be accepted if the checks fail.

## Adding a new language

New languages should be based on the output of `python3 -m script.intentfest add_language <language code> <language name>`, which generates the sentence, test, and response files for the new language, scaffolded from English with the sentences left empty.

Limit the first contribution to translations of the error responses in `sentences/<language>/_common.yaml` and to the slot combinations that `intents.yaml` marks as `required` for `HassTurnOn` and `HassTurnOff`, along with their tests. Add the lists and expansion rules those sentences need under `lists/<language>/` and `rules/<language>/`.

If you are unable to run the add_language script locally, ask in Discord to have a maintainer run it for you.
