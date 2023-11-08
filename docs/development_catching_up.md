---
title: "Catching up with Reality"
---

If it's taking a while to develop your feature, and you want to catch up with what's in the current Home Assistant `dev` branch, you can use `git rebase`. This will pull the latest Home Assistant changes locally, rewind your commits, bring in the latest changes from Home Assistant, and replay all of your commits on top.

:::tip
If you use the workflow below, it is important that you force push the update as described. Git might prompt you to do `git pull` first. Do **NOT** do that! It would mess up your commit history.
:::

You should have added an additional `remote` after you clone your fork. If you did not, do it now before proceeding.

```shell
git remote add upstream https://github.com/home-assistant/core.git
```

```shell
# Run this from your feature branch
git fetch upstream dev  # to pull the latest changes into a local dev branch
git rebase upstream/dev # to put those changes into your feature branch before your changes
```

If rebase detects conflicts, repeat this process until all changes have been resolved:

1. `git status` shows you the file with the conflict; edit the file and resolve the lines between `<<<< | >>>>`
2. Add the modified file: `git add <file>` or `git add .`
3. Continue rebase: `git rebase --continue`
4. Repeat until you've resolved all conflicts

After rebasing your branch, you will have rewritten history relative to your GitHub fork's branch. When you go to push you will see an error that your history has diverged from the original branch. In order to get your GitHub fork up-to-date with your local branch, you will need to force push, using the following command:

```shell
# Run this from your feature branch
git push origin --force-with-lease
```

If that command fails, it means that new work was pushed to the branch from either you or another contributor since your last rebase.
You will have to start over the git fetch and rebase process described above, or if you are really confident those changes are not needed, just overwrite them:

```shell
# Run this from your feature branch, overwriting any changes in the remote branch
git push origin --force
```

Other workflows are covered in detail in the [Github documentation](https://docs.github.com/get-started/quickstart/fork-a-repo).
