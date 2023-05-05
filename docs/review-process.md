---
title: "Pull request review process"
---

The Home Assistant project consists of many smaller projects in many GitHub
repositories that (all together) make the amazing Home Assistant we all
know and love.

We get many contributions offered to us via GitHub Pull Requests, which
is absolutely amazing. We are very grateful for that. This page describes
our review process, so you know what to expect when you submit a PR.

This page provides general tips and guidelines for creating pull requests
and how to handle those. It is not a complete guide on creating a PR; However,
most of this page applies to contributing to any open source project
in general.

## Who is responsible for reviewing PRs?

Home Assistant is an open source project. Most of everything happening in
our project is done by volunteers. We have a core team of developers that
are responsible for the overall architecture of Home Assistant, and they
are responsible for merging PRs (also volunteers). However, they are not
the only ones reviewing PRs.

Everybody can help out reviewing PRs, and we encourage anyone to do so. 🙏

So, when you have opened a PR, please consider checking out if there is an
open PR you can help out with. Any review comment, improvement suggestion,
or even just a "I tested this using ... and it works" is very much appreciated.
Besides, looking at code of others is a great way to learn more about
Home Assistant.

## Creating the perfect PR

There is no such thing as a perfect PR, but there are some things you can
do to make it easier to review your PR. This will not only help reviewers
but also you as a contributor to having your change merged quicker, and
the end-user getting your improvement faster.

1. **Make your PRs as small as possible.**
   A PR should only refactor one thing, fix one thing, add one feature, or
   adjust a single subject in the documentation. If you want to change multiple
   things, please create multiple PRs. Smaller PRs have a smaller scope, need
   less time to review, conflict less often, and generally need fewer review
   iterations.

2. **Only change one thing at a time.**
   This is the same as the previous point but a bit more specific. It is
   tempting to improve those one or two lines you've noticed nearby,
   but please don't. Put those in a separate PR. Unrelated changes in
   your PR are distracting and often lead to questions. In contrast, in an
   independent PR, it would be a quick and simple review and merge.

3. **Test your changes _before_ creating a PR**.
   This sounds obvious, but we often see PRs that contain impossible code
   that could never have worked or documentation changes that aren't visible
   on the resulting page. Of course, a waste of energy for both you and the
   reviewer; it adds an unneeded review iteration. Make sure you at least run
   and physically test your changes. Ensure they work (or, in the case
   of documentation: look) as intended.

4. **Ensure your PR is based on the latest version of the main upstream branch.**
   Make sure to pull in the latest upstream changes before creating your PR.
   While you wrote your changes, upstream may have changed. This can lead to
   merge conflicts, failing tests, or your changes not working as expected.

5. **Create a (feature) branch.**
   When you create a PR, it is based on a branch (usually the main branch).
   You must create a new feature branch for each PR you create. This
   makes it easier to keep your main branch up to date with the upstream
   branch, and it makes it easier to delete the branch after the PR
   has been merged.

6. **Motivate your PR by adding a clear title & extensive description.**
   When you open up a PR, you will be provided a PR template. Use the template,
   fill out as many fields as possible, take your time to write a good,
   clear, and concise title, and add an extensive description of your change.
   Be sure to add a motivation (or use case) to your PR, so the reviewer can
   understand why you are making this change (or why you make certain decisions).

## Receiving review comments

When your PR is open, someone will look at your code at some point. The
reviewer likely has some comments on your code or even some requests for
changes to your code.

**Be very aware these review comments are not personal.** The reviewer is not
trying to insult you or make you feel bad. They are trying to help you improve
your PR, so it can be merged. Just like you, they are a volunteer, and they are
trying to work on making Home Assistant the best it can be. We all have the
same goals.

No matter how experienced you are, there is always something to learn from
others, so don't hate it, embrace it. 😄 Don't be afraid to ask questions,
or ask for clarification. If you don't understand something, ask!

## PRs are being drafted when changes are needed

If there have been changes requested to your PR, our bot will automatically
mark your PR as a draft. This means that the PR is not ready to be merged
or further reviewed for the moment.

