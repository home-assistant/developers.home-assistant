---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Hacktoberfest 2019
---

This year we're again participating in [Hacktoberfest](https://hacktoberfest.digitalocean.com). Hacktoberfest is a worldwide event to celebrate open source. If you make four pull request in the month of October, you'll get a free Hacktoberfest t-shirt.

Home Assistant is currently racing towards our magical 1.0 release. Home Assistant 1.0 release is all about user friendliness. As part of this, we have recently introduced device automations and are expanding how scenes work in Home Assistant.

Home Assistant supports a wide range of products, and so not each feature that we built supports each product type yet. For this Hacktoberfest, we've prepared issues to help integrations use the latest Home Assistant features.

To make it easier to get started, we have introduced a new scaffolding script. This script is able to create all the boilerplate necessary to add new features to existing entity integrations. Including tests! You will only need to focus on code to work with the specific integration. Instructions on how to use it are included in each issue linked below.

## Scenes

Scenes allow a user to define how a light should look (ie, it should be on and the color should be blue). When a scene is activated, it is then up to Home Assistant to figure out which services to call to make this happen.

Scenes are a powerful tool that is easy to understand for users. It's therefore important that we improve our scene support. We have prepared the following issues:

- [Add `scene.create` service to create scenes on the fly.](https://github.com/home-assistant/home-assistant/issues/27023)
- [Add `scene.apply` service to apply a scene defined as service data.](https://github.com/home-assistant/home-assistant/issues/26813)
- [Add reproduce state support to entity integrations.](https://github.com/home-assistant/home-assistant/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+reproduce_state+is%3Aopen+) (multiple issues)

<!--truncate-->

## Device Automations

Device Automations are a device-oriented way for users to create automations. When defining a trigger, condition or an action part of an automation, the user will start by picking a device to see a list of possible options for that device. Easy!

Device automations rely on integrations to define the possible options for each device. As this is a new technology, we still are looking for help in making all our entity integrations (light, switch etc) support this. We have prepared the following issues:

- [Add device trigger support to entity integrations](https://github.com/home-assistant/home-assistant/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+device_trigger+is%3Aopen+)
- [Add device condition support to entity integrations](https://github.com/home-assistant/home-assistant/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+device_condition+is%3Aopen+)
- [Add device action support to entity integrations](https://github.com/home-assistant/home-assistant/issues?utf8=%E2%9C%93&q=label%3AHacktoberfest+device_action+is%3Aopen+)

## Bonus: Almond - Virtual Assistant

[Almond](https://almond.stanford.edu/) is an open, privacy-preserving virtual assistant by Stanford University. We have been [collaborating](https://github.com/stanford-oval/thingpedia-common-devices/pull/80) on getting it to work with Home Assistant. Right now it's limited to contorlling lights in Home Assistant.

For Hacktoberfest, let's see if we can expand the number of supported types!

The Almond team is working on creating some documentation tailored to Home Assistant specific contributions ([issue](https://github.com/stanford-oval/almond-cloud/issues/496)). I'll update this blog post when it is live.

For now, you can get started contributing to Almond with the following links:

- Run Almond at [home](https://github.com/stanford-oval/almond-server), use [the Android version](https://play.google.com/store/apps/details?id=edu.stanford.thingengine.engine&hl=en_US) or [the Gnome version](https://flathub.org/apps/details/edu.stanford.Almond)
- Follow the tutorial on [adding a new type](https://almond.stanford.edu/doc/thingpedia-tutorial-nyt.md)
- Check out the Home Assistant light implementation: [class](https://github.com/stanford-oval/thingpedia-common-devices/blob/wip/home-assistant/io.home-assistant/light-bulb.js), [metadata](https://github.com/stanford-oval/thingpedia-common-devices/tree/wip/home-assistant/light-bulb)

<div id='discourse-comments'></div>

<script markdown="0">
  DiscourseEmbed = { discourseUrl: 'https://community.home-assistant.io/',
                     discourseEmbedUrl: 'https://developers.home-assistant.io/blog/2019/05/22/internet-of-things-and-the-modern-web.html' };
  (function() {
    var d = document.createElement('script'); d.type = 'text/javascript'; d.async = true;
    d.src = DiscourseEmbed.discourseUrl + 'javascripts/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(d);
  })();
</script>
