---
title: "Contributing template sentences"
sidebar_label: "Contributing sentences"
---

Template sentences need to be contributed to our [Intents repository on GitHub](https://github.com/home-assistant/intents). The sentences will be reviewed by [the language leaders](../language-leaders) and merged if they are correct. You can either contribute new sentences or improve existing ones.

The Intent repository is structured as follows:

- `sentences/<language>/` - Template sentences for each language - [learn more](template-sentence-syntax)
- `tests/<language>/` - Tests for each language - [learn more](test-syntax)

We prefer a lot of small contributions over a few large ones. Contributions that contain a lot of changes are hard to review. That's why we want each contribution limited to a single language and single domain.

The filenames of sentences and tests are named like `<domain>_<intent>.yaml`. So if you are contributing to the cover domain, you would update the following files:

- `sentences/<language>/cover_HassCoverOpen.yaml`
- `sentences/<language>/cover_HassCoverClose.yaml`
- `tests/<language>/cover_HassCoverOpen.yaml`
- `tests/<language>/cover_HassCoverClose.yaml`

## How to contribute

All contributions are done via Pull Requests on GitHub. Our recommended way is to use GitHub CodeSpaces. [Follow this tutorial to get started.](https://github.com/home-assistant/intents/blob/main/docs/codespace/README.md)

Our repository has a lot of checks that you can use to make sure that your contributed sentences are valid. You can run them locally from VS Code using `terminal -> run task`.

The checks will also run automatically when you create a Pull Request. Contributions cannot be accepted if the checks fail.

## Adding a new language

New languages should be based on the output of `python3 -m script.intentfest add_language <language code> <language name>`, which generates an empty language directory with all the files needed for a new language.

Limit the first contribution to translations of the error sentences in `_common.yaml` and adding sentences and tests for the `homeassistant` domain.

If you are unable to run the add_language script locally, ask in Discord to have a maintainer run it for you.
