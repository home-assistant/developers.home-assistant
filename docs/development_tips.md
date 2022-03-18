---
title: "Tips and Tricks"
---

This page provides some tips and tricks that may help you as a contributor to Home Assistant. The list here is by no means exhaustive, and if you pick up any additional undocumented tips and tricks, please open a PR to add them here.

## Tips and Tricks

### Keep PRs simple

It's in your best interest to keep your PRs as short and simple as possible. It may feel like extra work on your part to split a change you have in mind into smaller changes, but on the plus side:

- Your code is more likely to be accepted because it will be much easier to review, and confirm it is bug free.
- Your PR reviews will generally happen faster and will be easier to iterate through
- If you don't do this ahead of time, you may be asked to do so during a review, which is a waste of time for both you and the reviewer.

This often comes up when contributors are "modernizing" an integration that hasn't been touched in a while. There are a lot of features that HA has added over the years, and it may be tempting to add support for all of them in a single PR. The right approach is to break the features down into independent functional changes as best you can and to submit the PRs sequentially.

One strategy for handling sequential PRs is to create a branch for the `next` PR off the `current` PR's branch which you can then start writing code against. This is especially useful if you have split up the PRs such that one is dependent on the previous one since you are working off of the code that will be in `dev` once the PR is merged. If you end up adding additional commits to the `current` PR because of changes/review feedback, you can rebase your `next` PR's branch and more easily incorporate any merge conflicts. Once your `current` PR has been merged, squash the commits from the `current` PR branch in the `next` PR branch and then rebase on `dev`.

### Test package dependency changes in Home Assistant

When making changes to a package that an integration is dependent on, it may be useful to test the changes in Home Assistant to verify that the changes you've made are working as you intended. Here's a useful thing to know: if a module folder that an integration is dependent on is located in `/config`, Home Assistant will use that module instead of the one from `PyPI`.

As long as you are developing the package on the same system that is running Home Assistant for testing, you can symlink the package module folder into `/config`, and as you make changes to the package, a Home Assistant restart will pick up the changes automatically. Symlinking instructions are OS dependent so Google how to create a symlink for your Operating System. And don't forget to remove the symlink when you are done, otherwise your Home Assistant instance will be stuck using the code that's currently in your local copy.

> NOTE: If your Home Assistant system is different from your development system, you will have to manually copy the files over each time you make a change. Where possible, you should try to test changes locally, it makes things a lot easier!

### Test Core integration changes in your production Home Assistant environment

So you made a change to a core integration and you want to test it in your production Home Assistant environment. All you have to do is copy the integration folder into `/config/custom_components`, add a version to the `manifest.json` (e.g. "version": "0.0"), and restart Home Assistant. Home Assistant will always prioritize integrations in `custom_components` over 

### When adding a config flow to an integration, be aware of the frontend

The Home Assistant frontend caches pretty aggressively, and as such, the first time you run Home Assistant with your new changes, you may not see the integration show up in the integration list. Check the logs to make sure there were no errors, and if not, do a hard refresh of your browser window and try again, in many cases that will resolve your issue.

### Getting additional support

`#devs` and `#devs_core` on the Home Assistant [Discord](https://www.home-assistant.io/join-chat/) server are great places to ask questions. Pro tip: Before you post your question, push the code you are working on into a branch and push that branch somewhere public and paste a link to it along with your question so that the person who is helping you can see your code. Please do NOT paste code blobs into the channel as it's hard to read and hides other questions/discussions.

If you see a way to improve the developer docs, please pay it forward and submit a PR to update them. See the next tip for more details.

### Missing information in the developer docs

The Home Assistant maintainers try to keep the developer docs up to date, but we also rely on contributors like you to help us correct, improve, and expand on our existing documentation. Just like Home Assistant, this [documentation is open source](https://github.com/home-assistant/developers.home-assistant) and PRs are welcome. When in doubt, click the `Edit this page` button in the bottom left to get to the source file.
