---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Probatio is our validation engine
---

Since Home Assistant Core 2026.9, schema validation runs on [Probatio](https://probatio.frenck.dev) instead of voluptuous. This went in quietly because it was meant to change nothing, and for most integrations it changed nothing. That is worth saying out loud anyway, along with what it does change and what you can now reach for.

## Your existing code keeps working

Probatio is a clean-room reimplementation of voluptuous with the same public API. `import voluptuous as vol` still works: Home Assistant aliases the name in `sys.modules` at startup, so the import resolves to Probatio. Custom integrations need no changes, and voluptuous is no longer installed at all.

Core itself has moved to importing Probatio directly, and `import voluptuous` is now banned there by a lint rule. That ban applies to our own source. Your integration can keep the old import for as long as you like.

## Why we switched

voluptuous has been effectively unmaintained for a long time, and it sits under every integration in Home Assistant. Probatio is maintained, MIT licensed, pure Python, and holds behavioral compatibility with voluptuous as its primary correctness target.

It is also quicker. The project measures the interpreted engine at roughly 2.3 to 3.4 times voluptuous, and an optional compiled path at roughly 6.7 to 7.4 times, on [its own benchmarks](https://probatio.frenck.dev/reference/performance/). Those are single-machine numbers and the project says not to treat them as guarantees, so take them as a direction rather than a promise. Home Assistant builds a great many schemas and validates a fraction of them per run, so we set a lazy build policy: a schema compiles when it is first validated, not when it is constructed.

## What changed for you

Two things are worth knowing, because both produced real issues after 2026.9.

**Error messages are worded differently.** If your tests assert on validation error text, they may need updating. Probatio also suggests a close match for an unknown key, and 2026.9.1 raised the bar for when it offers one, so weak guesses no longer appear.

**Validation is stricter in a few places, which surfaced data that was quietly wrong before.** The clearest case was the KNX config store, which was validated before writing but not on load. Entries written by hand or by third-party tooling had been passed through untouched for years, and started failing at setup. The data was always invalid. Nothing told anyone until something checked.

If your integration stores structured data and only validates it on the way in, this is worth a look.

## What you can use now

The compatibility layer only exposes voluptuous's surface, so reaching any of this means importing `probatio` directly.

**Typing that survives the call.** Validators that hand their input back keep the caller's type, so `probatio.EnsureList()(names)` on a `list[str]` gives you a `list[str]` rather than a `list[Any]`.

**Dataclass and TypedDict schemas.** Build schemas from annotations. `DataclassSchema` returns a typed dataclass instance, while `TypedDictSchema` returns a validated dict typed as the `TypedDict`:

```python
from dataclasses import dataclass

import probatio


@dataclass
class Server:
    host: str
    port: int = 80


schema = probatio.DataclassSchema(Server)
schema({"host": "nas", "port": 8080})  # Server(host="nas", port=8080)
```

**Markers voluptuous never had.** `Secret` redacts a key's value from error output, which matters when a schema holds a password. `Forbidden` requires a key's absence, `Alias` accepts a value under an old name and emits it under the canonical one, and `TaggedUnion` routes on one key's value instead of trying every branch and reporting all of them.

```python
probatio.Schema(
    {
        probatio.Required(probatio.Secret(CONF_PASSWORD)): str,
    }
)
```

**Structured errors, including translation keys.** Every `Invalid` carries a stable `code`, a `translation_key`, `placeholders` for interpolation, the `path` to the offending value, and a `secret` flag. `as_dict()` serializes the lot. That means a validation failure can be branched on programmatically and rendered in the user's language, rather than parsed out of an English sentence.

```python
{
    "code": "length",
    "message": "length of value must be at least 12",
    "path": ["password"],
    "secret": True,
    "context": {},
    "translation_key": "length_min",
    "placeholders": {"min": 12},
}
```

**Cross-field rules**, like `AtLeastOne`, `ExactlyOne`, `AllOrNone`, `RequiredWith` and `RequiredIf`, which previously had to be hand-rolled per integration.

**Codecs.** `to_json_schema`, `to_openapi` and `from_openapi` convert between a schema and a document, which is how we describe LLM tools.

## Documentation, and a note for AI tooling

The full documentation lives at [probatio.frenck.dev](https://probatio.frenck.dev), including a [compatibility matrix](https://probatio.frenck.dev/reference/compatibility-matrix/) listing everything Probatio adds beyond voluptuous.

The site also publishes [llms.txt](https://probatio.frenck.dev/llms.txt), a machine-readable index of the documentation. If you use an AI assistant while working on an integration, pointing it at that file is worth doing. Probatio is newer than most model training data, so an assistant left to its own devices will write voluptuous, guess at the API, or invent a validator that does not exist. There are abridged and complete variants alongside it, plus separate indexes for the guides, the recipes and the API reference.
