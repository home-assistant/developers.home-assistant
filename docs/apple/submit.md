---
title: "Submit a contribution"
sidebar_label: "Submit contribution"
---

Thanks for contributing. Once your change is ready, open a pull request against the `main` branch of [home-assistant/iOS](https://github.com/home-assistant/iOS).

## Checklist for submitting a PR

Before requesting review, make sure you have covered the basics:

- **Description**: Explain what changed and why.
- **Tests**: Add or update tests when behavior changes.
- **Linting**: Run `bundle exec fastlane lint`.
- **Buildability**: Make sure the relevant scheme still builds locally.
- **UI changes**: Include screenshots or recordings when the interface changes.
- **Documentation**: Update developer docs or user docs when the change affects contributor workflow or user-visible behavior.
- **Cross-target impact**: Check whether your change also affects widgets, watchOS, CarPlay, app extensions, or macOS packaging. See the [targets overview](/docs/apple/targets) for each surface.

## Keep pull requests small

Smaller pull requests are faster to review and easier to reason about. If a change grows beyond one idea, split it into follow-up PRs whenever possible.

## Opening a draft PR

Draft pull requests are a good way to get early feedback on direction, architecture, or CI-heavy changes before everything is polished.

## Review expectations

Maintainers and reviewers will usually focus on:

- correctness
- regressions across targets
- test coverage
- maintainability
- whether shared code belongs in the right module

CI is part of the review process, not a replacement for it.

## Updating your branch

You do not need to rebase on every push to `main`. Update your branch when there is a concrete reason — for example, a conflict with `main`, a CI failure caused by recent changes, or a fix on `main` that affects your work. If your branch has not been reviewed yet, rebasing is usually fine. After review has started, prefer the least disruptive update strategy for the discussion already on the PR.

## Localization and generated files

- Translations are managed through [Lokalise](https://app.lokalise.com/public/834452985a05254348aee2.46389241/)
- If you touch localized strings or generated outputs, make sure the related workflows and generated files remain consistent.
- If CI reports unused strings, clean them up before asking for re-review.

## After receiving feedback

- Address comments with focused follow-up commits.
- Re-run local lint and tests when the feedback affects behavior.
- Request another review once the branch is green again.
