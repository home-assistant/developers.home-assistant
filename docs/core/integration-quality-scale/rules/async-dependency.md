---
title: "Dependency is async"
related_rules:
  - inject-websession
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Home Assistant works with asyncio to be efficient when handling tasks.
To avoid switching context between the asyncio event loop and other threads, which is costly performance wise, ideally, your library should also use asyncio.

This results not only in a more efficient system but the code is also more neat.

## Additional resources

More information on how to create a library can be found in the [documentation](../../../api_lib_index).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>