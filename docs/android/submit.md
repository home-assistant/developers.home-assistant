---
title: "Android submit contribution"
sidebar_label: "Submit contribution"
---

## Submit your first contribution

First of all, thank you for your contribution! Now it's time to get feedback and prepare your work for real users. Follow the [GitHub Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) to create a pull request (PR) from your fork.

### Checklist for submitting a PR

When creating a PR, GitHub pre-fills the description with a checklist. Ensure you follow all the steps. Here's an extended checklist to help you:

- **PR description**: Provide a clear and complete description of your changes.
- **Tests**: Add all necessary tests following our [testing guidelines](testing/introduction).
- **Documentation**: Ensure your code is properly documented.
- **UI changes**: Include screenshots if the UI is modified.
- **User documentation**: If user documentation needs updates, open a PR on [GitHub](https://github.com/home-assistant/companion.home-assistant).
- **Developer documentation**: If this documentation needs updates, open a PR on [GitHub](https://github.com/home-assistant/developers.home-assistant/).
- **Builds**: Verify that everything builds properly (app, automotive, wear) locally.
- **Best practices**: Follow the [best practices](best_practices).
- **Code style**: Adhere to the [code style](codestyle).
- **Linting**: Ensure no lint issues are introduced ([linter](linter)).

### Opening a draft PR

If your PR isn't ready for an official review, but you'd like feedback, you can open it in **draft mode**. This is especially useful when working on CI-related changes or incomplete features.

#### CI trigger

If you're a new contributor, each CI run must be approved by a maintainer.

:::warning
**Avoid unnecessary CI runs**  
Running CI workflows consumes significant resources. If your work is incomplete, postpone opening the PR (even in draft mode) unless necessary. Let's be mindful of resource usage and our planet. 🌍 But it doesn't prevent you from pushing regularly to avoid losing your work.
:::

### Review process

#### Who can review?

Everyone can comment on your PR since it's public. We encourage contributions through reviews. Reviewing can be quicker than coding, and even a 10-minute review can be valuable.

If you're not confident in **reviewing**, you can still help by:  

- Testing the feature by installing the APK (available in the Checks tab of the PR; you must be logged in to your GitHub account to access it).
- Providing feedback on UI/UX.  
- Reporting crashes or bugs.

#### Getting approval from a maintainer

Once your PR meets the checklist requirements, wait for a maintainer to review it. Remember, maintainers are volunteers contributing in their spare time. Be respectful, patient, and kind.  

Feedback from maintainers will come as:  

- **Comments**: Suggestions or required changes in the code.  
- **Questions**: Questions about how things are working.

### After receiving feedback

#### Re-ask for review

If you've addressed feedback and pushed changes to your PR, you can request a re-review from maintainers. Ensure the CI is green before doing so.

### Merging your PR

- Keep your PR up to date with the `main` branch.  
- Once everything is green and approved by a maintainer, they will merge your PR. You don't need to take any further action.

### Automatic issue and PR closure

Our bot marks issues/PRs as stale after **90 days** of inactivity. If there's still no activity after **7 days**, the issue/PR will be automatically closed.

---

Thank you for contributing to Home Assistant! 🎉
