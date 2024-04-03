---
author: Robert Resch
authorURL: https://github.com/edenhaus
authorImageURL: https://avatars.githubusercontent.com/u/26537646?s=96&v=4
title: "How uv saves Home Assistant 215 compute hours per month"
---

By replacing `pip` with `uv` in our production images, our build pipeline (and therefore releasing a new version) is a lot faster.
`Uv` is an extremely fast Python package installer and resolver written in Rust. It is developed by [Astral](https://astral.sh/) and it's open source. Check it out on [GitHub](https://github.com/astral-sh/uv).

In the following table, you can see that we can save around 5 hours of execution time on each build.

| Arch      | Pip          | UV       | Savings  |
|-----------|--------------|----------|----------|
| aarch64   | 1h 24m 53s   | 5m 18s   | ~1h 20m  |
| armhf     | 1h 52m 20s   | 6m 2s    | ~1h 46m  |
| armv7     | 1h 26m 43s   | 5m 28s   | ~1h 21m  |
| amd64     | 22m 10s      | 3m 20s   | ~19m     |
| i386      | 17m 37s      | 3m 11s   | ~14m     |

On average, we run the build pipeline 43 times as we create
- 31 nightlies (one nightly per day)
- 7 beta releases
- 5 stable releases (including patch ones)

In total, we save around 215 hours per month.
With this massive improvement, we can now ship hotfixes even faster, as the pipeline to ship a new version now takes around 20 minutes instead of 2.5 hours.

The 215 monthly saved execution hours can be used by other jobs and make the CI experience for all developers and our community better.
By replacing `pip` with `uv`, we improve our sustainability by using fewer resources to build our images.


**A big thank you to Astral for developing this amazing tool.**
Please check out their [website](https://astral.sh/) and products as they offer, for example, a "lighting" fast linter/formatter for Python too.