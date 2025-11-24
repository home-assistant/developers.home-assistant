---
author: Frenck
authorURL: https://github.com/frenck
authorImageURL: https://avatars.githubusercontent.com/u/195327?v=4
title: "Introducing Labs: Preview features before they become standard"
---

We're excited to announce a new system for shipping preview features in Home Assistant: **Labs**. Labs provides a standardized way for integrations to offer fully tested features that users can opt into before they become standard, allowing us to gather feedback and refine the design based on real-world usage.

## What are Labs preview features?

Labs preview features are different from beta testing. While beta testing evaluates the stability of upcoming Home Assistant releases, Labs is about refining user interfaces and design. Labs features are fully tested and functional, but their design and behavior may still change as we gather real-world usage and feedback. This means they might have breaking changes, be extended with new functionality, or even be removed if they don't work out.

Think of it this way:

- **Beta**: Evaluates the stability of upcoming Home Assistant releases
- **Labs**: Fully tested features with evolving design and user interface, refined through real-world usage and feedback

## How it works

Integrations declare preview features in their `manifest.json` with links for feedback, documentation, and issue reporting. Users can then enable these features in **Settings** → **System** → **Labs**, and they activate immediately without requiring a restart. The integration code checks whether a feature is enabled and responds accordingly.

## Why Labs?

Many of our most significant improvements benefit from real-world testing before becoming standard. Labs provides:

1. **Structured feedback channels**: Each feature has dedicated URLs for feedback, documentation, and issue reporting
2. **Runtime activation**: Features enable and disable instantly, no configuration updates or restart required
3. **Clear expectations**: Users know they're trying fully tested features whose design may change based on feedback
4. **Iterative development**: Integrate user feedback directly into the development process

## Example: Kitchen Sink special repair

The [Kitchen Sink](https://www.home-assistant.io/integrations/kitchen_sink/) demo integration includes a working example. When enabled, the "special repair" feature creates a repair issue to demonstrate how Labs features can interact with other Home Assistant integrations. See the [developer documentation](/docs/development/labs#complete-example-kitchen-sink-special-repair) for the complete implementation.

## Getting started

Ready to add a Labs preview feature to your integration? Check out our [comprehensive guide](/docs/development/labs) which covers:

- When to use Labs (and when not to)
- How to define features in your manifest
- Implementation patterns for backend and frontend features
- Runtime activation requirements
- Testing approaches
- Feature lifecycle (preview → standard or removal)

## What's next?

We encourage integration developers to consider Labs for:

- Major UI changes or redesigns
- Significant architectural changes that benefit from real-world testing
- Features where user feedback will shape the final design

Labs is **not** for:

- Permanent configuration options (use integration options instead)
- Minor changes that can go directly into releases
- Features with critical bugs or that are fundamentally incomplete

## Try it yourself

Want to see Labs in action? Install the Kitchen Sink demo integration and enable the "Special repair" feature in Settings → System → Labs. You'll see firsthand how preview features work.
