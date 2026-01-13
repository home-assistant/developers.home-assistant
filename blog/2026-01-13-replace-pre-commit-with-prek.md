---
author: Robert Resch
authorURL: https://github.com/edenhaus
authorImageURL: https://avatars.githubusercontent.com/u/26537646
title: "Replacing pre-commit with prek"
---

By replacing `pre-commit` with [`prek`](https://prek.j178.dev/) we can increase the performance of our checks. Prek uses the same `.pre-commit-config.yaml` as `pre-commit` and is a complete replacement. Due the fact that `prek` is written in Rust and allows the execution of diffrent jobs in parallel, we can check our code even faster.

New development enviroments will automatically install `prek` and for existing ones please just update the test requirements by running `uv pip install requirements_test.txt`