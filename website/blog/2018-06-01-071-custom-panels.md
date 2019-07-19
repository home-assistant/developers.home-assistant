---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: 0.71: Improved custom panels and minor changes for custom UI
---

Efforts to modernize and localize the frontend are moving full speed. This blog post will touch upon the upcoming features for Home Assistant 0.71 which should hit the beta channel today and is planned for a release a week from now.

## Improved Custom Panel support

Custom panels allow developers to build panels that will plug into the Home Assistant user interface, with the same possibilities like our other panels like history, map etc. The Home Assistant frontend will manage authentication and the subscription for states of the backend, the panel only has to take care of displaying the data and can offer users option to control things (calling services etc).

This support has been around for a while, but last week we've spend some time [polishing](https://github.com/home-assistant/home-assistant/pull/14708) our support and have three new additions:

First new feature is that we now allow importing a panel from a JavaScript URL. This is going to be the preferred way to distribute panels moving forward. This also means that you can refer to a panel hosted externally. The user will have to approve before external panels get loaded. It's still possible for users to host it locally (and no approval is needed) by copying the panel to `<config dir>/www/your-panel.js` and use `/local/your-panel.js` as  the url.

Second new feature is that we can now embed your panel in an iFrame. This allows panel developers to not have to worry about including duplicate web components and it makes it possible to develop React-based panels. In the past, React-based panels didn't work because React doesn't work well inside Shadow DOM ([more info](https://github.com/facebook/react/pull/12163)).

Third new feature is that we now make a [starter kit](https://github.com/home-assistant/custom-panel-starter-kit-react) available to start developing React based panels! The kit contains everything that is needed to start developing React-based panels and share them with the community. Let us know what you're building!

## Custom UI: `<state-info>` and `<ha-relative-time>`

If you're building custom UI, odds are that you're using either `<state-info>` and `<ha-relative-time>`. Although not officially supported as external facing API, we still want to give a heads up that it's going to be needed to pass the `hass` object in.

This is necessary because `<ha-relative-time>` can now be localized thanks to c727 in [#1241](https://github.com/home-assistant/home-assistant-polymer/pull/1241.)