Draft PRs tell other reviewers that look at the list of all PRs that this
PR is currently in progress and doesn't require their attention yet.

Once you have made the requested changes, you can mark the PR as ready for
review again by clicking the "Ready for review button":

![The ready for review button in the bottom of a PR in draft mode](/img/en/blog/2023-02-07-introducing-PR-drafting-in-reviews/ready-for-review.png)

Before you click the "Ready for review" button, ensure you have addressed
all requested changes and that all our CI jobs and checks are passing
successfully.

Once you've clicked the "Ready for review" button, the PR will return to a
normal state again, and our bot will automatically notify the reviewers who
requested the changes that the PR is ready to go!

## Speeding up the review process

1. **Build/CI failure? Draft your PR!**
   Opened up the PR, and the build failed? Don't worry, this happens to all of
   us. If you are sure the failure is not related to your changes, you can
   leave your PR open. However, if the failure is related to your changes,
   you should mark your PR as a draft while you resolve it. This will prevent
   reviewers from looking at your PR until it is ready.

   ![Putting a PR in draft is something you can do too](/img/en/blog/2023-02-07-introducing-PR-drafting-in-reviews/convert-to-draft.png)

2. **Monitor your PR and keep it up to date.**
   Even if your PR is not reviewed, you should actively monitor it. Be sure no
   merge conflicts have been introduced in the meantime (GitHub
   will tell you if that is the case), and maybe rebase it onto the latest
   development branch after a week of inactivity. This ensures your PR is
   ready to go once the review process starts.

3. **Add tests.**
   If you are adding new features, make sure to add tests. If you are fixing
   a bug, make sure to add a test that would have caught the bug. If you are
   refactoring code, add tests to make sure your refactoring didn't break
   anything. Tests help with showing your code works as expected,
   but more importantly, ensures everything keeps working in the future.
   While tests add more code to review, it also helps reviewers understand
   the issue you've been solving differently.

4. **Revisit, tweak, and tune to perfection.**
   Sometimes, looking back at your own code a little later teaches you new
   things and help you spot imperfections or issues yourself. While waiting for review
   it is always the perfect time to ensure your PR is as good as it can be.

5. **Help out reviewing the queue.**
   The best way to help speed up the review process is by helping out
   with the review process! Any review work you pick up contributes to
   speeding up the review process for everyone. Besides, someone else
   might notice your reviews and return the favor.

## What not to do

- Don't contact contributors, code owners, core team members, or other
  reviewers directly about a PR, or ping/mention them in a PR to ask for
  a review. While you probably mean this in a friendly way, it can be
  perceived as annoying or demanding. Instead, our bots will handle the
  pinging of the right people, and: have a bit of patience :)

- Don't ask for a review in the PR description. It would be redundant, as
  the PR itself already makes that clear 😉. Our bots will notify the
  appropriate people if that is needed; please avoid doing that yourself.

- Do not submit new pull requests that depend on other pull requests that are
  still open/unmerged. This will create unneeded pull requests in the queue
  that are not actionable.

- Limit the number of open pull requests you have. We have no hard rule on
  this, but we recommend limiting it to 5. If you have more than 5 open
  PRs, we may ask you to close some of them until some others have been merged.

