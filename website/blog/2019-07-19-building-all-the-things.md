---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Building All The Things
---

_How Home Assistant is using Azure Pipelines to automate all the things._

Here at Home Assistant, we love automation! Not only in our homes, but also when doing development work. We do a release every three weeks and it includes code from over 80 different people. All is managed by only two people working on this full-time (thanks [Nabu Casa](https://www.nabucasa.com)!).

We distribute Home Assistant as a Python package, and as part of our all-in-one system called Hass.io. Hass.io has its own operating system, a supervisor Docker container and the Home Assistant docker container. Besides that, Hass.io supports add-ons, of which we have a set of official add-ons that we also maintain. Everything we do for Hass.io, we have to do five times, once for each of our supported architectures: amd64, i386, armv6, armv7, aarch64.

To still be able to move fast, we spend a lot of time on automating build tasks. After working with [TravisCI](https://travis-ci.org/) and [CircleCI](https://circleci.com/), we have finally landed on [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/).

We started out with Travis but realized that we could significantly speed up our builds by leveraging the CircleCI open source plan that includes 4 workers, test distribution and build artifact caching. We tried to get more workers with CircleCI but adding workers under their new pricing plan was too expensive.

[Pascal Vizeli](https://www.github.com/pvizeli) had experience with Azure from a previous job, and he was able to migrate and build all the YAML based pipelines in days. He did this with support from [Kees Schollaart](https://twitter.com/keesschollaart), who is a DevRel at Azure but famous in our community for creating the [Home Assistant Companion extension for VS Code](https://marketplace.visualstudio.com/items?itemName=keesschollaart.vscode-home-assistant). He helped us a lot whenever we got stuck.

Azure’s open source plan comes with 10 free agents, and after we reached out to Microsoft, we were provided 20 additional agents to help us automate all the things!

Interested to see what we do with all this Azure power?

<!--truncate-->

## Continuous Integration

All changes to Home Assistant go through our CI pipeline. When a pull request to the Home Assistant repository comes in, it will trigger a pipeline as configured in [`azure-pipelines-ci.yml`](https://github.com/home-assistant/home-assistant/blob/dev/azure-pipelines-ci.yml).

Contributions to Home Assistant are tested against our test suite, code style and typing, to make sure that the contribution does not break things. We have split our test suite into 3 different stages. By using stages, we can run a quick validation stage and fail fast if it’s not correct.

This strategy allows us to not waste any of our workers time on running a full test suite if we know that basic linting is not going to pass.

Below is a screenshot of our CI pipeline for Home Assistant. Because all work is distributed over multiple workers, the total runtime is the longest task in the first column, plus the longest task in the second column.

<center>
![Screenshot of the Home Assistant CI pipeline.](/img/en/blog/2019-07-building-all-the-things/test-stages.png)</center>

To improve the time of our CI on Azure, we’re using a preview version of [pipeline artifact caching](https://marketplace.visualstudio.com/items?itemName=1ESLighthouseEng.PipelineArtifactCaching). This allows us to build the dependencies once, store it as a package close to the test runners and re-use it across jobs and pipeline runs.

Another optimization that we do is that we use our own base images for the test runners. These images already have the correct Python and other base utilities installed. We add them to the [resources](https://github.com/home-assistant/home-assistant/blob/de3d28d9d5bd5dd69cf9f84d021d683da2c322d6/azure-pipelines-ci.yml#L12-L18), and then later reference them in the [strategy](https://github.com/home-assistant/home-assistant/blob/de3d28d9d5bd5dd69cf9f84d021d683da2c322d6/azure-pipelines-ci.yml#L72-L80) section.

CircleCI had a nice feature that it could distribute your tests over multiple workers by keeping track of the duration of each test. This was reducing the duration of the PyTest suite to around 10 minutes. This is using more agents and we would quickly run out of agents, creating a big backlog. Subsequent stages are only enqueued once the “Overview” stage finishes, causing them to be in the queue behind other contributions that came in.

With Azure, we get more runners which are more powerful and faster, but no parallelization. This means that an individual build will take longer, however, with many builds coming in, the individual build time remains roughly the same, as we are not experiencing any backlog.

<center>
![Screenshot of the Home Assistant CI pipeline.](/img/en/blog/2019-07-building-all-the-things/test-results.png)<br>
Screenshot of the [test results](https://dev.azure.com/home-assistant/Home%20Assistant/_build/results?buildId=3976&view=ms.vss-test-web.build-test-results-tab).
</center>

## Building HassOS

HassOS is our own embedded Linux distribution. It is tailored to run the bare minimum of what we need to run Home Assistant in a Docker container. BuildRoot powers the build and we’re targeting five different processor architectures.

The Azure Pipelines agents are using the amd64 CPU architecture. It is possible to compile for different architectures using a method called cross-compiling. We gave it a shot but realized that it is significanty slower than compiling a build using the same native CPU's as that we’re targeting.

We use a feature on Azure Pipelines called [self-hosted agents](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/agents?view=azure-devops#install) to host build agents on our own hardware with the right architecture. Azure Pipelines manages the pipeline definition and the orchestration, but the execution runs blazing fast on our own hardware.

<center>
![Screenshot of the Home Assistant CI pipeline.](/img/en/blog/2019-07-building-all-the-things/build-cabinet.jpg)<br>
Our build cabinet.
</center>

## Building Python Wheels

Home Assistant ships as a standalone Python package, and bundled up in Docker containers. Our Docker containers contain all the Python packages for our different integrations pre-installed. Because of this, creating a Docker container took a long time, as we had to install and build each Python package for each architecture. Home Assistant + all integrations rely upon over a 1000 different Python packages.

To speed this up, we’re leveraging Python Wheels. Wheels are a binary format that contains pre-build Python packages for a specific operating system and CPU architecture. We have an Azure pipeline to help build wheels for all the different packages on all supported CPU architectures. That’s a total of 5000 wheels!

A special wheels format that can target many platforms with a single build. We are unable to use that because it is not compatible with musl libc, which is what Alpine uses.

This pipeline is triggered automatically when a contribution has been accepted and merged into development and it changed any requirements ([pipeline definition](https://github.com/home-assistant/home-assistant/blob/de3d28d9d5bd5dd69cf9f84d021d683da2c322d6/azure-pipelines-wheels.yml#L3-L10)). We also run it daily to make sure that all changes have been captured.

Because installation using a wheel is significantly faster, we also offer custom integrations to [register themselves](https://github.com/home-assistant/custom-components-wheels). We will scan each custom integration once a day to make sure we have wheels for the Python packages that they use.

By leveraging wheels, we have been able to reduce the build time of our Home Assistant containers for Hass.io from 1 hour to 10 minutes (measurement from the amd64 build).

_(sidenote. Python is named after Monty Python, and the package index got called “the Cheese Shop” after one of their famous sketches. The Wheel format is thus named after a wheel of cheese, not the wheels of a car. 5000 wheels of cheese is a lot of cheese.)_

## Building Home Assistant releases

Home Assistant does a stable release every three weeks. Prior to this stable release, we usually have around 6 beta releases. After a stable release, we usually have 2 or 3 patch releases.

Each release will need to be built as a standalone Python package, and a Docker container for each of the five supported CPU architectures.

This pipeline is triggered whenever a [new release is tagged](https://github.com/home-assistant/home-assistant/blob/dev/azure-pipelines-release.yml#L3-L7). We first verify that the tag name matches the version in the code and that the release was created by one of our whitelisted release managers. We will then automatically build all the releases and publish them.

## Building Hass.io add-ons

One of the features of Hass.io is add-ons. Add-ons allow developers to re-use the same infrastructure that Home Assistant uses to run inside Hass.io, but for any other programs that you want to run on your network. These add-ons can tightly integrate with Home Assistant. For example, it is possible to install AdGuard from the [Community Add-ons](https://github.com/hassio-addons/repository) with one click and have it’s data be accessible inside Home Assistant.

Hass.io contains a couple of core add-ons. Each release of these add-ons will too need to be built for all five architectures. We keep all the add-ons in a single repository, but each add-on has its own pipeline definition that is only triggered when that add-on changes ([example](https://github.com/home-assistant/hassio-addons/blob/master/mosquitto/azure-pipelines.yml)).

## Conclusion

Building out a wide range of automations has really helped Home Assistant scale with a minimum amount of human resources. We’re really happy with all the help that we have received from Azure and their employees. Cheers!

## Links

- [Home Assistant on Azure Pipelines](https://dev.azure.com/home-assistant/Home%20Assistant/_build)
- [Hass.io on Azure Pipelines](https://dev.azure.com/home-assistant/Hass.io/_build)

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
