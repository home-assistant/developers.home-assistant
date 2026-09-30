---
title: "Versioning"
---

Home Assistant Core uses [calendar versioning](https://calver.org/) (CalVer). A version is made up of three dot-separated parts:

```
YYYY.MM.PATCH
```

| Part | Meaning |
| --- | --- |
| `YYYY` | The year of the release (for example `2026`). |
| `MM` | The month of the release, **not** zero-padded (for example `5`, not `05`). |
| `PATCH` | The patch number within that monthly release, starting at `0`. |

For example, `2026.5.0` is the initial release for May 2026, and `2026.5.1` and `2026.5.2` are subsequent patch releases for that same month. For the release schedule and channels, see the [release FAQ](https://www.home-assistant.io/faq/release/).

## Pre-releases and development versions

Versions follow [PEP 440](https://peps.python.org/pep-0440/), so the `PATCH` part can carry a suffix that marks a non-stable build:

| Kind | Format | Example |
| --- | --- | --- |
| Stable release | `YYYY.MM.PATCH` | `2026.5.0`, `2026.5.2` |
| Beta | `YYYY.MM.PATCH` + `b<N>` | `2026.5.0b0` |
| Nightly | `YYYY.MM.PATCH` + `.dev<YYYYMMDDHHMM>` | `2026.7.0.dev202607241254` |
| Development | `YYYY.MM.PATCH` + `.dev<N>` | `2026.7.0.dev0` |

## How the version is set

The version is hard-coded in [`homeassistant/const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/const.py) as the `MAJOR_VERSION`, `MINOR_VERSION`, and `PATCH_VERSION` constants. The `dev` branch always carries the upcoming release as a development version (for example `2026.7.0.dev0`).

The version is not derived automatically from tags or dates; it is bumped explicitly with the [`script/version_bump.py`](https://github.com/home-assistant/core/blob/dev/script/version_bump.py) helper, which knows how to advance each kind of version (`minor`, `patch`, `dev`, `beta`, and `nightly`). For example, cutting the first beta turns `2026.7.0.dev0` into `2026.7.0b0`, and the final release drops the suffix to `2026.7.0`.

:::note

When you need to gate behavior on a Home Assistant Core version, compare versions with [AwesomeVersion](https://github.com/ludeeus/awesomeversion) rather than parsing the string yourself, so that pre-releases, development, and patch releases sort correctly.

:::
