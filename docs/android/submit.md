---
title: "Android Submit Contribution"
sidebar_label: "Submit Contribution"
---

## Submit Your First Contribution

Congratulations on completing your first version! Now it's time to get feedback and prepare your work for real users. Follow the [GitHub Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) to create a pull request (PR) from your fork.

### Checklist for Submitting a PR

When creating a PR, GitHub pre-fills the description with a checklist. Ensure you follow all the steps. Here's an extended checklist to help you:

- ✅ **PR Description**: Provide a clear and complete description of your changes.
- ✅ **Tests**: Add all necessary tests following our [testing guidelines](testing/introduction).
- ✅ **Documentation**: Ensure your code is properly documented.
- ✅ **UI Changes**: Include screenshots if the UI is modified.
- ✅ **User Documentation**: If user documentation needs updates, open a PR on [GitHub](https://github.com/home-assistant/companion.home-assistant).
- ✅ **Developer Documentation**: If this documentation needs updates, open a PR on [GitHub](https://github.com/home-assistant/developers.home-assistant/).
- ✅ **Builds**: Verify that everything builds properly (app, automotive, wear) locally.
- ✅ **Best Practices**: Follow the [best practices](bestpractices).
- ✅ **Code Style**: Adhere to the [code style](codestyle).
- ✅ **Linting**: Ensure no lint issues are introduced ([linter](linter)).

### Opening a Draft PR

If your PR isn't ready for official review but you'd like feedback, open it in **draft mode**. This will still trigger the CI on every commit and is especially useful when working on CI-related changes.

:::warning
**Avoid unnecessary CI runs**  
Running CI workflows consumes significant resources. If your work is incomplete, postpone opening the PR (even in draft mode) unless necessary. Let's be mindful of resource usage and our planet. 🌍 But it doesn't prevent you from pushing regularly to avoid loosing your work.
:::

### Review Process

#### Who Can Review?

Everyone can comment on your PR since it's public. We encourage contributions through reviews. Reviewing can be quicker than coding, and even a 10-minute review can be valuable.  

If you're not confident in **coding**, you can still help by:  

- Testing the feature by installing the APK (it's available on the Checks tab of the PR).  
- Providing feedback on UI/UX.  
- Reporting crashes or bugs.

#### Getting Approval from a Maintainer

Once your PR meets the checklist requirements, wait for a maintainer to review it. Remember, maintainers are volunteers contributing in their free time. Be respectful, patient, and kind.  

Feedback from maintainers will come as:  

- **Comments**: Suggestions or required changes in the code.  
- **Questions**: Questions about how things are working.
- **Suggestions**: Improvements or alternative approaches.

### After Receiving Feedback

#### Re-ask for Review

If you've addressed feedback and pushed changes to your PR, you can request a re-review from maintainers. Ensure the CI is green before doing so.

### Merging Your PR

- Keep your PR up to date with the `main` branch.  
- Once everything is green and approved by a maintainer, they will merge your PR. You don't need to take any further action.

### Automatic Issue and PR Closure

Our bot marks issues/PRs as stale after **90 days** of inactivity. If there's still no activity after **7 days**, the issue/PR will be automatically closed.

---

Thank you for contributing to Home Assistant! 🎉
