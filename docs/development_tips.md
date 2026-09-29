---
title: "Tips and tricks"
---

This page provides some tips and tricks that may help you as a contributor to Home Assistant. The list here is by no means exhaustive, and if you pick up any additional undocumented tips and tricks, please open a PR to add them here.

## Tips and tricks

### Keep PRs simple

Keep a new integration to the minimum functionality needed for someone to get value out of the integration. This allows reviewers to sign off on smaller chunks of code one at a time, and lets us get your new integration/features in sooner. **Pull requests containing large code dumps will not be a priority for review and may be closed.**

- Limit to a single platform
- Do not add features not needed to directly support the single platform (such as custom service actions)
- Do not mix clean-ups and new features in a single pull request.
- Do not solve several issues in a single pull request.
- Do not submit pull requests that depend on other work which is still unmerged.

It may be tempting to open a large PR when "modernizing" an integration that hasn't been touched in a while to take advantage of all the latest features available. The right approach is to break the features down into independent functional changes as best you can and to submit the PRs sequentially.

One strategy for handling sequential PRs is to create a branch for the `next` PR off the `current` PR's branch, which you can then start writing code against. This strategy is advantageous if you have split up the PRs such that one is dependent on the previous one since you are working off of the code that will be in `dev` once the PR is merged. If you add additional commits to the `current` PR because of changes/review feedback, you can rebase your `next` PR's branch and more easily incorporate any merge conflicts. Once your `current` PR has been merged, squash the commits from the `current` PR branch in the `next` PR branch and then rebase on `dev`. Then you can submit your `next` PR branch for review and rinse and repeat as needed.

### Test package dependency changes in Home Assistant

See the [API library docs](/docs/api_lib_index#trying-your-library-inside-home-assistant) for more information.

### Test Core integration changes in your production Home Assistant environment

To test a core integration change in your production Home Assistant environment:
1. Copy the integration folder into `/config/custom_components`.
2. Add a **version** field to `manifest.json` (for example, `"version": "0.0.0"`).
3. If the integration uses localized strings, copy `strings.json` into `translations/en.json` under the integration folder as described in [Custom integration localization](/docs/internationalization/custom_integration).
4. Restart Home Assistant.

Home Assistant will always prioritize integrations in `custom_components` over the core integration. Don't forget to remove it once you are done testing; otherwise, you will be stuck on that version.

### When adding a config flow to an integration, be aware of the frontend

The Home Assistant frontend caches aggressively, and as such, the first time you run Home Assistant with your new changes, you may not see the integration show up in the integration list. Check the logs to make sure there were no errors, and if not, perform a hard refresh of your browser window and try again; in many cases, that will resolve your issue.

### Getting additional support

`#developers` on the Home Assistant [Discord](https://www.home-assistant.io/join-chat/) server is a great place to ask questions. Pro tip: Before you post your question, push the code you are working on into a branch and push that branch somewhere public and paste a link to it along with your question so that the person who is helping you can see your code. Please do NOT paste code blobs into the channel as it's hard to read and hides other questions/discussions.

If you see a way to improve the developer docs, please pay it forward and submit a PR to update them. See the next tip for more details.

### Missing information in the developer docs

The Home Assistant maintainers try to keep the developer docs up to date, but we also rely on contributors like you to help us correct, improve, and expand on our existing documentation. Like Home Assistant, this [documentation is open source](https://github.com/home-assistant/developers.home-assistant), and PRs are welcome. When in doubt, click the `Edit this page` button in the bottom left to get to the source file and to edit the file directly on GitHub. No command line is needed!
