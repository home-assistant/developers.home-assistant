---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorFBID: 297400035
title: Climate Cleanup
---

_This post is about the upcoming changes for the Home Assistant climate integration. These changes are being implemented right now and are no longer up for discussion. If you want to see changes, consider opening [an architecture issue](https://github.com/home-assistant/architecture/issues)._

Starting with Home Assistant 0.96, we're shipping a big architectural clean up of our climate integrations. This effort is lead by Pascal Vizeli.

Over the years, the climate integration has grown from being a simple place for thermostats, to hosting ACs, heatpumps and ventilation systems. During this growth, mistakes have been made which resulted in a confusing and hard to work with design. Work is underway to get this all cleaned up and we're going to ship this in Home Assistant 0.96.

The biggest mistake we made is that we conflated operating and operation mode. Operation mode is what you want your thermostat to do, for example heat the house to 19 °C. Operating mode is what the thermostat is _currently_ doing. Is it heating because the house is too cold? Or did it already reach target temperature and is it currnetly idle.

On top of that, we've noticed that a lot of integrations overload operation mode with a wide range of delightful options like "eco", "comfort", "boost" or "sleep". After carefully analyzing all the different climate systems out there, we have come to the conclusion that these alternative operation modes are variations of the existing operation modes (heat, cool, heat-cool), but might have different target temperature ranges or try to heat/cool at a slower pace to conserve energy.

To support as many different thermostats as possible, we have decided to allow climate devices to specify a new "preset" mode that they are operating under. This will cover hold mode, away mode, or any custom operation mode that a thermost wants to include.

You might wonder, why go for a preset instead of allowing to overload operation mode? On first glance it might seem fine for an integration to list the possible options and the current chosen option, easy to make a UI. But that's not the only way Home Assistant is used. We are also serving as a single place to control any thermostat for external systems like Google Assistant or Amazon Alexa. And they have a limited set of operation modes they expect.

A gist of the changes:

 - `operation_mode` has been renamed to `hvac_mode` to emphasize what the mode is for.
 - `hvac_action` is introduced for integrations that know the current action.
 - `set_away_mode` and `set_hold_mode` have been removed.
 - `turn_off` and `turn_on` have been removed. Instead, integrations should expose two HVAC modes, one of them being `HVAC_MODE_OFF`.
 - Property names have been aligned,

If you are a maintainer of an integration that has a climate platform, or maintain a custom compnoent that has one, make sure you [follow the pull request](https://github.com/home-assistant/home-assistant/pull/23899) and test your integration during the beta to make sure that it works like expected.

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