- Don't open a PR if you are not going to work on it. If you cannot
  continue working on a PR after you have opened it, let us know and close it.
  There is no shame in closing a PR; however, if it is because you are stuck,
  don't hesitate to ask for help in our
  [#devs channel in our Discord chat](https://www.home-assistant.io/join-chat).

## My PR has been merged!

Congratulations! 🎉

**And above all: A massive thank you! ❤️**

You have just made Home Assistant a better place. You have helped us to
improve the code, the documentation, the tests, the user experience, or
the community. You have helped us to make Home Assistant better for everyone.

Keep the momentum going! 🚀 Feel free to open up another PR, or help out
with reviewing other PRs.

If this was your first PR, don't worry, we promise, it will become easier
each time you go through the process.

## Frequently asked questions

1. **How do I get my PR merged?**
   There is no guarantee that your PR will be merged. We have a lot of
   contributors, and we have to make sure that we don't break anything.
   We will try to review your PR as soon as possible, but please be patient.
   If you want to speed up the process, please read the sections above on
   how to speed up the review process.

2. **My PR has been awaiting review for days now, when will it be reviewed?**
   Depending on the repository, it might take a while before your PR is
   reviewed. It depends on a lot of things. For example, PRs that fix bugs,
   improve code quality, are small, or provide tests (and combinations of those)
   are generally prioritized over PRs that add new features. The size and
   complexity of a PR can also be a factor, as it means that lesser reviewers
   are willing or capable of picking up your PR. You can always consider trying
   to make your PRs smaller and more focused to speed up the review process.
   Some other PRs may require or need someone with specific knowledge to review
   it (like an architectural change or change that needs approval
   by a code owner), which may cause a longer wait time.

3. **All those small PRs are super inefficient, aren't they?**
   This is a common misconception. While it might seem like a lot of work
   to review a lot of small PRs, it is actually more efficient. Smaller PRs
   are easier to review for a larger group of people, meaning more people can
   jump in to help with the reviews. They can be picked up quicker in less
   time and are less likely to conflict with other PRs. In general,
   reviewing a smaller PR gets a better review and is less likely to cause
   new bugs, as it is easier to overlook something in a large PR.

4. **The bot is saying my PR is going stale, what does that mean?**
   The bot will automatically mark a PR as stale after some time of inactivity.
   The bot will close the PR if it remains inactive. This can either mean the PR is
   awaiting a change from you or a review from our project. Please make sure
   the first one isn't the case, in case you are awaiting a review,
   just comment that. By responding to the bot, it will know things are not
   stale and will back off. In the mean time, it might be a good idea to rebase
   your PR on the latest development branches to ensure you are fully
   caught up with recent changes.

5. **I have a PR that should go into a hotfix/patch release, how do I do that?**
   Just create the PR as normal, and make it very clear in the PR description
   that the PR is a hotfix that needs to be included in a patch release. The
   reviewer will then double-check that, and make sure it is included in
   the next patch release by tagging the PR with the next patch milestone.

## Repository specific information

Some of our respositories have specific requirements or guidelines that are
applied on top of this general guide.

### Home Assistant Core

The [Home Assistant Core](https://github.com/home-assistant/core) repository
has quite a few requirements and guidelines to ensure the quality of the code.
The following pages in our developer documentation might be helpful when
creating contributions to our Core repository:

- [Development checklist](/docs/development_checklist)
- [Development checklist for integrations](/docs/creating_component_code_review)
- [Submitting your work](/docs/development_submitting)
- [Style guidelines](/docs/development_guidelines)
- [Testing your code](/docs/development_testing)
- [Catching up with reality](/docs/development_catching_up)
- [Tips and Tricks](/docs/development_tips)

### Home Assistant Documentation

The [documentation](https://github.com/home-assistant/home-assistant.io) has
additional guidelines to take into account when contributing. We mainly
follow the Microsoft Writing Style Guide and have some additional guidelines
for styling YAML configuration.

- [Documentation standards](/docs/documenting/standards)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)
- [YAML Style Guide](/docs/documenting/yaml-style-guide)

### Home Assistant Frontend

The [Home Assistant Frontend](https://github.com/home-assistant/frontend) has 
guidance on developing and contributing to the frontend on the
[Frontend development page](/docs/frontend/development#creating-pull-requests).

### Home Assistant Intents

Building a voice assistant is a complex task. It requires a lot of different
technologies to work together, so there are some guidelines to look at:

- [Contributing template sentences](/docs/voice/intent-recognition/contributing)
- [Response Style Guide](/docs/voice/intent-recognition/style-guide)

## Help?! I have more questions!

The developer documentation has a lot of information, even more information
on contributing and pull requests, so be sure to use the search function
on the top right of the page to find what you are looking for.

However, it might be you are still stuck or you have a question that is
not answered in the documentation. In that case, feel free to ask in the
[#devs channel in our Discord chat](https://www.home-assistant.io/join-chat).

Many of us hang out there, and there is always someone willing to help you out.
