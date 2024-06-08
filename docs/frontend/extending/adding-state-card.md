---
title: "Adding state card"
---

The main interface of Home Assistant is a list of the current entities and their states. For each entity in the system, a state card will be rendered. State cards will show an icon, the name of the entity, when the state has last changed and the current state or a control to interact with it.

![Cards in the frontend](/img/en/frontend/frontend-cards1.png)

The different card types can be found [here](https://github.com/home-assistant/frontend/tree/dev/src/state-summary).

Sensors, when not grouped, are shown as so-called badges on top of the state cards.

![Badges in the frontend](/img/en/frontend/frontend-badges.png)

The different badges are located in the file [`/src/components/entity/ha-state-label-badge.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/entity/ha-state-label-badge.ts).

Adding a custom card type can be done with a few simple steps. For this example we will add a new state card for the domain `camera`:

 1. Add `'camera'` to the array `DOMAINS_WITH_CARD` in the file [/common/const.ts](https://github.com/home-assistant/frontend/blob/dev/src/common/const.ts).
 2. Create the files `state-card-camera.ts` in the folder [/state-summary/](https://github.com/home-assistant/frontend/tree/dev/src/state-summary).
 3. Add `import './state-card-camera.ts';` to [state-card-content.ts](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-content.ts).
