---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Hacktoberfest 2019
---

import DiscussionBox from '../static/js/discourse_discussion.jsx'

This year we're again participating in [Hacktoberfest](https://hacktoberfest.digitalocean.com). Hacktoberfest is a worldwide event to celebrate open source. If you make four pull request in the month of October, you'll get a free Hacktoberfest t-shirt.

Home Assistant is currently racing towards our magical 1.0 release. Home Assistant 1.0 is all about user friendliness. As part of this, we have recently introduced device automations and are expanding how scenes work in Home Assistant.

Home Assistant supports a wide range of products, and so not each feature that we built supports each product type yet. For this Hacktoberfest, we've prepared issues to help integrations use the latest Home Assistant features.

To make it easier to get started, we have introduced a new scaffolding script. This script is able to create all the boilerplate necessary to add new features to existing entity integrations. Including tests! You will only need to focus on code to work with the specific integration. Instructions on how to use it are included in each issue linked below.

If you want to see all available issues instead of the tailored list below, [check here](https://github.com/issues?page=1&q=is%3Aopen+is%3Aissue+org%3Ahome-assistant+archived%3Afalse+label%3AHacktoberfest&utf8=%E2%9C%93) (requires being logged in to GitHub).

**Update Sep 30:** Added docs section, updated the links in the Almond section, added link to all Home Assistant Hacktoberfest issues.

**Update Okt 1:** Added frontend section.

## Scenes

Scenes allow a user to define how a light should look (ie, it should be on and the color should be blue). When a scene is activated, it is then up to Home Assistant to figure out which services to call to make this happen.

Scenes are a powerful tool that is easy to understand for users. It's therefore important that we improve our scene support. We have prepared the following issues:

- [Add `scene.create` service to create scenes on the fly.](https://github.com/home-assistant/core/issues/27023)
- ~~[Add `scene.apply` service to apply a scene defined as service data.](https://github.com/home-assistant/core/issues/26813)~~
- ~~[Add activate scene to script syntax](https://github.com/home-assistant/core/issues/27026)~~
- [Add reproduce state support to entity integrations.](https://github.com/home-assistant/core/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+reproduce_state+is%3Aopen+) (multiple issues)

<!--truncate-->

## Device Automations

Device Automations are a device-oriented way for users to create automations. When defining a trigger, condition or an action part of an automation, the user will start by picking a device to see a list of possible options for that device. Easy!

Device automations rely on integrations to define the possible options for each device. As this is a new technology, we still are looking for help in making all our entity integrations (light, switch etc) support this. We have prepared the following issues:

- [Add device trigger support to entity integrations](https://github.com/home-assistant/core/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+device_trigger+is%3Aopen+) (multiple issues)
- [Add device condition support to entity integrations](https://github.com/home-assistant/core/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+device_condition+is%3Aopen+) (multiple issues)
- [Add device action support to entity integrations](https://github.com/home-assistant/core/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+device_action+is%3Aopen+) (multiple issues)

## Home Assistant Documentation

Guess what is never done? Documentation.

- [Fill in missing documentation for integrations](https://github.com/home-assistant/home-assistant.io/issues?q=is%3Aissue+is%3Aopen+label%3AHacktoberfest)
- [Fill in missing documentation for hass.io add-ons](https://github.com/home-assistant/hassio-addons/issues?q=is%3Aissue+is%3Aopen+label%3AHacktoberfest)

## Frontend

We also have some work to do on the Frontend of Home Assistant.
So we have also prepared some issues to get you started:

- [Make all text translatable](https://github.com/home-assistant/frontend/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+label%3Alocalization+is%3Aopen+) (multiple issues)
- [Help making Home Assistant better accessible](https://github.com/home-assistant/frontend/issues?q=is%3Aopen+label%3AHacktoberfest+label%3Aaccessibility) (multiple issues)
- [And a lot of other small UX issues](https://github.com/home-assistant/frontend/labels/Hacktoberfest?page=2&q=is%3Aopen+label%3AHacktoberfest)

## Bonus: Almond - Virtual Assistant

[Almond](https://almond.stanford.edu/) is an open, privacy-preserving virtual assistant by Stanford University. We have been [collaborating](https://github.com/stanford-oval/thingpedia-common-devices/pull/80) on getting it to work with Home Assistant. Right now it's limited to controlling lights in Home Assistant.

For Hacktoberfest, let's see if we can expand the number of supported types! To get started, check the following links:

- [Documentation on how to contribute Home Assistant specific types](https://almond.stanford.edu/doc/home-assistant-integration.md)
- [Documentation on how to run tests](https://almond.stanford.edu/doc/thingpedia-testing.md)
- Run Almond at [home](https://github.com/stanford-oval/almond-server), use [the Android version](https://play.google.com/store/apps/details?id=edu.stanford.thingengine.engine&hl=en_US) or [the Gnome version](https://flathub.org/apps/details/edu.stanford.Almond)


## Comments

<div id='discourse-comments'></div>

<DiscussionBox discourseUrl="https://community.home-assistant.io/"
      discourseEmbedUrl="https://developers.home-assistant.io/blog/2019/09/27/hacktoberfest.html" />
