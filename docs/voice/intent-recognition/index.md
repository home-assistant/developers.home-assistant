---
title: "Recognizing intents from user input"
sidebar_label: "Introduction"
---

A voice assistant evolves around intent recognition. Intent recognition tries to extract the user's intent from their input. This intent, a data format, will then be executed by Home Assistant.

Home Assistant's intent recognition is powered by [hassil](https://github.com/home-assistant/hassil). Hassil recognizes intents by matching the user input against sentence templates.

A sentence template is a sentence that contains slots, placeholders for data, and supports various syntax to allow a single template match a wide range of similar sentences.

> `(turn | switch) on [the] {area} lights`

This example sentence template matches both `turn on kitchen lights` and `switch on the kitchen lights`. In both cases it will extract extra data `area` set to `kitchen`.

In Home Assistant we are collecting our sentence templates [on GitHub](https://github.com/home-assistant/intents). The repository aims to contain for each language and each [supported intent in Home Assistant](../../intent_builtin), the possible sentences a user might say.

