---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Internet of Things and the Modern Web
---

<style markdown="0">
  #demo {
    width: 100%;
    height: 475px;
    border: 2px solid #03A9F4;
    border-radius: 4px;
  }
  #discourse-comments {
    margin-top: 2em;
  }
  .show-small {
    display: none;
  }
  .onPageNav {
    display: none;
  }
  @media (max-width: 600px) {
    .hide-small {
      display: none;
    }
    .show-small {
      display: initial;
    }
  }
</style>

[Home Assistant](https://www.home-assistant.io) is world's biggest open-source home automation platform. It [supports](https://www.home-assistant.io/components/) over 1000 devices and services, and it is used everywhere: homes, [boats](https://hasspodcast.io/ha048/) and [museums](https://twitter.com/sjvanterpool/status/1124035433212649475).

Today I want to talk about our UI, what we're trying to solve and how we solve it. <span class='hide-small'>Before we dive into why, what and how, let's take a look at our user interface. This is an embedded version of <a href='https://demo.home-assistant.io' target='_blank'>our demo</a>, which is fully interactive.</span>

<iframe id='demo' class='hide-small' src="https://demo.home-assistant.io""></iframe>

<p class='show-small'><i>The embedded demo has been hidden because the screen is too small. <a href='https://demo.home-assistant.io' target='_blank'>Open the demo in a new screen.</a></i></p>

# Use Cases

When building a platform for the Internet of Things, there are many use cases that warrant a user interface. Note that for the sake of this blog post, we're focusing on graphical user interfaces on devices with screens the size of a phone, or bigger.

**Security.** Users that want to have a quick glance at their house when they are away from home. They quickly want to check if their garage door is closed or maybe they got notified of unexpected motion in the backyard or water below the sink and need to check out. These users will want to see a logbook with recent security related incidents, the current camera streams and the current state of the doors, windows, water- and motion sensors.

**Control all the things.** Users want to have a single place to control all their devices. Their goal of the user interface is to quickly see each part of the house at a glance and control lights, switches, thermostats and the music.

**Control single room.** Users that are building interfaces for devices in each room. These devices need to expose all controls of a single room, with optional extra information about the whole house and options to control other parts of the house.

**Monitor.** Users want to build their own dashboards to visualize all the current and historical data inside Home Assistant and other databases, like InfluxDB. They want to keep track of their energy usage, track their internet speeds or current commute time.

**Administer and Automate.** Users that want to have dashboards that contain their controls to administrate Home Assistant. It contains their automations, scripts and various input controls to allow configuring the parameters of their automations and scripts.

The odds are that if you are using Home Assistant right now, your UI is a hybrid of a couple of the mentioned use cases. Todays blog post is going to talk about what technologies we have used to built a UI that allows users to build UIs that fit all these use case.

<!--truncate-->

# The Requirements

When we started to re-architect a part of our interface last year, we came up with a list of requirements based on the use cases, our experience with building our previous interface, and the problems we ran into.

* **It needs to have zero runtime magic.** Each user wants something different, and so if we make a decision during runtime, people will ask for configuration options to influence this decision. Our UI will need to base all decisions off the configuration, and only jump in with smartness if no configuration is given. We can still suggest configurations to the user, but once the user edits it, they own it and are the only ones updating it.
* **It needs to be customizable.** Users want to be able to change everything. It is important that we allow users to specify configuration options to change things like styling, names or icons.
* **It needs to be mobile first.** Home Assistant does not ship with separate mobile applications. Our UI is going to be used on mobile devices, laptops, and everything in between. It needs to be possible to install, use and configure Home Assistant with just a mobile phone.
* **It needs to be emerging market ready.** Home Assistant wants to make the smart home accessible to everyone. Because we are free and open source, we are accessible to a wide range of people from across the globe. Most of these people are on slow phones and with spotty internet. Our user interface still needs to be usable and be able to run on many different phones.
* **It needs to be extensible.** With many use cases to cover, it is important that the UI is extensible. Extensibility allows developers to experiment and allows us to support everything, yet not have to satisfy all edge cases/unique features in the Home Assistant core, where it will have to be maintained forever.
* **It needs to be easy to develop for.** It can be easy to get lost in tooling. Especially while trying to maintain support for all the different devices, but also offer easy theming and configuration. It should be easy for anyone to go from user to developer, without spending 2 days preparing the development environment.

# Modern Web is our Platform of Choice

Quite the list of requirements. Home Assistant is an open source project that, thanks to the generous support of our users, has 2 full time developers working on it together with an army of volunteer developers across the globe. With such a set up, we had to make decisions on how to achieve our goals. And there was only one platform that fit the bill perfectly, a platform that allows us to offer theming, configuration options for defaults but also allows us the user to import external components to render parts of the page, and that allows us to structure the code in an easy way to allow users to easily access it from any device: the modern web.

Note that I say modern. In recent years browsers, web frameworks and tooling have come a really long way in offering a way to easily tackle our challenges. We have seen the introduction of CSS properties, custom elements and all major web tooling supports code splitting out of the box.

And all this modern web goodness is widely available: desktop browsers have become evergreen, which means they self-update without user intervention. Android users can get browser updates via the Play Store and Apple tends to give their phones 5 years of updates, with each update containing an updated browser.

# The Implementation

A lot of the things that we do are based off or inspired by others. Although I don’t have a definite list of all people that inspired all our choices or approaches, it was definitely inspired by tweets and talks by [Alex Russel](https://twitter.com/slightlylate), [Rich Harris](https://twitter.com/Rich_Harris), [Justin Fagnani](https://twitter.com/justinfagnani), [Malte Ubl](https://twitter.com/cramforce) and the Polymer team mantra “Do less and be lazy". These people have helped shape our mindset on how we approach building a great UI.

In case you are wondering how an open source project got such an extensive list of cool stuff that we are doing, it’s actually _because_ we are open source project. For the volunteers working on this, this is fun. We love following the latest frontend developments and implement them, without having to worry about someone complaining about how our time is better spend on other things.

* **[TypeScript](https://www.typescriptlang.org/) is our language of choice.** Home Assistant supports a lot of different types of devices, contains a lot of APIs and supports a lot of different widgets in the frontend. It is impossible to expect people to remember this all, and by leveraging TypeScript no one has to. TypeScript is a typed version of JavaScript that offers compilation time type-checking and great auto-complete. When we do a release, the TypeScript is converted to JavaScript so that no special runtime is needed in the browser.
* **[Lit Element](https://lit-element.polymer-project.org/) is our web framework of choice and powers our user interface.** Lit Element is a web framework that allows declarative templating, is just 6kb gzip’d, is blazing fast and has great TypeScript support. Lit Element does not require any build tooling, so it has also become the framework of choice for our developers creating UI extensions.
* **[Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) as the technology of choice for extensibility.** The web is ever changing, and we want to attract a wide range of developers. So we didn’t want to pick a framework and force our users to use it. So instead, we chose the compatibility layer that browsers have built-in: custom elements. Custom elements are a browser specification that allows developers to specify their own HTML tags that, once added to the DOM, interact with your JavaScript code to allow you to update the page.

  Custom elements are very flexible. It is possible to add the tags to the page before the actual JavaScript is loaded. Once loaded, it will take over and render the correct UI. This makes it perfect for being able to build the page up quickly without having to load everything in advance. The browser also allows us to listen for when a custom element gets defined, allowing us to rebuild parts of the UI as things get loaded.
* **Isolating our components using Shadow DOM.** Although we want developers to run code on our page, we don’t want them to accidentally mess up our built-in components, or even worse, break the whole page. To protect our components, we use Shadow DOM. This allows us to encapsulate the DOM and styling of our components.
* **Allow theming using CSS properties.** Users want to customize the built-in components and they want to customize third party components that they import. This has to work regardless of the web frameworks that the developers use to build their widgets. We have been able to solve this using CSS properties. CSS properties are CSS values that a user can set on the whole UI, per tab and sometimes per card to customize the look and feel.
* **Rely on Static DOM.** When the page is first loaded, we will build up the page as per the users configuration. After that, we won’t touch it again. Instead, when a state changes, we will have the state be passed on to all the relevant components where lit-html will efficiently change the pieces that require updating.
* **Shipping modern JavaScript.** We produce two builds of our frontend. One version is aimed at modern browsers, is imported as a module and can leverage modern features like lambdas, classes and async/await. The modern version generates a lot less code and the JavaScript engine in the browser can better understand the codes’ intention, which results in faster execution.

  We used to use browser user agent detection to decide on what version to ship, but have recently moved to frontend feature detection by leveraging `type=module`, `nomodule` and a specific check to make sure Safari 10.1 doesn’t load both.
* **Aggressively pre-cache using Service Workers.** Home Assistant ships with a service worker. A service worker is an independent JavaScript script that runs in the background of the website and which we set up to download all code that is ever needed to show our UI in advance. This means that once the service worker is up and running, the only requests to the server are for the data! We already register the service worker while you are logging in, so that when you finish logging in, the frontend has been downloaded. We use [Workbox](https://developers.google.com/web/tools/workbox/) to generate our service worker during build time.
* **Decouple code that fetches data and code that renders UI.** The first thing that we load on the page is a 5KB JS file that will initiate the connection to the server and start requesting the necessary data. In the meanwhile, the browser is parsing the rest of the JavaScript required to render the initial page. We use a `link rel=preload` to make sure thet this JavaScript file is the first thing that gets downloaded as soon as the page loads.
* **Easy state management.** To be able to share our state with any component, internal or external, we decided to roll our own state management. It’s a simple object that contains the current state of the house and it is passed down our component tree. Whenever the state changes, we make a copy and update the changed parts and then pass it down again to all the components. Components will then re-render and show the latest state. All state updates are managed by Home Assistant JS Websocket, and are all generated on the server. They are pushed to the frontend using web sockets, allowing all open UIs to stay in sync because they all receive the latest changes as soon as possible.

  [Home Assistant JS Websocket](https://github.com/home-assistant/home-assistant-js-websocket/) is our 4KB WebSocket + Auth library that can be added to any site to integrate it with Home Assistant instances. For a standalone Home Assistant UI built using 50 lines of JavaScript, see [this glitch](https://hass-auth-demo.glitch.me/).
* **Easy extension development using modules and unpkg.** Developers are able to develop their own cards without running any tooling. All you need is to create a JavaScript file, reference it in the resource section of your config and you can start using it ([example in the docs](https://developers.home-assistant.io/docs/en/lovelace_custom_card.html#advanced-example)). We default to importing resources as type=module, so that developers can import their dependencies straight from http://unpkg.com during development.
* **Make it easy to find bloat in bundles.** If we can make it easier to find things that we ship unnecessarily, developers are more likely to find it and  spend time on removing the bloat. For that reason, we include scripts in our repository that allows anyone to quickly run a bundle analysis using the [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) and see what packages add to our bundle size. These analysis look [like this](https://s3.amazonaws.com/home-assistant-demos/bundle-analysis/report-20190522.html).
* **Code split translations.** We use [lokalise.co](https://lokalise.co/) to manage our translations. All translation strings in our code base are automatically uploaded to lokalise.co where volunteers are translating the available strings. We have build tooling to split our translations based on the different panels in our UI. This allows us to only load the translations on the fly that we need.
* **Decentralized routing.** The top level of the application only knows how to route the first part of the url. It knows which code to load and which web component to instantiate. It will pass the rest of the url to the panel and further routing can be done from there. This will avoid the initial bundle to keep growing as more parts are splitter out. We have also created a simple to use router for web components with support for code splitting and loading screens, making it easy for our developers to do the right thing.
* **Avoid doing things when the source is parsed or classes are initialized.** This one is in the category “Do less and be lazy”. It is important to get to the initial render as fast as possible. It’s therefore important that you avoid anything that isn’t necessary. Lit Element helps with this by offering life cycle hooks that are run after the update is complete. There is no “run before component will update” life cycle.

  A great example of this mantra in Polymer is debounce. Their debounce will not generate a debounced function, but instead you only call it when you want to call the function. It might then call the function and will return a piece of state that you need to pass back in on the next invocation. That way you don’t need to generate a debounced function before it is needed.

# Challenges / Future Improvements

We do a lot of cool things, but the work is never done. Here are some challenges we faced and future improvements that we might explore. One interesting observation I had while writing this list, is that some of the problems we have are not due to bad design, but are due to outgrowing the design. The designs were the right designs when the UI was smaller, but now that we have grown we need to adapt.

* **Dealing with duplicate custom element names.** A custom element can only be defined once. This means that if a component imports a different version, this will go haywire. Home Assistant has it’s own specialized operating system [Hass.io](https://www.home-assistant.io/hassio/) which ships with it’s own control panel on it’s own release cycle. We were unable to make any guarantees on version compatibility, and after one time too many of breaking our users UI, we sat down and solved it: we are running the Hass.io control panel in an iframe so that the custom elements are isolated from the parents page.

  We also offer this functionality as an extension point for developers. Via the [custom panel integration](https://www.home-assistant.io/components/panel_custom/) they can build their own panel with optional iframe isolation. The other use case we found for iframe isolation was for React. This web framework is popular but does not work in ShadowDOM. By isolating it in an iframe, we were able to solve this too ([example code](https://github.com/home-assistant/custom-panel-starter-kit-react)).
* **Moving away from trying to put everything in Webpack.** When the project moved from HTML imports to JS imports, we switched to WebPack as our bundler of choice. We got a little too excited and did everything in WebPack, including generating HTML. Since we have two builds of our frontend, we actually have two WebPack builds. By putting everything in WebPack, we made it impossible to create files that could refer to the hashed filenames of both the modern and ES5 version of our builds. It’s our goal to minimize WebPack’s duties to transpiling TypeScript, bundling the files and minification. By reducing the responsibilities, it will be easier for us to try out other bundlers. I am looking forward to experiment with [Rollup](https://rollupjs.org/) + [Closure Compiler plugin](https://github.com/ampproject/rollup-plugin-closure-compiler).
* **Use [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_imports) in our modern JavaScript build.** WebPack only has a single output mode for bundled builds, which uses their own dependency injection system at runtime. If we can switch to Rollup, we should be able to leverage dynamic imports, which are built into browsers.
* **Removing Polymer from main bundle.** The first version of the UI was built with the Polymer web framework and the [Paper elements](https://www.webcomponents.org/collection/polymerelements/paper-elements), a set of material design components built using Polymer. We still have some core UI code that relies on Polymer, which means that it’s still part of the initial UI bundle. That means that currently both Polymer and Lit Element are part of our initial bundle, bloating this bundle unnecessarily.
* **Translating all the strings.** We still ship text that is not translated yet. Home Assistant is used in homes by all demographics. It is important that users can use the UI in a language that they understand. On top of that, we have made great strides with RTL support recently and most is covered, but there are still places where this can be improved too.
* **Decentralize all the things.** One of my key takeaways from Malte Ubl’s post about [designing big JavaScript applications](https://medium.com/@cramforce/designing-very-large-javascript-applications-6e013a3291a3) is to avoid central configuration. Central configuration will just keep growing as the application grows, and if that is part of the main bundle, you will ship unnecessary things. This currently manifests itself in two places in our code:
    * We ship an iconset that is build as part of the release and contains all icons referenced in the whole UI. As our UI grows, this iconset is growing. It now includes a lot of icons that are no longer required for initial load but are still loaded. An option to explore is to replace our current icon rendering components with one that supports lit-html templates that contain the SVG icons. We can then start loading the icons via our normal JS import. This will allow our JS bundler to only include the icons referenced by the code in the bundle. We should make sure that we can mark these files as being ok to be duplicated, or else the JS bundler will generate a lot of tiny bundles with just a single icon.
    * We currently split our translation files out per language and per panel of the UI and then individually fingerprint each file. This manifests file is included in our initial build, and as our app has grown in panels and we have gained support for more languages, our manifest file is now a big chunk of our initial UI bundle. Our first step should be to generate a single hash per language, allowing us to only contain a single line per language.
* **Analyze current code splitting algorithm.** Right now WebPack will make sure that each JavaScript file is only loaded once (as per the spec). However, this means that we end up with certain files no longer being bundled at all, because there are too many code splitted pieces of code that reference that file, it ends up in its own chunk. Right now our frontend build contains 126 code splitted chunks, of which 85 are less than 5KB! We need to run traces to see if this is a problem, or that the service worker hides most of this.
* **Stop using local storage.** We use local storage to store the auth tokens, the language preference and if the sidebar is shown. Since local storage is accessed synchronously, the browser will stop executing anything on the page while it is waiting for the local storage to be read from disk. Browser vendors are working on alternatives like [kv-storage](https://github.com/WICG/kv-storage) which are asynchronously and might become a viable alternative.
* **Swap out Paper elements for [Material Web Components](https://github.com/material-components/material-components-web-components).** The Paper elements are no longer maintained and Material Web Components will be the successor, however they are still under development. The MWC components use Lit Element under the hood and rely on the material.io VanillaJS implementation of Material design. This means that they will be a lot lighter than the current Paper elements and will actually be maintained.

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
