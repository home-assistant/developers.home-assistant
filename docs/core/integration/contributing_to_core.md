---
title: "Contributing an integration to core"
sidebar_label: "Contributing to core"
---

On this page, you will find information about how to contribute an integration to Home Assistant Core.
We are very happy to receive contributions of new integrations to Home Assistant Core.
As these changes are generally more complex than a feature to an existing integration, we have a set of guidelines that will make the process smoother for everyone involved.

## Is the integration suitable to be included?

As Home Assistant is a popular project we receive a lot of contributions. We want to make sure we spend our time reviewing and maintaining integrations on the ones that users can benefit from today and in the future.
This means that we have some requirements for an integration to be eligible for inclusion in Home Assistant Core:
- The product or service that the integration connects to should be available for purchase and use by Home Assistant users. This means we don't accept integrations for products that are not yet released or services that are in private beta, like Kickstarter projects or similar.
- The product or service should be established. We want to avoid companies using Home Assistant as a marketing platform for their new products, so we require that the product or service has been widely available and has a user base.

If your integration does not meet these requirements, feel free to publish it as a custom integration on GitHub and HACS.

## What requirements does the integration need to meet?

A new integration, that is eligible, should meet a set of requirements to be accepted.

### Integration quality scale

To measure the quality of an integration, we use the [integration quality scale].
This scale defines a set of rules that an integration should follow to be considered of a certain quality level.
The rules cover various aspects of an integration, such as documentation, testing, code quality, and more.

New integrations should at least reach the [bronze] level of the integration quality scale.
It's not required to reach a higher level right away, as that will likely only increase the scope of the pull request and make it harder to review and merge.

[bronze]: /docs/core/integration-quality-scale/rules#-bronze
[integration quality scale]: /docs/core/integration-quality-scale

### Python library for communication

An important [integration quality scale rule] to highlight is the requirement to use a Python library for communication with the product or service.
The Home Assistant codebase would be massive if we had to implement the communication with the product or service in the integration itself, and it would also make it harder to maintain and test the integration.
By using a Python library, we can keep the integration code focused on the Home Assistant-specific parts, such as the entity definitions, and delegate the communication with the product or service to the library.
This also allows the library to be reused by other projects and integrations, which improves the overall ecosystem.

To see the requirements for the Python library, check the [dependency transparency] rule in the integration quality scale.

:::tip
For more information on how to create a Python library, checkout our guide on [creating a Python library].
:::

[integration quality scale rule]: /docs/core/integration-quality-scale/rules/dependency-transparency.md
[dependency transparency]: /docs/core/integration-quality-scale/rules/dependency-transparency.md
[creating a Python library]: /docs/api_lib_index.md

## How to contribute an integration to core

Once your integration is in a good shape and ready to be contributed to Home Assistant Core, there are a few steps you need to follow to make sure it can be reviewed.

### Make your pull request as small as possible

A new integration should have the minimum amount of code and features to be useful for users.
A well-scoped pull request is easier to review and merge as this allows reviewers to approve and merge smaller chunks of code.
**Pull requests containing large code dumps that do not follow these guidelines may be closed.**

For a new integration this means:
- Limit to a single platform.
- Do not add features that are not essential for the initial platform to work. This includes features like:
  - Diagnostics
  - Custom service actions
  - Reauthentication and reconfiguration flows
- Ideally keep more complex integration quality scale rules (such as `dynamic-devices` and `stale-devices`) out.

To read more on how to scope a pull request, check our guide on [creating the perfect PR].

[creating the perfect PR]: /docs/review-process.md#creating-the-perfect-pr

### Make sure the code checks pass

Please make sure you have a proper development environment set up and that you have run the code checks locally before opening a pull request.
If the CI checks fail because of your changes, we can't review and merge your pull request until the checks pass.
Keep in mind that some tests can be flaky, so if you are sure the failures are unrelated to your code, please wait for a maintainer instead of trying to re-run the CI every time it fails.

:::info
Our pre-commit checks can update files outside the directory of your integration. These changes should be included in your pull request.
:::

### Provide enough context in the pull request description

When you open a pull request to contribute an integration to Home Assistant Core, make sure to provide enough context in the description of the pull request.
This includes:
- A description of the product or service that the integration connects to.
- A link to the git repository of the library used for communication with the product or service.
