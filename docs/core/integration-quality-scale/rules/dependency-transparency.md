---
title: "Dependency transparency"
related_rules:
  - async-dependency
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Home Assistant uses a lot of dependencies to work.
These dependencies will be shipped with new versions of Home Assistant.
In order for the project to trust the dependencies, we have a set of requirements we want the dependencies to meet.

- The source code of the dependency must be available under an OSI-approved license.
- The dependency must be available on PyPI.
- The package published to PyPi should be built and published inside a CI pipeline.
- The version of the dependency published on PyPI should correspond to a tagged release in an open online repository.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>