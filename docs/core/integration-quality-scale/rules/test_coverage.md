---
title: "Above 95% test coverage for all integration modules (IQS024)"
related_rules:
  - config_flow_test_coverage
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Since we support a lot of different integrations, we don't have every device or service available for hands-on testing.
To make sure that we don't break anything, when accepting a code change, we need to have a good test coverage for all integration modules.
This prevents the introduction of bugs and regressions.

It also allows new developers to understand the codebase and make changes without breaking any existing use case.

## Additional resources

For more information about testing and how to calculate test coverage, see the [Testing your code](../../../development_testing) page.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>