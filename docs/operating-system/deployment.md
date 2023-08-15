---
title: "Deployment/Releases"
sidebar_label: Deployment
---

Home Assistant Operating System releases are built from the release branch. GitHub Actions are used to build all public releases. There is no fixed schedule, builds are triggered as needed by the HAOS maintainer. Changes need to get applied to the development branch first and labeled with the `rel-x` label. The maintainer will backport those patches onto the release branch before the next release.

## Branches

- `dev`: Development branch. Carries the next major version during development. During release candidate phase, release candidates are tagged on this branch.
- `rel-X`: Release branch. One per major release. Typically new releases only get built from the last major release version. Each release gets tagged with its version number.

## Versioning

The format of version is *MAJOR.BUILD*. Every time a new release is released the BUILD number gets incremented (stored in `buildroot-external/meta`). The MAJOR number is inherited from the development branch, and gets bumped right after the release branch has been created.

The build system by default automatically adds a *dev{DATE}* suffix to mark development builds.

Before a new major release, release candidates can be built on the development branch. A release candidate suffix (like `.rc.1`) is used to mark these; for example, files will be named *MAJOR.0.rc1*.

## Deployment types

HAOS provides 3 different types of deployments. The deployment differ in which public keys they include for over the air updates. The deployment type is shown in the Supervisor web frontend in the System tab on the Host card.

- development (dev)
- staging (beta)
- production (stable)

## Build pipelines

GitHub Actions are used to build HAOS development and release builds. Two workflow exist:

- `.github/workflows/dev.yml`: Development builds, triggered manually, images stored on [os-builds.home-assistant.io](https://os-builds.home-assistant.io/).
- `.github/workflows/release.yml`: Release (and release candidate) builds, triggered when a GitHub release gets published, images stored as GitHub release asset.

The development build pipeline can also be triggered from a PR: The appropriate board labels need to be set first, a build for those boards is then triggered when adding the `run-dev-build` label.
