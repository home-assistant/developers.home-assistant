---
title: "Strict typing"
related_rules:
  - runtime-data
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Python is a dynamically typed language, which can be the source of many bugs.
By using type hints, you can catch bugs early and avoid introducing them.

Type hints are checked by mypy, a static type checker for Python.
Because of the way typing in Python works, and type hints being optional in Python, mypy will only check the code that it knows to be type annotated.
To improve on this, we recommend fully typing your library and making your library PEP-561 compliant.
This means that you need to add a `py.typed` file to your library.
This file tells mypy that your library is fully typed, after which it can read the type hints from your library.

In the Home Assistant codebase, you can add your integration to the [`.strict-typing`](https://github.com/home-assistant/core/blob/dev/.strict-typing) file, which will enable strict type checks for your integration.

:::warning
If the integration implements `runtime-data`, the use of a custom typed `MyIntegrationConfigEntry` is required and must be used thoughout.
:::

## Additional resources

To read more about the `py.typed` file, see [PEP-561](https://peps.python.org/pep-0561/).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
