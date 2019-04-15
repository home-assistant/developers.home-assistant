---
title: "Submit your work"
---

> Always base your Pull Requests of of the current **`dev`** branch, not `master`.

Submit your improvements, fixes, and new features to Home Assistant one at a time, using GitHub [Pull Requests](https://help.github.com/articles/using-pull-requests). Here are the steps:

 1. From your fork's dev branch, create a new branch to hold your changes:

      `git checkout -b some-feature`

 2. Make your changes, create a [new platform](creating_platform_index.md), develop a [new component](creating_component_index.md), or fix [issues](https://github.com/home-assistant/home-assistant/issues).

 3. [Test your changes](development_testing.md) and check for style violations.

 4. If everything looks good according to these [musts](development_checklist.md), commit your changes:

    `git add .`

    `git commit -m "Add some-feature"`

     * Write a meaningful commit message and not only `Update` or `Fix`.
     * Use a capital letter to start with your commit message.
     * Don't prefix your commit message with `[bla.bla]` or `platform:`.
     * Consider adding tests to ensure that your code works.

 5. Push your committed changes back to your fork on GitHub:

    `git push origin HEAD`

 6. Follow [these steps](https://help.github.com/articles/creating-a-pull-request/) to create your pull request.

     * On GitHub, navigate to the main page of the Home Assistant repository.
     * In the "Branch" menu, choose the branch that contains your commits (from your fork).
     * To the right of the Branch menu, click **New pull request**.
     * Use the base branch dropdown menu to select the branch you'd like to merge your changes into, then use the compare branch drop-down menu to choose the topic branch you made your changes in. Make sure the Home Assistant branch matches with your forked branch (`dev`) else you will propose ALL commits between branches.
     * Type a title and complete the provided description for your pull request.
     * Click **Create pull request**.

 7. Check for comments and suggestions on your pull request and keep an eye on the [CI output](https://travis-ci.org/home-assistant/home-assistant/).

