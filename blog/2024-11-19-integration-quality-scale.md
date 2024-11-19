---
author: Joost Lekkerkerker
authorURL: https://github.com/joostlek
authorImageURL: https://avatars.githubusercontent.com/u/7083755?v=4
title: "Integration quality scale"
---

Since the original quality scale has been introduced in 2020, Home Assistant changed quite a lot.
Both in how integrations are developed and what features they can provide.
The quality scale, however, has not been updated to reflect these changes.

The last couple of months we have been working with the community on a new integration quality scale, that does fit the current state of Home Assistant.
To give an overview of the changes:

- The quality scale now has four scaled tiers: Bronze, Silver, Gold, and Platinum. The newly added Bronze tier is the new minimum requirement for new core integrations going forward. This does lower the bar for new integrations for a bit, but it does make it clear upfront what is expected from a core integration in this day and age.
- A new non-scaled tier, legacy, has been added for integration that are not configurable via the UI yet. This tier would indicate to the user that the integration might not meet their expectation compared to integrations configurable via the UI.
- To allow the scale to grow with Home Assistant and to avoid another major rework in the future, we have designed a rulebook for the scale so it's known what needs to happen when a rule is added.
- To show that the project has a commitment on keeping the scale up to date, we have created an architecture decision record (ADR) that describes the goal and the process of keeping the scale up to date.
- The developer documentation now has a brand new section dedicated to the Integration Quality Scale. It includes the rules, the reasoning for every rule and it provides examples that can be used to give an idea of how to implement it. There is also a checklist generated that can be used for changing scales.
- Documentation now also plays a role in the quality of the integrations, since the user experience of an integration goes beyond code.

So, with this in place; you might wonder what the next steps are.
Because this is a major rework of the scale, we have decided to drop the scale of the current integrations.
This means that those integrations have to create a PR to get their scale back to the level they think it should be.

I would also like to motivate the community to help out with getting as many integrations to Bronze (or above) as possible.
I also want to thank the community for their input in the quality scale and their effort in maintaining the integrations.
Home Assistant would not be where it is today without the community ❤️.