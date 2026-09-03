---
title: "Android end-to-end testing"
sidebar_label: "End-to-end testing"
---

## Why do we perform end-to-end testing?

[Unit tests](/docs/android/testing/unit_testing), [screenshot tests](/docs/android/testing/screenshot_testing), and [integration tests](/docs/android/testing/integration_testing) all validate the app in isolation: the server it talks to is mocked or faked. End-to-end (E2E) tests close that gap by running the real app against a real Home Assistant instance, exercising the same path a user takes.

This is what catches breakages that no other test can see, such as an upstream change in Home Assistant Core or in the frontend that breaks onboarding, or a WebView behavior that only shows up on a specific Android API level.

## The `E2E` workflow

E2E tests run through the [`e2e.yml`](https://github.com/home-assistant/android/blob/main/.github/workflows/e2e.yml) workflow. Each run boots one emulator per API level we support, from 29 up to the latest, and drives the whole flow against a live Home Assistant instance on all of them at once. That breadth is what makes the tests able to detect API level specific issues, but it also makes them expensive, so they are **not** part of the pull request pipeline. Instead, they run:

- Every night at 05:00 UTC on the main branch.
- Manually, through `workflow_dispatch`, on any branch carrying the workflow. The dispatch takes an optional `home-assistant-version` input, which is the Home Assistant image tag to test against (`dev` by default).

### What the workflow does

1. Assembles the `fullDebug` APK for the `x86` and `x86_64` ABIs, with [StrictMode](/docs/android/tips/strict_mode) disabled.
2. Installs the [Maestro](https://maestro.dev/) CLI, verifying the download against the published checksum.
3. Builds the device list: one emulator per API level, from 29 up to `androidSdk-target` in `gradle/libs.versions.toml`.
4. Starts a Home Assistant container from the configuration in `.github/e2e/homeassistant`, and asserts that the `mobile_app` component is loaded before going any further. The image is the `dev` one, so a nightly run always tests against the latest development build of Home Assistant.
5. Starts the emulators on [Emulator.wtf](https://emulator.wtf), installs the APK on each of them, and runs the Maestro flow sharded across all of them in parallel.
6. Uploads the artifacts needed to debug a failure, whatever the outcome of the run.

:::note
The device list is floored at API 29 even though the app supports older versions. On API 26-28 images, the bundled WebView renders the frontend, but its content never surfaces to Maestro's view-hierarchy polling, so every WebView assertion fails. The [instrumentation tests](/docs/android/testing/integration_testing) in the pull request pipeline still cover the full range down to the app's `minSdk`.
:::

### Reaching Home Assistant from the emulators

The Home Assistant container runs on the GitHub Actions runner, while the emulators run on Emulator.wtf. The workflow bridges the two with an egress tunnel, and a DNS override that resolves `homeassistant.internal` to the forwarded IP inside the emulators.

## Maestro flows

The flows live in the `.maestro` folder at the root of the repository. Today there is a single flow, described entirely in [`.maestro/onboarding.yaml`](https://github.com/home-assistant/android/blob/main/.maestro/onboarding.yaml): every step the test performs is written there, and that file is the one to edit when the flow needs to change. It covers the most critical path of the application: connecting to a server, logging in, registering the device, reaching the Overview page, and opening the companion app settings.

The flow is parameterized so it can run against any instance:

- `HOME_ASSISTANT_URL`
- `HOME_ASSISTANT_USERNAME`
- `HOME_ASSISTANT_PASSWORD`

### Editing a flow

The [Maestro documentation](https://docs.maestro.dev/api-reference/commands) describes every available command. A few things are worth keeping in mind when changing `onboarding.yaml`:

- The flow drives the debug application, `io.homeassistant.companion.android.debug`. Changing the `appId` breaks the run, since that is the APK the workflow installs.
- The flow runs on every API level from 29 up to the latest we support, so anything version specific must stay conditional, the way the existing steps handle the permission dialogs that only exist from a given API level onwards.
- Steps match on the text displayed on screen, so renaming a label in the app means updating the flow in the same pull request.

### Running a flow locally

Install the [Maestro CLI](https://docs.maestro.dev/getting-started/installing-maestro), start an emulator or plug in a device, install the debug app on it, and run:

```bash
./gradlew :app:installFullDebug
maestro test \
  -e HOME_ASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOME_ASSISTANT_USERNAME=<username> \
  -e HOME_ASSISTANT_PASSWORD=<password> \
  .maestro/onboarding.yaml
```

The flow launches the app with `clearState`, so it starts from a fresh onboarding every time. Point it at a throwaway instance rather than your own: it registers a new device on the server it connects to.

## Debugging a failure

Every run uploads an `e2e-artifacts` archive, whether it passed or failed. Download it from the run page, or with the GitHub CLI:

```bash
gh run download <run-id> --name e2e-artifacts --dir e2e
```

| Path | Content |
| --- | --- |
| `maestro-results/` | Per-shard command trace, `maestro.log`, and the screenshots captured on failure |
| `logcat-*.txt` | Full device logcat, one file per emulator |
| `homeassistant.log` | Timestamped container log |
| `homeassistant-config.json` | The `/api/config` response: Home Assistant version and loaded components |
| `homeassistant-container.json` | `docker inspect` of the container, including the exact image digest |

Read them in that order and stop at the first one that explains the failure. Most failures are already visible in the failing Maestro command and the screenshot taken at that point, which is the fastest way to tell a genuinely broken screen from an element that merely never reached the accessibility tree. Opening the Home Assistant log first usually wastes time.

Only once the app and the flow are ruled out is it worth looking upstream. The `dev` image moves every night, so the useful comparison is against the last run that passed: diff the two `homeassistant-config.json` files to get the Home Assistant version on either side of the break, then look at what landed in [core](https://github.com/home-assistant/core) or the [frontend](https://github.com/home-assistant/frontend) between those dates.

## Automated triage

A nightly failure goes unnoticed unless someone checks the workflow results every morning. To avoid that, a failing `E2E` run dispatches an `e2e-triage` agentic workflow, and a successful run closes the issue a previous failure opened. A green night never spends an agent run.

The triage workflow downloads the artifacts of the failed run, and those of the last successful run when one is available, then follows the procedure documented in the `.agents/skills/ha-android-e2e-debugging` skill, which is the source of truth for the triage order, for what each artifact contains, and for the known flake patterns.

The agent only diagnoses: it never modifies a file or opens a pull request. It reports into a single `e2e-failure` issue in the Android repository, commenting on it when one is already open and creating it otherwise. An upstream finding is reported there as well, including the proposed fix, for a maintainer to carry over to `core` or to the `frontend`.
