---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Introducing drafting of PRs in our review process
---

Home Assistant gets lots of contributions, which is absolutely amazing! But
when having lots of PRs, it becomes harder to keep track of the state of those.

To help with this, we are introducing a new process to our review process that
automatically drafts PRs when they require more work before they can be reviewed
again (or merged).

We have adjusted our bot to automatically draft PRs if a review has requested
changes to be made. Once the changes have been made, the author of the PR can
click the "Ready for review" button to un-draft the PR and make it ready for
review again.

![The ready for review button in the bottom of a PR in draft mode](/img/en/blog/2023-02-07-introducing-PR-drafting-in-reviews/ready-for-review.png)

Before you click the "Ready for review" button, make sure you have addressed
all requested changes, and all our CI jobs and checks are passing successfully.

## What is a draft PR?

A draft PR is a PR that is not ready for review yet. It is a way to let others
know that you are working on something, but it is not ready for review and
merging yet.

Draft PRs are recognizable by the "Draft" label in the top right of the PR
and show up with a grey merge icon eveywhere in the GitHub UI.

![This is what a PR in draft looks like](/img/en/blog/2023-02-07-introducing-PR-drafting-in-reviews/pr-in-draft.png)

This doesn't mean you should open a PR to start working on something; please
only open a PR if you think it is ready for review and merging. However,
after opening a PR, there may be a reason to put it back into draft state.

For example, opening a PR will automatically trigger our CI jobs
and checks. These checks can reveal issues in your code that need adjustments,
or of course, an actual review took place that requested changes.

You can put any of your PRs back into draft at any moment, by clicking
the "Convert to draft" link in the top right of your PR.

![Putting a PR in draft is something you can do too](/img/en/blog/2023-02-07-introducing-PR-drafting-in-reviews/convert-to-draft.png)

## Why are we doing this?

As a reviewer, you are presented with a lot of PRs. Some of them are ready for
review, and some of them are not. Typically, the only way to find out, is to open
the PR and look at it, to discover it is still in progress.

This is not only a waste of time but also a waste of energy. Especially
considering this happens to multiple reviewers on the same PR multiple times
a day.

The draft state of a PR is visible in all places in GitHub. In notifications,
searches, and just the overview of PRs. Above all, it is easily filterable.

This gives reviewers a better focus on what can actually use their attention
right now.

More background information can be found in this
[Google Document](https://docs.google.com/document/d/11_x2YUmAD07JN7JMM4YIIAWVGTJsOB0UptN8hlmWFWg/edit?usp=sharing).

Or, [read all about our review process on this page](/docs/review-process).